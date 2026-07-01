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
}
