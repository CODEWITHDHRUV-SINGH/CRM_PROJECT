import type {
  CreateTaskInput,
  Task,
  TaskFilters,
  UpdateTaskInput,
} from '../types/task.types';

const now = new Date().toISOString();

const daysFromNow = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const seedTasks: Task[] = [
  { id: 'T-001', title: 'Follow up with Olivia about enterprise pricing', description: 'Send updated pricing sheet and SSO details.', type: 'email', status: 'todo', priority: 'high', dueDate: daysFromNow(1), relatedTo: 'Layers', assignee: 'Alex Morgan', createdAt: '2026-10-20T10:00:00Z', updatedAt: now },
  { id: 'T-002', title: 'Discovery call with Quotient CTO', type: 'call', status: 'in-progress', priority: 'urgent', dueDate: daysFromNow(0), relatedTo: 'Quotient', assignee: 'Alex Morgan', createdAt: '2026-10-22T11:30:00Z', updatedAt: now },
  { id: 'T-003', title: 'Send proposal to Circooles', description: 'Include 12-month contract with discount tier.', type: 'email', status: 'todo', priority: 'medium', dueDate: daysFromNow(-2), relatedTo: 'Circooles', assignee: 'Alex Morgan', createdAt: '2026-10-18T09:15:00Z', updatedAt: now },
  { id: 'T-004', title: 'Contract review with Catalog legal', type: 'meeting', status: 'done', priority: 'high', dueDate: daysFromNow(-5), relatedTo: 'Catalog', assignee: 'Alex Morgan', completedAt: '2026-10-22T15:00:00Z', createdAt: '2026-10-15T14:00:00Z', updatedAt: now },
  { id: 'T-005', title: 'Qualify Studio Co inbound lead', type: 'follow-up', status: 'todo', priority: 'low', dueDate: daysFromNow(3), relatedTo: 'Studio Co', assignee: 'Alex Morgan', createdAt: '2026-10-25T16:00:00Z', updatedAt: now },
  { id: 'T-006', title: 'Post-mortem call with Global', description: 'Understand why we lost the deal.', type: 'meeting', status: 'cancelled', priority: 'low', dueDate: daysFromNow(-10), relatedTo: 'Global', assignee: 'Alex Morgan', createdAt: '2026-10-10T08:30:00Z', updatedAt: now },
  { id: 'T-007', title: 'Send implementation timeline to Pixelly', type: 'email', status: 'in-progress', priority: 'medium', dueDate: daysFromNow(2), relatedTo: 'Pixelly', assignee: 'Alex Morgan', createdAt: '2026-10-26T12:00:00Z', updatedAt: now },
  { id: 'T-008', title: 'Kickoff meeting with Bright', description: 'Onboarding session with customer success.', type: 'meeting', status: 'todo', priority: 'high', dueDate: daysFromNow(5), relatedTo: 'Bright', assignee: 'Alex Morgan', createdAt: '2026-10-27T10:00:00Z', updatedAt: now },
  { id: 'T-009', title: 'Send case study to Ventures', type: 'email', status: 'done', priority: 'medium', dueDate: daysFromNow(-3), relatedTo: 'Ventures', assignee: 'Alex Morgan', completedAt: '2026-10-25T11:00:00Z', createdAt: '2026-10-20T11:00:00Z', updatedAt: now },
  { id: 'T-010', title: 'Review compliance requirements with Apex', type: 'call', status: 'in-progress', priority: 'urgent', dueDate: daysFromNow(1), relatedTo: 'Apex', assignee: 'Alex Morgan', createdAt: '2026-10-28T15:45:00Z', updatedAt: now },
  { id: 'T-011', title: 'Update CRM records after demos', type: 'other', status: 'todo', priority: 'low', dueDate: daysFromNow(7), assignee: 'Alex Morgan', createdAt: '2026-10-29T10:00:00Z', updatedAt: now },
  { id: 'T-012', title: 'Q4 pipeline review with team', type: 'meeting', status: 'todo', priority: 'high', dueDate: daysFromNow(4), assignee: 'Alex Morgan', createdAt: '2026-10-29T11:00:00Z', updatedAt: now },
];

let tasksDb: Task[] = [...seedTasks];
let nextId = 13;
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const tasksService = {
  async list(filters?: TaskFilters): Promise<Task[]> {
    await delay();
    let results = [...tasksDb];

    if (filters?.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      results = results.filter((t) =>
        `${t.title} ${t.description ?? ''} ${t.relatedTo ?? ''}`.toLowerCase().includes(q),
      );
    }
    if (filters?.status && filters.status !== 'all') {
      results = results.filter((t) => t.status === filters.status);
    }
    if (filters?.priority && filters.priority !== 'all') {
      results = results.filter((t) => t.priority === filters.priority);
    }
    if (filters?.type && filters.type !== 'all') {
      results = results.filter((t) => t.type === filters.type);
    }

    // Sort: incomplete first (by due date ascending), then completed (by completedAt desc)
    return results.sort((a, b) => {
      const aDone = a.status === 'done' || a.status === 'cancelled';
      const bDone = b.status === 'done' || b.status === 'cancelled';
      if (aDone !== bDone) return aDone ? 1 : -1;
      if (!aDone) {
        const aDue = a.dueDate ?? '9999-12-31';
        const bDue = b.dueDate ?? '9999-12-31';
        return aDue.localeCompare(bDue);
      }
      return (b.completedAt ?? b.updatedAt).localeCompare(a.completedAt ?? a.updatedAt);
    });
  },

  async create(input: CreateTaskInput): Promise<Task> {
    await delay(300);
    const now = new Date().toISOString();
    const task: Task = {
      id: `T-${String(nextId++).padStart(3, '0')}`,
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      type: input.type ?? 'other',
      status: input.status ?? 'todo',
      priority: input.priority ?? 'medium',
      dueDate: input.dueDate,
      relatedTo: input.relatedTo?.trim() || undefined,
      assignee: 'Alex Morgan',
      createdAt: now,
      updatedAt: now,
    };
    tasksDb = [task, ...tasksDb];
    return task;
  },

  async update(input: UpdateTaskInput): Promise<Task> {
    await delay(250);
    const index = tasksDb.findIndex((t) => t.id === input.id);
    if (index === -1) throw new Error('Task not found');
    const updated: Task = {
      ...tasksDb[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    tasksDb = [...tasksDb.slice(0, index), updated, ...tasksDb.slice(index + 1)];
    return updated;
  },

  async toggleComplete(id: string): Promise<Task> {
    const task = tasksDb.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');
    if (task.status === 'done') {
      return tasksService.update({ id, status: 'todo', completedAt: undefined });
    }
    return tasksService.update({
      id,
      status: 'done',
      completedAt: new Date().toISOString(),
    });
  },

  async remove(id: string): Promise<void> {
    await delay(200);
    tasksDb = tasksDb.filter((t) => t.id !== id);
  },
};