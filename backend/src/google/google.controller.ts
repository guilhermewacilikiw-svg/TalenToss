import { Controller, Get, Query, Res, UseGuards, Request, Post } from '@nestjs/common';
import { GoogleService } from './google.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly prisma: PrismaService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('google/auth')
  async getAuthUrl(@Request() req: any) {
    const company = await this.prisma.company.findUnique({ where: { userId: req.user.userId } });
    if (!company) throw new Error('Empresa não encontrada');
    return { url: this.googleService.getAuthUrl(company.id) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/google/auth')
  async getAuthUrlApi(@Request() req: any) {
    return this.getAuthUrl(req);
  }

  @Get('google/callback')
  async handleCallback(@Query('code') code: string, @Query('state') companyId: string, @Res() res: Response) {
    try {
      if (code && companyId) await this.googleService.handleCallback(code, companyId);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/dashboard/interviews?connected=true`);
    } catch (err) {
      console.error('Google Callback Error:', err);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/dashboard/interviews?error=google_auth_failed`);
    }
  }

  @Get('api/google/callback')
  async handleCallbackApi(@Query('code') code: string, @Query('state') companyId: string, @Res() res: Response) {
    return this.handleCallback(code, companyId, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('google/status')
  async getStatus(@Request() req: any) {
    const company = await this.prisma.company.findUnique({ where: { userId: req.user.userId } });
    if (!company) return { connected: false };
    return this.googleService.getCalendarStatus(company.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/google/status')
  async getStatusApi(@Request() req: any) {
    return this.getStatus(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('google/disconnect')
  async disconnect(@Request() req: any) {
    const company = await this.prisma.company.findUnique({ where: { userId: req.user.userId } });
    if (company) await this.googleService.disconnect(company.id);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/google/disconnect')
  async disconnectApi(@Request() req: any) {
    return this.disconnect(req);
  }
}
