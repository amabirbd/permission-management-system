export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  permissions: string[];
};

export type Permission = {
  id: string;
  atom: string;
  label: string;
  module: string;
};

export type RbacUser = {
  id: string;
  email: string;
  name: string;
  status: string;
  createdAt: string;
  role: {
    id: string;
    name: string;
  };
  manager: {
    id: string;
    name: string;
    email: string;
  } | null;
  userPermissions: {
    granted: boolean;
    permission: Permission;
  }[];
  rolePermissions: string[];
  directPermissions: string[];
  effectivePermissions: string[];
};

export type AuditLog = {
  id: string;
  action: string;
  targetId: string | null;
  metadata: unknown;
  createdAt: string;
  actor: {
    id: string;
    name: string;
    email: string;
  } | null;
};
