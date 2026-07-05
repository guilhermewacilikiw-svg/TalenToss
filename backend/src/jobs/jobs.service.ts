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
      const semanticText = `Title: ${data.title}\nDescription: ${data.description}\nRequirements: ${(data.requirements || []).join(', ')}`;
      const embedding = await this.ai.generateEmbedding(semanticText);
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

    // Usa raw query para calcular a similaridade de cosseno (1 - cosine_distance)
    const matches: any[] = await this.prisma.$queryRawUnsafe(`
      SELECT 
        c.id, 
        c."firstName", 
        c."lastName", 
        c.headline,
        c."employabilityScore",
        (1 - (c."profileVector" <=> j."jobVector")) * 100 AS match_score,
        a.status as application_status
      FROM "Candidate" c
      JOIN "Job" j ON j.id = $1
      LEFT JOIN "Application" a ON a."candidateId" = c.id AND a."jobId" = $1
      WHERE c."profileVector" IS NOT NULL AND j."jobVector" IS NOT NULL
      ORDER BY match_score DESC
      LIMIT 20;
    `, jobId);

    return matches.map(m => ({
      ...m,
      match_score: Math.round(m.match_score)
    }));
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

  async updateApplicationStatus(applicationId: string, companyId: string, status: 'SCREENING' | 'REJECTED') {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    });

    if (!application) throw new NotFoundException('Application not found');
    if (application.job.companyId !== companyId) throw new ForbiddenException('Not your job');

    return this.prisma.application.update({
      where: { id: applicationId },
      data: { status }
    });
  }
}
