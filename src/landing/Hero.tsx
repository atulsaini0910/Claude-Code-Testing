import { ArrowRight, Sparkles, Play, CheckCircle2 } from 'lucide-react';

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-slate-950 pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute top-20 right-0 h-[28rem] w-[28rem] rounded-full bg-violet-600/20 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-indigo-200 backdrop-blur transition-colors hover:bg-white/10"
          >
            <Sparkles className="h-4 w-4" />
            Introducing ProXute AI Agents
            <ArrowRight className="h-3.5 w-3.5" />
          </a>

          <h1 className="mt-8 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl">
            Automate the work
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              your team shouldn&apos;t be doing
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            ProXute connects your tools, builds intelligent workflows, and lets AI agents execute
            the busywork — so your team can focus on what actually moves the needle.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#cta"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:shadow-xl hover:shadow-indigo-600/40 sm:w-auto"
            >
              Start building free
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10 sm:w-auto"
            >
              <Play className="h-4 w-4 fill-current" />
              Watch demo
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            {['No credit card required', '14-day free trial', 'Cancel anytime'].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Product preview mockup */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900">
              {/* Window chrome */}
              <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/60 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                <span className="ml-3 rounded-md bg-white/5 px-3 py-1 text-xs text-slate-400">
                  app.proxute.io / workflows
                </span>
              </div>
              <MockDashboard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockDashboard() {
  const steps = [
    { label: 'Trigger: New form submission', tone: 'indigo' },
    { label: 'AI Agent: Enrich & classify lead', tone: 'violet' },
    { label: 'Action: Create CRM record', tone: 'fuchsia' },
    { label: 'Notify: Slack #sales', tone: 'emerald' },
  ];
  const toneMap: Record<string, string> = {
    indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-400/30 text-indigo-200',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-400/30 text-violet-200',
    fuchsia: 'from-fuchsia-500/20 to-fuchsia-500/5 border-fuchsia-400/30 text-fuchsia-200',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-400/30 text-emerald-200',
  };
  return (
    <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-7">
      <div className="sm:col-span-2">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Workflow · Lead Routing
        </p>
        <div className="space-y-2.5">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="w-5 text-right text-xs font-mono text-slate-600">{i + 1}</span>
              <div
                className={`flex-1 rounded-lg border bg-gradient-to-r px-4 py-3 text-sm font-medium ${toneMap[s.tone]}`}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">This week</p>
        {[
          { k: 'Runs', v: '12,480' },
          { k: 'Hours saved', v: '326' },
          { k: 'Success rate', v: '99.4%' },
        ].map((m) => (
          <div key={m.k} className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-2xl font-bold text-white">{m.v}</p>
            <p className="text-xs text-slate-400">{m.k}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
