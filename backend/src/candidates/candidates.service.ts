import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import * as fs from 'fs';
import * as path from 'path';
const pdfParse = require('pdf-parse');

@Injectable()
export class CandidatesService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService
  ) {}

  async getProfile(userId: string) {
    return this.prisma.candidate.findUnique({
      where: { userId },
      include: { user: { select: { email: true } } },
    });
  }

  async uploadResume(userId: string, fileBuffer: Buffer) {
    // 0. Save file to disk
    const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const fileName = `${userId}-${Date.now()}.pdf`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, fileBuffer);
    const resumeUrl = `/candidates/resume/${fileName}`;

    // 1. Extrair texto do PDF
    let text = '';
    try {
      const pdfData = await pdfParse(fileBuffer);
      text = pdfData.text;
    } catch (e) {
      console.warn('Falha ao fazer parse do PDF. Usando texto dummy.', e.message);
      text = 'Desenvolvedor Frontend com experiência em React, Next.js e TypeScript.';
    }

    // 2. Passar para a IA estruturar o JSON
    const parsedData = await this.ai.parseResume(text);

    // 3. Obter ou criar o perfil do candidato
    let candidate = await this.prisma.candidate.findUnique({ 
      where: { userId },
      include: { user: true }
    });
    
    // Apagar o currículo antigo do disco se existir (Manter apenas o mais recente)
    if (candidate && candidate.resumeUrl) {
      try {
        const oldFileName = candidate.resumeUrl.split('/').pop();
        if (oldFileName) {
          const oldFilePath = path.join(uploadDir, oldFileName);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      } catch (err) {
        console.error('Erro ao apagar curriculo antigo:', err);
      }
    }

    if (!candidate) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const emailPrefix = user?.email.split('@')[0] || 'Candidato';
      
      candidate = await this.prisma.candidate.create({
        data: {
          userId,
          firstName: parsedData.firstName || parsedData.name?.split(' ')[0] || emailPrefix,
          lastName: parsedData.lastName || parsedData.name?.split(' ').slice(1).join(' ') || '',
          resumeUrl,
        },
        include: { user: true }
      });
    }

    // 4. Atualizar o perfil com os dados básicos extraídos
    const updatedCandidate = await this.prisma.candidate.update({
      where: { userId },
      data: {
        firstName: parsedData.firstName || candidate.firstName,
        lastName: parsedData.lastName || candidate.lastName,
        headline: parsedData.headline || candidate.headline,
        summary: parsedData.summary || candidate.summary,
        employabilityScore: parsedData.employabilityScore || candidate.employabilityScore,
        phone: parsedData.phone || candidate.phone,
        location: parsedData.location || candidate.location,
        linkedinUrl: parsedData.linkedinUrl || candidate.linkedinUrl,
        githubUrl: parsedData.githubUrl || candidate.githubUrl,
        skills: parsedData.skills && parsedData.skills.length > 0 ? parsedData.skills : candidate.skills,
        experiences: parsedData.experiences && parsedData.experiences.length > 0 ? parsedData.experiences : candidate.experiences,
        education: parsedData.education && parsedData.education.length > 0 ? parsedData.education : candidate.education,
        courses: parsedData.courses && parsedData.courses.length > 0 ? parsedData.courses : candidate.courses,
        resumeUrl,
      }
    });
    
    // 5. Gerar e Salvar o Embedding (Vector) do Perfil Inteligente
    try {
      // Cria uma string combinada rica em semântica para o embedding
      const semanticText = `
        Perfil Profissional Ideal:
        Senioridade ou Foco: ${parsedData.headline || ''}
        Resumo: ${parsedData.summary || ''}
        Competências Técnicas e Proficiência: ${(parsedData.skills || []).join(', ')}
        
        Experiência Comprovada e Tempo de Atuação:
        ${(parsedData.experiences || []).map((e: any) => {
          const periodStr = e.period ? `(Tempo: ${e.period})` : '';
          return `Cargo: ${e.title || e.position} em ${e.company} ${periodStr}. Responsabilidades e Conquistas: ${e.description}`;
        }).join(' | ')}
      `;
      
      const embedding = await this.ai.generateEmbedding(semanticText);
      
      if (embedding && embedding.length === 768) {
        // Formatar o array como a string '[1.23, 4.56, ...]' que o pgvector espera
        const vectorStr = `[${embedding.join(',')}]`;
        
        await this.prisma.$executeRawUnsafe(
          `UPDATE "Candidate" SET "profileVector" = $1::vector WHERE id = $2`,
          vectorStr,
          updatedCandidate.id
        );
      }
    } catch (e) {
      console.error('Erro ao gerar embedding do candidato', e);
    }

    return updatedCandidate;
  }

  async applyToJob(userId: string, jobId: string) {
    const candidate = await this.prisma.candidate.findUnique({ where: { userId } });
    if (!candidate) {
      throw new Error('Candidate not found');
    }

    // Calcular match usando a query nativa do pgvector com maior exigência
    // Uma similaridade abaixo de 0.65 resultará em 0%, e 1.0 resultará em 100%.
    const matches: any[] = await this.prisma.$queryRawUnsafe(`
      SELECT 
        GREATEST(0, ((1 - (c."profileVector" <=> j."jobVector")) - 0.65) / 0.35) * 100 AS match_score
      FROM "Candidate" c
      CROSS JOIN "Job" j
      WHERE c.id = $1 AND j.id = $2
      AND c."profileVector" IS NOT NULL AND j."jobVector" IS NOT NULL
      LIMIT 1;
    `, candidate.id, jobId);

    const matchScore = matches.length > 0 && matches[0].match_score ? Math.round(matches[0].match_score) : null;

    const application = await this.prisma.application.create({
      data: {
        jobId,
        candidateId: candidate.id,
        matchScore,
      }
    });

    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    
    if (job) {
      // 1. Chamar o Bot para iniciar a conversa
      const botResponse = await this.ai.conductInterview(job, candidate, []);

      // 2. Salvar a resposta do Bot
      await this.prisma.message.create({
        data: {
          applicationId: application.id,
          senderId: job.companyId, // Mock as company
          senderRole: 'COMPANY', // Treat AI as company representative
          content: botResponse
        }
      });
    }

    return application;
  }

  async getMyApplications(userId: string) {
    const candidate = await this.prisma.candidate.findUnique({ where: { userId } });
    if (!candidate) return [];

    return this.prisma.application.findMany({
      where: { candidateId: candidate.id },
      include: {
        job: {
          include: { company: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { companyProfile: true } });
    
    if (user?.role === 'COMPANY') {
      if (user.companyProfile?.plan !== 'PREMIUM') {
        throw new ForbiddenException('Acesso ao Banco de Talentos é exclusivo para assinantes Premium.');
      }
    }

    return this.prisma.candidate.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { employabilityScore: 'desc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.candidate.findUnique({
      where: { id },
      include: { user: { select: { email: true } } },
    });
  }

  async updateProfile(userId: string, data: any) {
    let candidate = await this.prisma.candidate.findUnique({ where: { userId } });
    
    if (!candidate) {
      // Cria se não existir
      candidate = await this.prisma.candidate.create({
        data: {
          userId,
          firstName: data.firstName || 'Candidato',
          lastName: data.lastName || '',
          headline: data.headline || '',
          summary: data.summary || '',
          phone: data.phone || null,
          location: data.location || null,
          linkedinUrl: data.linkedinUrl || null,
          githubUrl: data.githubUrl || null,
          skills: data.skills || [],
          experiences: data.experiences || [],
          education: data.education || [],
          courses: data.courses || [],
          salaryExpectation: data.salaryExpectation || null,
          workModel: data.workModel || null,
        }
      });
    } else {
      // Atualiza se existir
      candidate = await this.prisma.candidate.update({
        where: { userId },
        data: {
          firstName: data.firstName !== undefined ? data.firstName : candidate.firstName,
          lastName: data.lastName !== undefined ? data.lastName : candidate.lastName,
          headline: data.headline !== undefined ? data.headline : candidate.headline,
          summary: data.summary !== undefined ? data.summary : candidate.summary,
          phone: data.phone !== undefined ? data.phone : candidate.phone,
          location: data.location !== undefined ? data.location : candidate.location,
          linkedinUrl: data.linkedinUrl !== undefined ? data.linkedinUrl : candidate.linkedinUrl,
          githubUrl: data.githubUrl !== undefined ? data.githubUrl : candidate.githubUrl,
          skills: data.skills !== undefined ? data.skills : candidate.skills,
          experiences: data.experiences !== undefined ? data.experiences : candidate.experiences,
          education: data.education !== undefined ? data.education : candidate.education,
          courses: data.courses !== undefined ? data.courses : candidate.courses,
          salaryExpectation: data.salaryExpectation !== undefined ? data.salaryExpectation : candidate.salaryExpectation,
          workModel: data.workModel !== undefined ? data.workModel : candidate.workModel,
        }
      });
    }

    // Regerar embedding se o summary, headline ou skills mudaram
    if (data.headline !== undefined || data.summary !== undefined || data.skills !== undefined) {
      try {
        const semanticText = `
          Headline: ${candidate.headline || ''}
          Summary: ${candidate.summary || ''}
          Skills: ${(candidate.skills as string[] || []).join(', ')}
        `;
        const embedding = await this.ai.generateEmbedding(semanticText);
        if (embedding && embedding.length === 768) {
          const vectorStr = `[${embedding.join(',')}]`;
          await this.prisma.$executeRawUnsafe(
            `UPDATE "Candidate" SET "profileVector" = $1::vector WHERE id = $2`,
            vectorStr,
            candidate.id
          );
        }
      } catch (e) {
        console.error('Erro ao atualizar embedding do candidato', e);
      }
    }

    return candidate;
  }

  async getChatHistory(userId: string, applicationId: string) {
    const candidate = await this.prisma.candidate.findUnique({ where: { userId } });
    if (!candidate) throw new BadRequestException('Candidate not found');

    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, candidateId: candidate.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });

    if (!application) throw new BadRequestException('Application not found');

    return application.messages;
  }

  async sendChatMessage(userId: string, applicationId: string, content: string) {
    const candidate = await this.prisma.candidate.findUnique({ where: { userId } });
    if (!candidate) throw new BadRequestException('Candidate not found');

    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, candidateId: candidate.id },
      include: { 
        job: true,
        candidate: true,
        messages: { orderBy: { createdAt: 'asc' } } 
      }
    });

    if (!application) throw new BadRequestException('Application not found');

    // 1. Salvar a mensagem do candidato
    const userMsg = await this.prisma.message.create({
      data: {
        applicationId,
        senderId: candidate.id,
        senderRole: 'CANDIDATE',
        content
      }
    });

    // 2. Chamar o Bot para responder
    const newHistory = [...application.messages, userMsg];
    const botResponse = await this.ai.conductInterview(application.job, application.candidate, newHistory);

    // 3. Salvar a resposta do Bot
    const botMsg = await this.prisma.message.create({
      data: {
        applicationId,
        senderId: application.job.companyId, // Mock as company
        senderRole: 'COMPANY', // Treat AI as company representative
        content: botResponse
      }
    });

    // 4. Checar se a entrevista foi finalizada
    if (botResponse.includes('[ENTREVISTA_FINALIZADA]')) {
      const summary = botResponse.replace('[ENTREVISTA_FINALIZADA]', '').trim();
      
      await this.prisma.application.update({
        where: { id: applicationId },
        data: { 
          aiAnalysis: summary + '\n\n(Triagem feita por Chatbot)',
          status: 'APPLIED' 
        }
      });
    }

    return botMsg;
  }
}
