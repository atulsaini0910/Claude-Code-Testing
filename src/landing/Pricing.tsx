import { Check } from 'lucide-react';

interface Plan {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Starter',
    price: '$0',
    cadence: '/mo',
    description: 'For individuals automating their first workflows.',
    features: ['Up to 1,000 runs/mo', '5 active workflows', '50+ integrations', 'Community support'],
    cta: 'Start free',
  },
  {
    name: 'Pro',
    price: '$49',
    cadence: '/mo',
    description: 'For growing teams that run on automation.',
    features: [
      '50,000 runs/mo',
      'Unlimited workflows',
      '300+ integrations',
      'AI agents included',
      'Priority support',
    ],
    cta: 'Start 14-day trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: '',
    description: 'For organizations with scale & compliance needs.',
    features: [
      'Unlimited runs',
      'SSO / SAML & audit logs',
      'Dedicated infrastructure',
      'SOC 2 & custom DPA',
      '24/7 dedicated support',
    ],
    cta: 'Contact sales',
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Start free. Upgrade when you&apos;re ready. No hidden fees.
          </p>
        </div>

        <div className="mt-16 grid items-start gap-8 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                p.highlight
                  ? 'border-indigo-600 bg-slate-950 shadow-2xl shadow-indigo-600/20 lg:-mt-4 lg:mb-4'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h3
                className={`text-lg font-semibold ${p.highlight ? 'text-white' : 'text-slate-900'}`}
              >
                {p.name}
              </h3>
              <p className={`mt-1 text-sm ${p.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                {p.description}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span
                  className={`text-4xl font-bold ${p.highlight ? 'text-white' : 'text-slate-900'}`}
                >
                  {p.price}
                </span>
                <span className={p.highlight ? 'text-slate-400' : 'text-slate-500'}>
                  {p.cadence}
                </span>
              </div>

              <a
                href="#cta"
                className={`mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                  p.highlight
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-xl'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {p.cta}
              </a>

              <ul className="mt-8 space-y-3.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check
                      className={`mt-0.5 h-5 w-5 shrink-0 ${
                        p.highlight ? 'text-indigo-400' : 'text-indigo-600'
                      }`}
                      strokeWidth={2.5}
                    />
                    <span className={p.highlight ? 'text-slate-300' : 'text-slate-700'}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
