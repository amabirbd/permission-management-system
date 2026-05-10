import { Body, Controller, Get, Headers, Patch, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RequirePermission } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  @Get()
  @RequirePermission('users.view')
  list() {
    return this.users.list();
  }

  @Patch('permissions')
  @RequirePermission('permissions.manage')
  async updatePermissions(@Headers('authorization') authorization: string | undefined, @Body() body: { userId: string; atoms: string[] }) {
    if (!authorization?.startsWith('Bearer ')) throw new UnauthorizedException();
    const payload = await this.jwt.verifyAsync<{ sub: string }>(authorization.slice(7), {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET')
    });
    return this.users.updatePermissions(payload.sub, body.userId, body.atoms);
  }
}
