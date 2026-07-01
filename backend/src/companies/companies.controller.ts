import { Controller, Post, Body, Get, Put, UseGuards, Request, Param } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(@Request() req: any, @Body() data: any) {
    return this.companiesService.create(req.user.userId, data);
  }

  @Get('my-company')
  async getMyCompany(@Request() req: any) {
    return this.companiesService.findByUser(req.user.userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Request() req: any, @Body() data: any) {
    const company = await this.companiesService.findByUser(req.user.userId);
    if (!company || company.id !== id) {
      throw new Error('Acesso negado para modificar esta empresa.');
    }
    return this.companiesService.update(id, data);
  }
}
