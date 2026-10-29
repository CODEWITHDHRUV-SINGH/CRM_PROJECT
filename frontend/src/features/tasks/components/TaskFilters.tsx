import { Search } from 'lucide-react';
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TASK_TYPE_LABELS,
  type TaskFilters as Filters,
  type TaskPriority,
  type TaskStatus,
  type TaskType,
} from '../types/task.types';

interface TaskFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <label className="global-search" style={{ width: 240, height: 34, display: 'flex' }}>
        <Search size={14} />
        <input
          aria-label="Search tasks"
          placeholder="Search by title, description..."
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </label>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.status ?? 'all'}
        onChange={(e) => onChange({ ...filters, status: e.target.value as TaskStatus | 'all' })}
      >
        <option value="all">All statuses</option>
        {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((s) => (
          <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
        ))}
      </select>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.priority ?? 'all'}
        onChange={(e) => onChange({ ...filters, priority: e.target.value as TaskPriority | 'all' })}
      >
        <option value="all">All priorities</option>
        {(Object.keys(TASK_PRIORITY_LABELS) as TaskPriority[]).map((p) => (
          <option key={p} value={p}>{TASK_PRIORITY_LABELS[p]}</option>
        ))}
      </select>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.type ?? 'all'}
        onChange={(e) => onChange({ ...filters, type: e.target.value as TaskType | 'all' })}
      >
        <option value="all">All types</option>
        {(Object.keys(TASK_TYPE_LABELS) as TaskType[]).map((t) => (
          <option key={t} value={t}>{TASK_TYPE_LABELS[t]}</option>
        ))}
      </select>
    </div>
  );
}