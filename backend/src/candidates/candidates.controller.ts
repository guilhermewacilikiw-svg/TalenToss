import { Controller, Post, Get, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException, Param, Res, Body, Put } from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { CandidatesService } from './candidates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.candidatesService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req: any, @Body() body: any) {
    return this.candidatesService.updateProfile(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COMPANY', 'ADMIN')
  @Get()
  async findAll(@Request() req: any) {
    return this.candidatesService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-resume')
  @UseInterceptors(FileInterceptor('resume'))
  async uploadResume(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are supported for now');
    }

    return this.candidatesService.uploadResume(req.user.userId, file.buffer);
  }

  @UseGuards(JwtAuthGuard)
  @Post('apply/:jobId')
  async applyToJob(@Request() req: any, @Param('jobId') jobId: string) {
    return this.candidatesService.applyToJob(req.user.userId, jobId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('applications')
  async getMyApplications(@Request() req: any) {
    return this.candidatesService.getMyApplications(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COMPANY', 'ADMIN')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.candidatesService.findOne(id);
  }

  // Rota pública para acessar PDFs
  @Get('resume/:filename')
  getResume(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'uploads', 'resumes', filename);
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('Resume not found');
    }
    res.download(filePath, filename);
  }
}
