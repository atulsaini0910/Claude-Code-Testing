import { useState } from 'react';
import { CheckSquare, Plus, Circle, CheckCircle2, Calendar, Flag, Trash2, AlertTriangle } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { TextInput } from '../components/ui/TextInput';
import { Select } from '../components/ui/Select';
import { EmptyState } from '../components/ui/EmptyState';
import { useSidebar } from '../components/layout/AppShell';
import { useTasks } from '../hooks/useTasks';
import { useClients } from '../hooks/useClients';
import { formatDate, cn } from '../lib/utils';
import type { Task, TaskPriority, TaskStatus } from '../types';
import toast from 'react-hot-toast';

const priorityBadge: Record<TaskPriority, string> = {
  urgent: 'bg-red-100 text-red-600',
  high:   'bg-amber-100 text-amber-700',
  medium: 'bg-blue-100 text-blue-700',
  low:    'bg-slate-100 text-slate-500',
};

function TaskItem({ task, clientName, onComplete, onDelete }: {
  task: Task;
  clientName?: string;
  onComplete: () => void;
  onDelete: () => void;
}) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'open';

  return (
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-xl border group transition-all',
      task.status === 'completed'
        ? 'border-slate-100 bg-slate-50/50'
        : isOverdue
          ? 'border-red-100 bg-red-50/30'
          : 'border-slate-100 bg-white hover:border-slate-200'
    )}>
      <button
        onClick={onComplete}
        className={cn('mt-0.5 shrink-0 transition-colors cursor-pointer',
          task.status === 'completed' ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-400'
        )}
      >
        {task.status === 'completed'
          ? <CheckCircle2 size={17} />
          : <Circle size={17} />
        }
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium leading-snug',
          task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'
        )}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-semibold capitalize', priorityBadge[task.priority])}>
            {task.priority}
          </span>
          {clientName && (
            <span className="text-xs text-slate-400">{clientName}</span>
          )}
          {task.dueDate && (
            <span className={cn('flex items-center gap-1 text-xs', isOverdue ? 'text-red-500 font-medium' : 'text-slate-400')}>
              <Calendar size={10} />
              {formatDate(task.dueDate)}
              {isOverdue && ' · overdue'}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={onDelete}
        className="shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function TaskSection({ title, tasks, icon, clientNames, onComplete, onDelete, accent }: {
  title: string;
  tasks: Task[];
  icon: React.ReactNode;
  clientNames: Map<string, string>;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  accent?: string;
}) {
  if (tasks.length === 0) return null;
  return (
    <div>
      <div className={cn('flex items-center gap-2 mb-2', accent ?? 'text-slate-600')}>
        {icon}
        <h3 className="text-xs font-semibold uppercase tracking-wide">{title}</h3>
        <span className="text-xs font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full">{tasks.length}</span>
      </div>
      <div className="space-y-2">
        {tasks.map(t => (
          <TaskItem
            key={t.id}
            task={t}
            clientName={clientNames.get(t.clientId ?? '')}
            onComplete={() => onComplete(t.id)}
            onDelete={() => onDelete(t.id)}
          />
        ))}
      </div>
    </div>
  );
}

function TaskForm({ clients, onSubmit, onCancel }: {
  clients: { id: string; name: string }[];
  onSubmit: (d: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium' as TaskPriority,
    status: 'open' as TaskStatus, dueDate: '', clientId: '',
  });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit({
      title: form.title, description: form.description || undefined,
      priority: form.priority, status: form.status,
      dueDate: form.dueDate || undefined,
      clientId: form.clientId || undefined,
      completedAt: undefined, dealId: undefined, assignedTo: undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput label="Task Title" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Follow up with client" />
      <TextInput as="textarea" label="Description" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Optional details..." />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Priority" value={form.priority} onChange={e => set('priority', e.target.value)}
          options={[{ value: 'urgent', label: 'Urgent' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]} />
        <TextInput label="Due Date" type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
      </div>
      <Select label="Linked Client (optional)" value={form.clientId} onChange={e => set('clientId', e.target.value)}
        options={[{ value: '', label: 'None' }, ...clients.map(c => ({ value: c.id, label: c.name }))]} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Add Task</Button>
      </div>
    </form>
  );
}

export function TasksPage() {
  const { openSidebar, openCommandPalette } = useSidebar();
  const { groupedTasks, completeTask, deleteTask, addTask } = useTasks();
  const { clients } = useClients();
  const [showDrawer, setShowDrawer] = useState(false);

  const clientNames = new Map(clients.map(c => [c.id, c.name]));

  const handleAdd = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTask(data);
    setShowDrawer(false);
    toast.success('Task added');
  };

  const handleComplete = (id: string) => {
    completeTask(id);
    toast.success('Task completed!');
  };

  const totalOpen = groupedTasks.overdue.length + groupedTasks.today.length + groupedTasks.upcoming.length + groupedTasks.later.length;

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Tasks"
        onMenuClick={openSidebar}
        onSearchClick={openCommandPalette}
        actions={
          <Button size="sm" onClick={() => setShowDrawer(true)}>
            <Plus size={14} /> Add Task
          </Button>
        }
      />

      <div className="flex-1 p-4 md:p-6">
        {totalOpen === 0 && groupedTasks.completed.length === 0 ? (
          <EmptyState
            icon={<CheckSquare size={40} />}
            title="No tasks yet"
            description="Create tasks and reminders to stay on top of your client follow-ups."
            action={<Button onClick={() => setShowDrawer(true)}><Plus size={14} /> Add First Task</Button>}
          />
        ) : (
          <div className="max-w-2xl space-y-6">
            <TaskSection
              title={`Overdue (${groupedTasks.overdue.length})`}
              tasks={groupedTasks.overdue}
              icon={<AlertTriangle size={13} />}
              clientNames={clientNames}
              onComplete={handleComplete}
              onDelete={deleteTask}
              accent="text-red-500"
            />
            <TaskSection
              title="Today"
              tasks={groupedTasks.today}
              icon={<Flag size={13} />}
              clientNames={clientNames}
              onComplete={handleComplete}
              onDelete={deleteTask}
              accent="text-indigo-600"
            />
            <TaskSection
              title="Upcoming (next 7 days)"
              tasks={groupedTasks.upcoming}
              icon={<Calendar size={13} />}
              clientNames={clientNames}
              onComplete={handleComplete}
              onDelete={deleteTask}
            />
            <TaskSection
              title="Later"
              tasks={groupedTasks.later}
              icon={<Calendar size={13} />}
              clientNames={clientNames}
              onComplete={handleComplete}
              onDelete={deleteTask}
            />
            <TaskSection
              title="Recently Completed"
              tasks={groupedTasks.completed}
              icon={<CheckCircle2 size={13} />}
              clientNames={clientNames}
              onComplete={handleComplete}
              onDelete={deleteTask}
              accent="text-emerald-600"
            />
          </div>
        )}
      </div>

      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title="New Task">
        <TaskForm
          clients={clients.map(c => ({ id: c.id, name: c.name }))}
          onSubmit={handleAdd}
          onCancel={() => setShowDrawer(false)}
        />
      </Drawer>
    </div>
  );
}
