import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [RbacController],
  providers: [RbacService]
})
export class RbacModule {}
