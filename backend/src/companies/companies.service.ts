import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.company.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.company.findUnique({
      where: { userId },
      include: { jobs: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.company.update({
      where: { id },
      data,
    });
  }

  async getPublicProfile(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        jobs: {
          where: { status: 'OPEN' },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            description: true,
            requirements: true,
            createdAt: true,
          }
        }
      }
    });

    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async getAnalyticsOverview(userId: string) {
    const company = await this.findByUser(userId);
    if (!company) throw new NotFoundException('Company not found');

    const jobs = await this.prisma.job.findMany({
      where: { companyId: company.id },
      include: { applications: true }
    });

    const activeJobs = jobs.filter(j => j.status === 'OPEN').length;
    const closedJobs = jobs.filter(j => j.status === 'CLOSED').length;
    
    let totalApplications = 0;
    let sumMatchScore = 0;
    let scoredApplicationsCount = 0;

    const funnel = {
      applied: 0,
      interview: 0,
      offer: 0,
      hired: 0,
      rejected: 0
    };

    const applicationsByJob = jobs.map(j => ({
      name: j.title.substring(0, 15) + '...',
      applications: j.applications.length
    }));

    const recentApplications = await this.prisma.application.findMany({
      where: { job: { companyId: company.id } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        candidate: { select: { firstName: true, lastName: true, headline: true } },
        job: { select: { title: true } }
      }
    });

    jobs.forEach(job => {
      totalApplications += job.applications.length;
      job.applications.forEach(app => {
        if (app.matchScore) {
          sumMatchScore += app.matchScore;
          scoredApplicationsCount++;
        }
        
        const st = app.status.toLowerCase();
        if (funnel[st as keyof typeof funnel] !== undefined) {
          funnel[st as keyof typeof funnel]++;
        } else if (app.status === 'APPLIED') {
          funnel.applied++;
        }
      });
    });

    const avgMatchScore = scoredApplicationsCount > 0 ? Math.round(sumMatchScore / scoredApplicationsCount) : 0;

    return {
      activeJobs,
      closedJobs,
      totalApplications,
      avgMatchScore,
      funnel: [
        { name: 'Inscritos', value: funnel.applied },
        { name: 'Entrevista', value: funnel.interview },
        { name: 'Proposta', value: funnel.offer },
        { name: 'Contratados', value: funnel.hired }
      ],
      applicationsByJob,
      recentApplications: recentApplications.map(app => ({
        id: app.id,
        candidateName: `${app.candidate.firstName} ${app.candidate.lastName}`,
        headline: app.candidate.headline,
        jobTitle: app.job.title,
        status: app.status,
        matchScore: Math.round(app.matchScore || 0),
        date: app.createdAt
      }))
    };
  }
}
