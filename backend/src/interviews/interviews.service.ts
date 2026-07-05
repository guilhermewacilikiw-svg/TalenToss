import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleService } from '../google/google.service';

@Injectable()
export class InterviewsService {
  constructor(
    private prisma: PrismaService,
    private googleService: GoogleService
  ) {}

  async findAllByCompany(userId: string) {
    const company = await this.prisma.company.findUnique({ where: { userId } });
    if (!company) return [];

    return this.prisma.interview.findMany({
      where: { companyId: company.id },
      include: {
        candidate: true,
        job: true
      },
      orderBy: { date: 'asc' }
    });
  }

  async scheduleInterview(userId: string, data: any) {
    const company = await this.prisma.company.findUnique({ where: { userId } });
    if (!company) throw new Error('Company not found');

    const candidate = await this.prisma.candidate.findUnique({ 
      where: { id: data.candidateId },
      include: { user: true }
    });
    const job = await this.prisma.job.findUnique({ where: { id: data.jobId } });

    if (!candidate || !job) throw new Error('Candidate or Job not found');

    // Google Calendar Event
    const eventDetails = {
      summary: `Entrevista: ${job.title} - ${candidate.firstName} ${candidate.lastName}`,
      description: `Entrevista agendada pela plataforma TalentAI.\n\nVaga: ${job.title}\nCandidato: ${candidate.firstName} ${candidate.lastName}`,
      start: data.startDateTime,
      end: data.endDateTime,
      attendees: candidate.user ? [{ email: candidate.user.email }] : []
    };

    let googleEventId = null;
    let meetLink = null;

    try {
      const gEvent = await this.googleService.createEvent(company.id, eventDetails);
      googleEventId = gEvent.id;
      meetLink = gEvent.hangoutLink;
    } catch (err) {
      console.warn('Could not create Google Event:', err.message);
    }

    // Atualiza ou cria a application com status INTERVIEWING
    await this.prisma.application.upsert({
      where: {
        jobId_candidateId: {
          jobId: data.jobId,
          candidateId: data.candidateId,
        }
      },
      update: {
        status: 'INTERVIEWING'
      },
      create: {
        jobId: data.jobId,
        candidateId: data.candidateId,
        status: 'INTERVIEWING'
      }
    });

    return this.prisma.interview.create({
      data: {
        companyId: company.id,
        candidateId: data.candidateId,
        jobId: data.jobId,
        date: new Date(data.startDateTime),
        time: `${new Date(data.startDateTime).toLocaleTimeString()} - ${new Date(data.endDateTime).toLocaleTimeString()}`,
        googleEventId,
        meetLink,
        status: 'scheduled'
      }
    });
  }
}
