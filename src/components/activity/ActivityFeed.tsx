import { useState } from 'react';
import { Plus, Activity } from 'lucide-react';
import { ActivityItem } from './ActivityItem';
import { ActivityForm } from './ActivityForm';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import type { ActivityEntry, ActivityType } from '../../types';

interface ActivityFeedProps {
  clientId: string;
  entries: ActivityEntry[];
  onAdd: (data: { clientId: string; type: ActivityType; title: string; body: string }) => void;
  onDelete: (id: string) => void;
}

export function ActivityFeed({ clientId, entries, onAdd, onDelete }: ActivityFeedProps) {
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (data: { clientId: string; type: ActivityType; title: string; body: string }) => {
    onAdd(data);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Activity Log</h3>
        {!showForm && (
          <Button size="sm" variant="secondary" onClick={() => setShowForm(true)}>
            <Plus size={14} />
            Log Activity
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-5">
          <ActivityForm
            clientId={clientId}
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {entries.length === 0 ? (
        <EmptyState
          icon={<Activity size={36} />}
          title="No activity yet"
          description="Log calls, meetings, emails, or notes to track your interactions with this client."
          action={
            !showForm ? (
              <Button size="sm" onClick={() => setShowForm(true)}>
                <Plus size={14} /> Log First Activity
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div>
          {entries.map((entry) => (
            <ActivityItem key={entry.id} entry={entry} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
