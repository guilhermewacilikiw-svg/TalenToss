import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);
  private oauth2Client;

  constructor(private prisma: PrismaService) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
      process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
      process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/google/callback'
    );
  }

  getAuthUrl(companyId: string) {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.events'],
      state: companyId,
      prompt: 'consent'
    });
  }

  async handleCallback(code: string, companyId: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    await this.prisma.company.update({
      where: { id: companyId },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
      }
    });
  }

  async getCalendarStatus(companyId: string) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    return {
      connected: !!company?.googleAccessToken
    };
  }

  async disconnect(companyId: string) {
    await this.prisma.company.update({
      where: { id: companyId },
      data: {
        googleAccessToken: null,
        googleRefreshToken: null,
      }
    });
  }

  async createEvent(companyId: string, eventDetails: any) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    
    if (!company?.googleAccessToken) {
      throw new Error('Google Calendar não conectado');
    }

    this.oauth2Client.setCredentials({
      access_token: company.googleAccessToken,
      refresh_token: company.googleRefreshToken,
    });

    // In a production app, you should handle token refresh logic if it fails

    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const res = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary: eventDetails.summary,
        description: eventDetails.description,
        start: { dateTime: eventDetails.start },
        end: { dateTime: eventDetails.end },
        attendees: eventDetails.attendees,
        conferenceData: {
          createRequest: {
            requestId: 'req-' + Date.now(),
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        }
      }
    });

    return res.data;
  }
}
