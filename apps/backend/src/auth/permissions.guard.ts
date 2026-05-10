import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { REQUIRED_PERMISSION_KEY } from './permissions.decorator';

export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly auth: AuthService
  ) {}

  async canActivate(context: ExecutionContext) {
    const required = this.reflector.getAllAndOverride<string>(REQUIRED_PERMISSION_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!required) return true;
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new UnauthorizedException();
    const payload = await this.jwt.verifyAsync<{ sub: string }>(header.slice(7), {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET')
    });
    const allowed = await this.auth.hasPermission(payload.sub, required);
    if (!allowed) throw new ForbiddenException('Missing required permission');
    request.user = { id: payload.sub };
    return true;
  }
}
