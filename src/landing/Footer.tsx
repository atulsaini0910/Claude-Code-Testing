import { Workflow } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: ['Features', 'Integrations', 'Pricing', 'Changelog', 'Roadmap'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Blog', 'Customers', 'Contact'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API reference', 'Community', 'Status', 'Security'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'DPA', 'Cookies'],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                <Workflow className="h-5 w-5" strokeWidth={2.4} />
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900">ProXute</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              The AI automation platform for teams that move fast. Connect, build, and let agents
              execute.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-900">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-slate-500 transition-colors hover:text-slate-900">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} ProXute, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-sm text-slate-500">
            <a href="#" className="transition-colors hover:text-slate-900">Privacy</a>
            <a href="#" className="transition-colors hover:text-slate-900">Terms</a>
            <a href="#" className="transition-colors hover:text-slate-900">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
