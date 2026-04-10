import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { TextInput } from '../ui/TextInput';
import { ACTIVITY_TEMPLATES } from '../../lib/activityTemplates';
import type { ActivityType } from '../../types';

interface ActivityFormProps {
  clientId: string;
  onSubmit: (data: { clientId: string; type: ActivityType; title: string; body: string }) => void;
  onCancel: () => void;
}

const selectClass =
  'w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

export function ActivityForm({ clientId, onSubmit, onCancel }: ActivityFormProps) {
  const [type, setType] = useState<ActivityType>('call');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const filteredTemplates = ACTIVITY_TEMPLATES.filter(t => t.type === type);

  const applyTemplate = (templateId: string) => {
    const t = ACTIVITY_TEMPLATES.find(t => t.id === templateId);
    if (t) {
      setTitle(t.title);
      setBody(t.body);
    }
    setShowTemplates(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    onSubmit({ clientId, type, title, body });
    setTitle('');
    setBody('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3 border border-slate-100 dark:border-slate-700">
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Type</label>
          <select
            className={selectClass}
            value={type}
            onChange={(e) => { setType(e.target.value as ActivityType); setShowTemplates(false); }}
          >
            <option value="call">Call</option>
            <option value="meeting">Meeting</option>
            <option value="email">Email</option>
            <option value="note">Note</option>
            <option value="sms">SMS</option>
          </select>
        </div>

        {/* Templates button */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide invisible">.</label>
          <button
            type="button"
            onClick={() => setShowTemplates(v => !v)}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer font-medium"
          >
            <Sparkles size={12} /> Templates
          </button>
        </div>
      </div>

      {/* Template picker */}
      {showTemplates && (
        <div className="bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm overflow-hidden">
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-3 py-2 border-b border-slate-100 dark:border-slate-600">
            {filteredTemplates.length > 0 ? 'Click to apply' : `No ${type} templates`}
          </p>
          {filteredTemplates.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTemplate(t.id)}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-600 last:border-0"
            >
              {t.label}
            </button>
          ))}
          {ACTIVITY_TEMPLATES.filter(t => t.type !== type).length > 0 && filteredTemplates.length === 0 && (
            <button
              type="button"
              onClick={() => {}}
              className="w-full text-left px-3 py-2 text-xs text-slate-400"
            >
              Switch type to see more templates
            </button>
          )}
        </div>
      )}

      <TextInput
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={error}
        placeholder="e.g. Follow-up call, Site visit"
      />
      <TextInput
        as="textarea"
        label="Details"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What was discussed or noted..."
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm">Log Activity</Button>
      </div>
    </form>
  );
}
