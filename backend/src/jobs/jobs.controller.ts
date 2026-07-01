import { Controller, Post, Body, Get, Put, Patch, UseGuards, Request, Param, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompaniesService } from '../companies/companies.service';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly companiesService: CompaniesService,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.jobsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: any, @Body() data: any) {
    const company = await this.companiesService.findByUser(req.user.userId);
    if (!company) throw new Error('Company profile not found');
    return this.jobsService.create(company.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-jobs')
  async findMyJobs(@Request() req: any) {
    const company = await this.companiesService.findByUser(req.user.userId);
    if (!company) throw new Error('Company profile not found');
    return this.jobsService.findByCompany(company.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Request() req: any, @Body() data: any) {
    const company = await this.companiesService.findByUser(req.user.userId);
    if (!company) throw new Error('Company profile not found');
    return this.jobsService.update(id, company.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/matching')
  async getMatchingCandidates(@Param('id') id: string, @Request() req: any) {
    const company = await this.companiesService.findByUser(req.user.userId);
    if (!company) throw new Error('Company profile not found');
    return this.jobsService.getMatchingCandidates(id, company.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/applications')
  async getApplications(@Param('id') id: string, @Request() req: any) {
    const company = await this.companiesService.findByUser(req.user.userId);
    if (!company) throw new Error('Company profile not found');
    return this.jobsService.getApplications(id, company.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('applications/:id/status')
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body('status') status: 'SCREENING' | 'REJECTED',
    @Request() req: any
  ) {
    const company = await this.companiesService.findByUser(req.user.userId);
    if (!company) throw new Error('Company profile not found');
    return this.jobsService.updateApplicationStatus(id, company.id, status);
  }
}
