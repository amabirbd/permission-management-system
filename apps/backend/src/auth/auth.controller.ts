import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.login(dto.email, dto.password);
    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this.config.get<string>('COOKIE_SECURE') === 'true',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });
    response.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: this.config.get<string>('COOKIE_SECURE') === 'true',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return { accessToken: result.accessToken, user: result.user };
  }

  @Get('me')
  async me(@Req() request: Request) {
    const header = request.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : request.cookies?.access_token;
    if (!token) throw new UnauthorizedException();
    const payload = await this.jwt.verifyAsync<{ sub: string }>(token, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET')
    });
    return this.auth.me(payload.sub);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return { ok: true };
  }
}
