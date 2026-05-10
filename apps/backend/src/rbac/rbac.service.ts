import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  permissions() {
    return this.prisma.permission.findMany({ orderBy: [{ module: 'asc' }, { atom: 'asc' }] });
  }

  roles() {
    return this.prisma.role.findMany({
      include: { permissions: { include: { permission: true } } },
      orderBy: { name: 'asc' }
    });
  }

  auditLogs() {
    return this.prisma.auditLog.findMany({
      include: { actor: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }
}
