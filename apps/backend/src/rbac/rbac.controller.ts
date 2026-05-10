import { Controller, Get, UseGuards } from '@nestjs/common';
import { RequirePermission } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RbacService } from './rbac.service';

@Controller('rbac')
@UseGuards(PermissionsGuard)
export class RbacController {
  constructor(private readonly rbac: RbacService) {}

  @Get('permissions')
  @RequirePermission('permissions.manage')
  permissions() {
    return this.rbac.permissions();
  }

  @Get('roles')
  @RequirePermission('permissions.manage')
  roles() {
    return this.rbac.roles();
  }

  @Get('audit-logs')
  @RequirePermission('audit.view')
  auditLogs() {
    return this.rbac.auditLogs();
  }
}
