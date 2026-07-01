import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: any) {
    return this.interviewsService.findAllByCompany(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async schedule(@Request() req: any, @Body() data: any) {
    return this.interviewsService.scheduleInterview(req.user.userId, data);
  }
}
