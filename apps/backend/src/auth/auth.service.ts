import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ include: { role: true }, where: { email } });
    if (!user || user.status !== 'ACTIVE') throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const permissions = await this.resolvePermissions(user.id);
    const accessToken = await this.signAccessToken(user.id, user.email, permissions);
    const refreshToken = randomUUID();
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.refreshSession.create({ data: { userId: user.id, tokenHash, expiresAt } });
    await this.prisma.auditLog.create({ data: { actorId: user.id, action: 'LOGIN' } });
    return { accessToken, refreshToken, user: this.safeUser(user, permissions) };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ include: { role: true }, where: { id: userId } });
    const permissions = await this.resolvePermissions(user.id);
    return this.safeUser(user, permissions);
  }

  async resolvePermissions(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
        userPermissions: { include: { permission: true } }
      },
      where: { id: userId }
    });
    const atoms = new Set(user.role.permissions.map((item) => item.permission.atom));
    for (const item of user.userPermissions) {
      if (item.granted) atoms.add(item.permission.atom);
      else atoms.delete(item.permission.atom);
    }
    return [...atoms].sort();
  }

  async hasPermission(userId: string, atom: string) {
    const permissions = await this.resolvePermissions(userId);
    return permissions.includes(atom);
  }

  private signAccessToken(userId: string, email: string, permissions: string[]) {
    return this.jwt.signAsync(
      { sub: userId, email, permissions },
      {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('ACCESS_TOKEN_TTL') ?? '15m'
      }
    );
  }

  private safeUser(user: { id: string; email: string; name: string; status: string; role: { name: string } }, permissions: string[]) {
    return { id: user.id, email: user.email, name: user.name, role: user.role.name, status: user.status, permissions };
  }
}
