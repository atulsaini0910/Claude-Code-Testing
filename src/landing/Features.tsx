import {
  Bot,
  Workflow,
  Database,
  ShieldCheck,
  Gauge,
  LineChart,
  type LucideIcon,
} from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

const features: Feature[] = [
  {
    icon: Bot,
    title: 'AI agents that act',
    body: 'Deploy autonomous agents that read context, make decisions, and complete multi-step tasks across your stack — not just chat about them.',
  },
  {
    icon: Workflow,
    title: 'Visual workflow builder',
    body: 'Drag, drop, and connect triggers, conditions, and actions. Build production-grade automations in minutes without writing code.',
  },
  {
    icon: Database,
    title: '300+ integrations',
    body: 'Connect Slack, Salesforce, Notion, HubSpot, Postgres, and hundreds more. Or call any API with our flexible HTTP block.',
  },
  {
    icon: Gauge,
    title: 'Run at any scale',
    body: 'From a handful of runs to millions per day. Parallel execution, automatic retries, and sub-second latency built in.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise-grade security',
    body: 'SOC 2 Type II, GDPR, and SSO/SAML. Granular permissions, audit logs, and data encryption at rest and in transit.',
  },
  {
    icon: LineChart,
    title: 'Observability built in',
    body: 'Trace every run step-by-step, monitor success rates, and get alerted the moment something needs your attention.',
  },
];

export function Features() {
  return (
    <section id="features" className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Everything you need
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            One platform to automate it all
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Stop stitching together brittle scripts and disconnected tools. ProXute gives you
            everything to design, run, and scale intelligent automations.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-600/5"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20">
                <f.icon className="h-6 w-6" strokeWidth={2} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
