import { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { generateFollowUpDraft } from '../../lib/ai';
import type { Client, ActivityEntry, Deal } from '../../types';
import toast from 'react-hot-toast';

type Channel = 'email' | 'call' | 'sms';

const CHANNELS: { key: Channel; label: string; icon: typeof Mail }[] = [
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'call',  label: 'Call Script', icon: Phone },
  { key: 'sms',   label: 'SMS', icon: MessageSquare },
];

interface Props {
  client: Client;
  entries: ActivityEntry[];
  deals: Deal[];
}

export function FollowUpDraftButton({ client, entries, deals }: Props) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY ?? '';
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState<Channel>('email');
  const [draft, setDraft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const recent = [...entries].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const generate = async () => {
    if (!apiKey) {
      toast.error('Set VITE_ANTHROPIC_API_KEY in .env to use AI drafts');
      return;
    }
    setLoading(true);
    setDraft(null);
    try {
      const text = await generateFollowUpDraft(client, recent, deals, channel, apiKey);
      setDraft(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to generate draft');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <Sparkles size={13} className="text-indigo-500" /> Draft Follow-up
      </Button>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">AI Follow-up Draft</span>
        </div>
        <button onClick={() => { setOpen(false); setDraft(null); }} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">✕</button>
      </div>

      {/* Channel selector */}
      <div className="flex gap-1.5 mb-3">
        {CHANNELS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setChannel(key); setDraft(null); }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              channel === key
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <Icon size={11} /> {label}
          </button>
        ))}
      </div>

      {/* Draft output */}
      {draft && (
        <div className="mb-3 relative">
          <pre className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 leading-relaxed font-sans border border-slate-100 dark:border-slate-700 max-h-48 overflow-y-auto">
            {draft}
          </pre>
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="text-slate-500" />}
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={generate} disabled={loading}>
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
          {loading ? 'Drafting…' : draft ? 'Regenerate' : 'Generate Draft'}
        </Button>
        {draft && (
          <Button variant="secondary" size="sm" onClick={copyToClipboard}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        )}
      </div>
    </div>
  );
}
