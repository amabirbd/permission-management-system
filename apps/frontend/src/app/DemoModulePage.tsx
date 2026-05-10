type DemoModulePageProps = {
  title: string;
  permission: string;
  description: string;
  items: string[];
};

export function DemoModulePage({ title, permission, description, items }: DemoModulePageProps) {
  return (
    <main className="min-h-screen bg-[#f8f6f4] p-6 text-[#272832]">
      <section className="mx-auto max-w-5xl rounded-[28px] border border-[#eee7e2] bg-white p-8 shadow-[0_28px_90px_rgba(39,40,50,0.08)]">
        <a className="text-sm font-bold text-[#ff6845]" href="/dashboard">← Back to dashboard</a>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.28em] text-[#ff6845]">Demo module</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-[-0.05em]">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8c8f9b]">{description}</p>
        <div className="mt-6 rounded-2xl bg-[#fff7f4] px-4 py-3 text-sm font-bold text-[#a84e32]">Required permission atom: {permission}</div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <article className="rounded-3xl border border-[#f0ece9] bg-[#faf8f7] p-5" key={item}>
              <p className="text-sm font-bold text-[#30313b]">{item}</p>
              <p className="mt-3 text-xs leading-5 text-[#8c8f9b]">Placeholder content for the PDF-required route. Real data can be connected after the RBAC foundation is finalized.</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
