const stats = [
  { value: '12M+', label: 'Workflows run monthly' },
  { value: '300+', label: 'Native integrations' },
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '8 hrs', label: 'Saved per user / week' },
];

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
