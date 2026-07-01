import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { CompaniesModule } from './companies/companies.module';
import { CandidatesModule } from './candidates/candidates.module';
import { AiModule } from './ai/ai.module';
import { GoogleModule } from './google/google.module';
import { InterviewsModule } from './interviews/interviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    JobsModule,
    CompaniesModule,
    CandidatesModule,
    AiModule,
    GoogleModule,
    InterviewsModule,
  ],
})
export class AppModule {}
