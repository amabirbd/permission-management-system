export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">403</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Access denied</h1>
        <p className="mt-4 text-slate-500">You do not have the required permission atom for this page.</p>
      </div>
    </main>
  );
}
