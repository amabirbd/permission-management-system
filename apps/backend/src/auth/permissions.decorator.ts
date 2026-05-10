import { SetMetadata } from '@nestjs/common';
import { PermissionAtom } from '../permissions/permission-atoms';

export const REQUIRED_PERMISSION_KEY = 'requiredPermission';
export const RequirePermission = (permission: PermissionAtom) => SetMetadata(REQUIRED_PERMISSION_KEY, permission);
