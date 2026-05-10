'use client';

import { useEffect, useMemo, useState } from 'react';
import { ApiError, api } from '../../lib/api';
import { navigationItems } from '../../lib/routes';
import type { AuditLog, AuthUser, Permission, RbacUser } from '../../lib/types';

type DashboardData = {
  me: AuthUser | null;
  users: RbacUser[];
  permissions: Permission[];
  auditLogs: AuditLog[];
};

export function DashboardClient() {
  const [data, setData] = useState<DashboardData>({ me: null, users: [], permissions: [], auditLogs: [] });
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedAtoms, setSelectedAtoms] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function load(preferredUserId?: string) {
    setIsLoading(true);
    setError('');
    try {
      const me = await api('/auth/me') as AuthUser;
      const [users, permissions, auditLogs] = await Promise.all([
        me.permissions.includes('users.view') ? api('/users') as Promise<RbacUser[]> : Promise.resolve([]),
        me.permissions.includes('permissions.manage') ? api('/rbac/permissions') as Promise<Permission[]> : Promise.resolve([]),
        me.permissions.includes('audit.view') ? api('/rbac/audit-logs') as Promise<AuditLog[]> : Promise.resolve([])
      ]);
      setData({ me, users, permissions, auditLogs });
      const nextSelectedUser = users.find((user) => user.id === preferredUserId) ?? users.find((user) => user.id === selectedUserId) ?? users[0];
      setSelectedUserId(nextSelectedUser?.id ?? '');
      setSelectedAtoms(nextSelectedUser?.directPermissions ?? []);
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) window.location.href = '/';
      else setError(caught instanceof Error ? caught.message : 'Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const visibleNav = useMemo(() => navigationItems.filter((item) => data.me?.permissions.includes(item.permission)), [data.me]);
  const selectedUser = data.users.find((user) => user.id === selectedUserId);
  const groupedPermissions = useMemo(() => {
    return data.permissions.reduce<Record<string, Permission[]>>((groups, permission) => {
      groups[permission.module] = [...(groups[permission.module] ?? []), permission];
      return groups;
    }, {});
  }, [data.permissions]);

  function selectUser(user: RbacUser) {
    setSelectedUserId(user.id);
    setSelectedAtoms(user.directPermissions);
    setMessage('');
    setError('');
  }

  function toggleAtom(atom: string) {
    if (selectedUser?.rolePermissions.includes(atom)) return;
    setSelectedAtoms((current) => current.includes(atom) ? current.filter((item) => item !== atom) : [...current, atom].sort());
  }

  async function savePermissions() {
    if (!selectedUserId) return;
    setIsSaving(true);
    setError('');
    setMessage('');
    try {
      await api('/users/permissions', {
        method: 'PATCH',
        body: JSON.stringify({ userId: selectedUserId, atoms: selectedAtoms })
      });
      setMessage(`Direct permissions updated for ${selectedUser?.name ?? 'selected user'}. Role permissions were not changed.`);
      await load(selectedUserId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to update permissions.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#f8f6f4] text-sm font-bold text-[#ff6845]">Loading RBAC workspace...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f8f6f4] p-4 text-[#272832]">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1440px] overflow-hidden rounded-[28px] border border-[#eee7e2] bg-white shadow-[0_28px_90px_rgba(39,40,50,0.08)]">
        <aside className="hidden w-[260px] flex-col border-r border-[#efe8e4] bg-[#fff6f1] px-5 py-6 lg:flex">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] bg-[#ff6845]"><span className="h-4 w-4 rounded-full bg-white/90" /></span>
            <span className="text-[20px] font-extrabold tracking-[-0.04em] text-[#33221c]">Obliq</span>
          </div>
          <nav className="space-y-1">
            {visibleNav.map((item) => (
              <a className={`block rounded-xl px-4 py-3 text-sm font-semibold ${item.href === '/dashboard' ? 'bg-white text-[#ff6845] shadow-sm' : 'text-[#7b716c]'}`} href={item.href} key={item.href}>{item.label}</a>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl bg-[#ff6845] p-4 text-white">
            <p className="text-sm font-bold">{data.me?.role} access</p>
            <p className="mt-2 text-xs leading-5 text-white/80">Navigation is rendered from your effective permission atoms.</p>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex flex-col gap-4 border-b border-[#f0ece9] px-6 py-5 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#ff6845]">Dynamic RBAC</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">Welcome, {data.me?.name}</h1>
            </div>
            <button className="rounded-xl border border-[#ffd5cb] px-4 py-2 text-sm font-bold text-[#ff6845]" onClick={() => void api('/auth/logout', { method: 'POST' }).finally(() => window.location.href = '/')}>Logout</button>
          </header>

          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_380px] lg:p-8">
            <div className="space-y-6">
              {error ? <div className="rounded-2xl border border-[#ffd5cb] bg-[#fff4f1] p-4 text-sm font-bold text-[#d94324]">{error}</div> : null}
              {message ? <div className="rounded-2xl border border-[#ccefdc] bg-[#f1fff7] p-4 text-sm font-bold text-[#16894f]">{message}</div> : null}

              <div className="grid gap-4 sm:grid-cols-3">
                <Stat label="Users" value={String(data.users.length)} />
                <Stat label="My permissions" value={String(data.me?.permissions.length ?? 0)} />
                <Stat label="Audit events" value={String(data.auditLogs.length)} />
              </div>

              <section className="rounded-[28px] border border-[#f0ece9] bg-white p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold tracking-[-0.03em]">Users</h2>
                    <p className="mt-1 text-sm text-[#8c8f9b]">Visible only with `users.view`.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {data.users.map((user) => (
                    <button className={`w-full rounded-2xl border p-4 text-left transition ${selectedUserId === user.id ? 'border-[#ff6845] bg-[#fff7f4]' : 'border-[#f1efed] bg-[#faf8f7]'}`} key={user.id} onClick={() => selectUser(user)} type="button">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-[#30313b]">{user.name}</p>
                          <p className="mt-1 text-xs text-[#8c8f9b]">{user.email}</p>
                          <p className="mt-2 text-xs font-semibold text-[#a86a55]">{user.effectivePermissions.length} effective · {user.directPermissions.length} direct</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#ff6845]">{user.role.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-[28px] border border-[#f0ece9] bg-white p-6">
                <h2 className="text-xl font-extrabold tracking-[-0.03em]">Permission editor</h2>
                <p className="mt-1 text-sm text-[#8c8f9b]">Edits direct user grants only. Role permissions are inherited and locked here.</p>
                {selectedUser ? (
                  <div className="mt-4 rounded-2xl bg-[#faf8f7] p-3">
                    <p className="text-sm font-bold">Editing {selectedUser.name}</p>
                    <p className="mt-1 text-xs font-semibold text-[#8c8f9b]">Role: {selectedUser.role.name} · {selectedUser.rolePermissions.length} inherited permissions</p>
                  </div>
                ) : null}
                <div className="mt-5 max-h-[430px] space-y-5 overflow-auto pr-1">
                  {Object.entries(groupedPermissions).map(([module, permissions]) => (
                    <div key={module}>
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ff6845]">{module}</p>
                      <div className="space-y-2">
                        {permissions.map((permission) => {
                          const inherited = selectedUser?.rolePermissions.includes(permission.atom) ?? false;
                          const direct = selectedAtoms.includes(permission.atom);
                          return (
                          <label className="flex items-center gap-3 rounded-xl bg-[#faf8f7] px-3 py-2 text-sm font-semibold" key={permission.id}>
                            <input checked={inherited || direct} className="accent-[#ff6845] disabled:opacity-60" disabled={inherited} onChange={() => toggleAtom(permission.atom)} type="checkbox" />
                            <span className="min-w-0 flex-1">{permission.label}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${inherited ? 'bg-white text-[#8c8f9b]' : direct ? 'bg-[#fff1ec] text-[#ff6845]' : 'bg-white text-[#b8bbc4]'}`}>{inherited ? 'Role' : direct ? 'Direct' : 'Off'}</span>
                          </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-5 h-11 w-full rounded-xl bg-[#ff6845] text-sm font-bold text-white disabled:opacity-60" disabled={!selectedUserId || isSaving || !data.me?.permissions.includes('permissions.manage')} onClick={savePermissions} type="button">{isSaving ? 'Saving...' : 'Save permissions'}</button>
              </section>

              <section className="rounded-[28px] border border-[#f0ece9] bg-white p-6">
                <h2 className="text-xl font-extrabold tracking-[-0.03em]">Audit log</h2>
                <div className="mt-4 space-y-3">
                  {data.auditLogs.slice(0, 5).map((log) => (
                    <div className="rounded-2xl bg-[#faf8f7] p-3" key={log.id}>
                      <p className="text-sm font-bold">{log.action}</p>
                      <p className="mt-1 text-xs text-[#8c8f9b]">{log.actor?.email ?? 'System'} · {new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[#f0ece9] bg-white p-5 shadow-[0_16px_36px_rgba(39,40,50,0.04)]">
      <p className="text-sm font-semibold text-[#8c8f9b]">{label}</p>
      <p className="mt-4 text-3xl font-extrabold tracking-[-0.05em] text-[#272832]">{value}</p>
    </div>
  );
}
