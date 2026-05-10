import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PERMISSION_ATOMS } from '../src/permissions/permission-atoms';

const prisma = new PrismaClient();

async function main() {
  const permissions = await Promise.all(
    PERMISSION_ATOMS.map((permission) =>
      prisma.permission.upsert({
        where: { atom: permission.atom },
        update: permission,
        create: permission
      })
    )
  );

  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: { description: 'Full platform owner' },
    create: { name: 'Admin', description: 'Full platform owner' }
  });
  const managerRole = await prisma.role.upsert({
    where: { name: 'Manager' },
    update: { description: 'Team lead' },
    create: { name: 'Manager', description: 'Team lead' }
  });
  const agentRole = await prisma.role.upsert({
    where: { name: 'Agent' },
    update: { description: 'Staff operator' },
    create: { name: 'Agent', description: 'Staff operator' }
  });
  const customerRole = await prisma.role.upsert({
    where: { name: 'Customer' },
    update: { description: 'End customer' },
    create: { name: 'Customer', description: 'End customer' }
  });

  await prisma.rolePermission.createMany({
    data: permissions.map((permission) => ({ roleId: adminRole.id, permissionId: permission.id })),
    skipDuplicates: true
  });
  await prisma.rolePermission.createMany({
    data: permissions
      .filter((permission) => !['settings.view'].includes(permission.atom))
      .map((permission) => ({ roleId: managerRole.id, permissionId: permission.id })),
    skipDuplicates: true
  });
  await prisma.rolePermission.createMany({
    data: permissions
      .filter((permission) => ['dashboard.view', 'leads.view', 'tasks.view'].includes(permission.atom))
      .map((permission) => ({ roleId: agentRole.id, permissionId: permission.id })),
    skipDuplicates: true
  });
  await prisma.rolePermission.createMany({
    data: permissions
      .filter((permission) => permission.atom === 'customer_portal.view')
      .map((permission) => ({ roleId: customerRole.id, permissionId: permission.id })),
    skipDuplicates: true
  });

  const passwordHash = await bcrypt.hash('Password123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@digitalpylot.test' },
    update: {},
    create: { email: 'admin@digitalpylot.test', name: 'Admin User', passwordHash, roleId: adminRole.id }
  });
  const manager = await prisma.user.upsert({
    where: { email: 'manager@digitalpylot.test' },
    update: {},
    create: { email: 'manager@digitalpylot.test', name: 'Manager User', passwordHash, roleId: managerRole.id, managerId: admin.id }
  });
  await prisma.user.upsert({
    where: { email: 'agent@digitalpylot.test' },
    update: {},
    create: { email: 'agent@digitalpylot.test', name: 'Agent User', passwordHash, roleId: agentRole.id, managerId: manager.id }
  });
  await prisma.user.upsert({
    where: { email: 'customer@digitalpylot.test' },
    update: {},
    create: { email: 'customer@digitalpylot.test', name: 'Customer User', passwordHash, roleId: customerRole.id, managerId: manager.id }
  });
}

main().finally(async () => prisma.$disconnect());
