import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
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
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60, // Limite global: 60 requisições a cada 1 minuto
    }]),
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
