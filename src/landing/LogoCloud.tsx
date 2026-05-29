const companies = ['Northwind', 'Acme Corp', 'Lumen', 'Vertex', 'Quanta', 'Hyperdrive'];

export function LogoCloud() {
  return (
    <section className="border-b border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-center text-sm font-medium text-slate-500">
          Trusted by fast-moving teams at 4,000+ companies
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {companies.map((c) => (
            <span
              key={c}
              className="text-xl font-bold tracking-tight text-slate-400 grayscale transition-colors hover:text-slate-600 sm:text-2xl"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
