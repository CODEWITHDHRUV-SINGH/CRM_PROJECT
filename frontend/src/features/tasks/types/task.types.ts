export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskType = 'call' | 'email' | 'meeting' | 'follow-up' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  relatedTo?: string;
  assignee: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  type?: TaskType;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  relatedTo?: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  type?: TaskType | 'all';
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
  cancelled: 'Cancelled',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  call: 'Call',
  email: 'Email',
  meeting: 'Meeting',
  'follow-up': 'Follow-up',
  other: 'Other',
};

export const PRIORITY_TONE: Record<TaskPriority, { fg: string; bg: string }> = {
  low: { fg: '#6d7770', bg: '#f3f3f0' },
  medium: { fg: '#547c9c', bg: '#edf4f9' },
  high: { fg: '#aa7531', bg: '#fbf3e2' },
  urgent: { fg: '#bd6948', bg: '#fff1e9' },
};

export const STATUS_TONE: Record<TaskStatus, { fg: string; bg: string }> = {
  todo: { fg: '#547c9c', bg: '#edf4f9' },
  'in-progress': { fg: '#aa7531', bg: '#fbf3e2' },
  done: { fg: '#397a55', bg: '#edf5ed' },
  cancelled: { fg: '#8a6b5d', bg: '#f5f0ed' },
};

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'done' || task.status === 'cancelled') return false;
  const due = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}