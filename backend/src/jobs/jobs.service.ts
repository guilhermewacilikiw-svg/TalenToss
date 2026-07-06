import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService
  ) {}

  async create(companyId: string, data: any) {
    // 1. Verificar créditos
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    if (company.plan === 'FREE' && company.credits <= 0) {
      throw new ForbiddenException('Saldo insuficiente. Faça o upgrade para o plano PRO ou adquira um pacote de vagas avulsas para continuar recrutando.');
    }

    // 2. Criar a vaga
    const job = await this.prisma.job.create({
      data: {
        ...data,
        company: { connect: { id: companyId } },
      },
    });

    // 3. Descontar crédito se for FREE
    if (company.plan === 'FREE') {
      await this.prisma.company.update({
        where: { id: companyId },
        data: { credits: { decrement: 1 } },
      });
    }

    try {
      const structuredProfile = await this.ai.structureJobProfile(data.title, data.description, data.requirements || []);
      const embedding = await this.ai.generateEmbedding(structuredProfile);
      if (embedding && embedding.length === 768) {
        const vectorStr = `[${embedding.join(',')}]`;
        await this.prisma.$executeRawUnsafe(
          `UPDATE "Job" SET "jobVector" = $1::vector WHERE id = $2`,
          vectorStr,
          job.id
        );
      }
    } catch (e) {
      console.error('Erro ao gerar embedding da vaga', e);
    }

    return job;
  }

  async findAll(filters: any) {
    return this.prisma.job.findMany({
      where: {
        status: 'OPEN',
        ...(filters.search && { title: { contains: filters.search, mode: 'insensitive' } }),
      },
      include: { company: true },
    });
  }

  async findByCompany(companyId: string) {
    return this.prisma.job.findMany({
      where: { companyId },
    });
  }

  async update(jobId: string, companyId: string, data: any) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.companyId !== companyId) throw new ForbiddenException('Not your job');

    return this.prisma.job.update({
      where: { id: jobId },
      data,
    });
  }

  async getMatchingCandidates(jobId: string, companyId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.companyId !== companyId) throw new ForbiddenException('Not your job');

    // 1. Pega todos que já se candidataram (via plataforma)
    const applications = await this.prisma.application.findMany({
      where: { jobId },
      include: { candidate: true }
    });

    // 2. Pega recomendados pela Inteligência Artificial
    let aiMatches: any[] = [];
    try {
      aiMatches = await this.prisma.$queryRawUnsafe(`
        SELECT 
          c.id, 
          c."firstName", 
          c."lastName", 
          c.headline,
          c."employabilityScore",
          (1 - (c."profileVector" <=> j."jobVector")) * 100 AS match_score
        FROM "Candidate" c
        JOIN "Job" j ON j.id = $1
        WHERE c."profileVector" IS NOT NULL AND j."jobVector" IS NOT NULL
        ORDER BY match_score DESC
        LIMIT 20;
      `, jobId);
    } catch (e) {
      console.error("Erro na busca vetorial:", e);
    }

    const resultsMap = new Map();

    // Adiciona recomendados primeiro
    for (const m of aiMatches) {
      resultsMap.set(m.id, {
        ...m,
        match_score: Math.round(m.match_score || 0),
        application_status: 'APPLIED', // Coluna 'Novos/Recomendados'
        is_manual_applicant: false
      });
    }

    // Adiciona e sobrepõe quem realmente se candidatou
    for (const app of applications) {
      const existing = resultsMap.get(app.candidateId);
      if (existing) {
        existing.application_status = app.status;
        if (app.matchScore) existing.match_score = Math.round(app.matchScore);
        existing.is_manual_applicant = true;
      } else {
        resultsMap.set(app.candidateId, {
          id: app.candidate.id,
          firstName: app.candidate.firstName,
          lastName: app.candidate.lastName,
          headline: app.candidate.headline,
          employabilityScore: app.candidate.employabilityScore,
          match_score: Math.round(app.matchScore || 0),
          application_status: app.status,
          is_manual_applicant: true
        });
      }
    }

    return Array.from(resultsMap.values()).sort((a, b) => b.match_score - a.match_score);
  }

  async getApplications(jobId: string, companyId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.companyId !== companyId) throw new ForbiddenException('Not your job');

    return this.prisma.application.findMany({
      where: { jobId },
      include: {
        candidate: {
          include: {
            user: { select: { email: true } }
          }
        }
      },
      orderBy: { matchScore: 'desc' }
    });
  }

  async updateApplicationStatus(applicationId: string, companyId: string, status: 'SCREENING' | 'REJECTED' | 'INTERVIEW' | 'HIRED') {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    });

    if (!application) throw new NotFoundException('Application not found');
    if (application.job.companyId !== companyId) throw new ForbiddenException('Not your job');

    const updatedApp = await this.prisma.application.update({
      where: { id: applicationId },
      data: { status }
    });

    if (status === 'HIRED') {
      await this.prisma.job.update({
        where: { id: application.jobId },
        data: { status: 'CLOSED' }
      });
    }

    return updatedApp;
  }

  async upsertCandidateStatus(jobId: string, candidateId: string, companyId: string, status: 'APPLIED' | 'SCREENING' | 'REJECTED' | 'INTERVIEW' | 'HIRED') {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.companyId !== companyId) throw new ForbiddenException('Not your job');

    const updatedApp = await this.prisma.application.upsert({
      where: {
        jobId_candidateId: { jobId, candidateId }
      },
      update: { status },
      create: { jobId, candidateId, status }
    });

    if (status === 'HIRED') {
      await this.prisma.job.update({
        where: { id: jobId },
        data: { status: 'CLOSED' }
      });
    }

    return updatedApp;
  }

  async getApplicationMessages(applicationId: string, user: any) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true, candidate: true }
    });

    if (!application) throw new NotFoundException('Application not found');

    // Validation
    if (user.role === 'COMPANY') {
      const company = await this.prisma.company.findUnique({ where: { userId: user.userId } });
      if (!company || application.job.companyId !== company.id) throw new ForbiddenException('Not your job');
    } else if (user.role === 'CANDIDATE') {
      const candidate = await this.prisma.candidate.findUnique({ where: { userId: user.userId } });
      if (!candidate || application.candidateId !== candidate.id) throw new ForbiddenException('Not your application');
    }

    return this.prisma.message.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'asc' }
    });
  }

  async sendMessage(applicationId: string, user: any, content: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true, candidate: true }
    });

    if (!application) throw new NotFoundException('Application not found');

    let senderId = '';
    
    // Validation
    if (user.role === 'COMPANY') {
      const company = await this.prisma.company.findUnique({ where: { userId: user.userId } });
      if (!company || application.job.companyId !== company.id) throw new ForbiddenException('Not your job');
      senderId = company.id;
    } else if (user.role === 'CANDIDATE') {
      const candidate = await this.prisma.candidate.findUnique({ where: { userId: user.userId } });
      if (!candidate || application.candidateId !== candidate.id) throw new ForbiddenException('Not your application');
      senderId = candidate.id;
    } else {
      throw new ForbiddenException('Invalid role');
    }

    return this.prisma.message.create({
      data: {
        applicationId,
        senderId,
        senderRole: user.role,
        content
      }
    });
  }
}
