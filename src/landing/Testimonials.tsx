import { Star } from 'lucide-react';

const testimonials = [
  {
    quote:
      'ProXute replaced three internal tools and a pile of cron jobs. Our ops team ships automations in a day that used to take engineering a sprint.',
    name: 'Maya Chen',
    role: 'VP Operations, Northwind',
    initials: 'MC',
  },
  {
    quote:
      'The AI agents are the real deal. They triage every inbound lead, enrich it, and route it before a human even sees it. Conversion is up 31%.',
    name: 'Daniel Okafor',
    role: 'Head of Growth, Lumen',
    initials: 'DO',
  },
  {
    quote:
      'We run millions of workflow steps a month and have never thought about scaling. It just works, and the observability is best-in-class.',
    name: 'Priya Nair',
    role: 'Staff Engineer, Vertex',
    initials: 'PN',
  },
];

export function Testimonials() {
  return (
    <section className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Loved by teams
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Don&apos;t just take our word for it
          </h2>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4.5 w-4.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-semibold text-white">
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
