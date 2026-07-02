import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: any) {
    const role = (data.role === 'COMPANY' || data.role === 'CANDIDATE') ? data.role : 'CANDIDATE';

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: role,
        ...(role === 'CANDIDATE' && {
          candidateProfile: {
            create: {
              firstName: data.firstName || '',
              lastName: data.lastName || '',
            },
          },
        }),
        ...(role === 'COMPANY' && {
          companyProfile: {
            create: {
              name: data.corporateName || data.name || 'Nova Empresa',
              tradeName: data.tradeName || '',
              cnpj: data.cnpj || '',
            },
          },
        }),
      },
    });
  }
}
