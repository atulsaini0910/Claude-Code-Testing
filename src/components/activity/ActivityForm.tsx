import { useState } from 'react';
import { Button } from '../ui/Button';
import { TextInput } from '../ui/TextInput';
import type { ActivityType } from '../../types';

interface ActivityFormProps {
  clientId: string;
  onSubmit: (data: { clientId: string; type: ActivityType; title: string; body: string }) => void;
  onCancel: () => void;
}

const selectClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

export function ActivityForm({ clientId, onSubmit, onCancel }: ActivityFormProps) {
  const [type, setType] = useState<ActivityType>('call');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

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
    <form onSubmit={handleSubmit} className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Type</label>
        <select
          className={selectClass}
          value={type}
          onChange={(e) => setType(e.target.value as ActivityType)}
        >
          <option value="call">Call</option>
          <option value="meeting">Meeting</option>
          <option value="email">Email</option>
          <option value="note">Note</option>
        </select>
      </div>
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
