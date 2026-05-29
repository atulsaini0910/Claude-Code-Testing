import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'Do I need to know how to code?',
    a: 'No. ProXute is built for everyone. Use the visual builder or describe what you want in plain English and let our AI draft the workflow. Developers can drop into code blocks whenever they want more control.',
  },
  {
    q: 'How do AI agents actually work?',
    a: 'Agents are given a goal and a set of tools (your connected apps). They reason over context, decide which steps to take, and execute them — chaining actions together to complete tasks autonomously, with full guardrails and approval steps when you need them.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. ProXute is SOC 2 Type II certified and GDPR compliant. All data is encrypted in transit and at rest, and Enterprise plans include SSO/SAML, granular permissions, and full audit logging.',
  },
  {
    q: 'What happens when I hit my run limit?',
    a: 'Your workflows keep running — we never silently drop your automations. You can set usage alerts, and overage is billed transparently or you can upgrade your plan at any time.',
  },
  {
    q: 'Can I try it before paying?',
    a: 'Absolutely. The Starter plan is free forever, and Pro comes with a 14-day free trial — no credit card required to get started.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-slate-900">{f.q}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-[15px] leading-relaxed text-slate-600">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
