import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
            permissions: { include: { permission: true } }
          }
        },
        manager: { select: { id: true, name: true, email: true } },
        userPermissions: { include: { permission: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return users.map((user) => {
      const rolePermissions = user.role.permissions.map((item) => item.permission.atom);
      const directPermissions = user.userPermissions.filter((item) => item.granted).map((item) => item.permission.atom);
      const effectivePermissions = [...new Set([...rolePermissions, ...directPermissions])].sort();
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
        createdAt: user.createdAt,
        role: { id: user.role.id, name: user.role.name },
        manager: user.manager,
        userPermissions: user.userPermissions,
        rolePermissions,
        directPermissions,
        effectivePermissions
      };
    });
  }

  async updatePermissions(actorId: string, userId: string, atoms: string[]) {
    const actorPermissions = new Set(await this.resolvePermissions(actorId));
    const requestedOutsideCeiling = atoms.filter((atom) => !actorPermissions.has(atom));
    if (requestedOutsideCeiling.length) throw new BadRequestException('Cannot grant permissions you do not hold');
    const normalizedAtoms = [...new Set(atoms)];
    const permissions = await this.prisma.permission.findMany({ where: { atom: { in: normalizedAtoms } } });
    if (permissions.length !== normalizedAtoms.length) throw new BadRequestException('One or more permissions are invalid');
    await this.prisma.$transaction([
      this.prisma.userPermission.deleteMany({ where: { userId } }),
      ...(permissions.length
        ? [
            this.prisma.userPermission.createMany({
              data: permissions.map((permission) => ({ userId, permissionId: permission.id, granted: true }))
            })
          ]
        : [])
    ]);
    await this.prisma.auditLog.create({ data: { actorId, targetId: userId, action: 'PERMISSIONS_UPDATED', metadata: { atoms: normalizedAtoms } } });
    return { ok: true };
  }

  private async resolvePermissions(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
        userPermissions: { include: { permission: true } }
      },
      where: { id: userId }
    });
    const atoms = new Set(user.role.permissions.map((item) => item.permission.atom));
    for (const item of user.userPermissions) item.granted ? atoms.add(item.permission.atom) : atoms.delete(item.permission.atom);
    return [...atoms];
  }
}
