import { Plug, Wand2, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Plug,
    step: '01',
    title: 'Connect your tools',
    body: 'Link the apps and data sources your team already uses in a few clicks. No engineering tickets required.',
  },
  {
    icon: Wand2,
    step: '02',
    title: 'Design your workflow',
    body: 'Describe what you want in plain English or build it visually. ProXute drafts the logic and you refine it.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Launch & let it run',
    body: 'Flip it live and watch agents execute around the clock. Monitor every run and iterate as you grow.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Live in three steps
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            From idea to automated in an afternoon — not a quarter.
          </p>
        </div>

        <div className="relative mt-16 grid gap-8 lg:grid-cols-3">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent lg:block" />
          {steps.map((s) => (
            <div key={s.step} className="relative">
              <div className="flex items-center gap-4">
                <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-indigo-600 shadow-sm">
                  <s.icon className="h-7 w-7" strokeWidth={2} />
                </span>
                <span className="text-5xl font-bold text-slate-100">{s.step}</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
