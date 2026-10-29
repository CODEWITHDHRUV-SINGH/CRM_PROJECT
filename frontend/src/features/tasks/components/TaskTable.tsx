import { Eye, Pencil, Trash2, Check, RotateCcw, Calendar, AlertTriangle, Phone, Mail, Users, Flag } from 'lucide-react';
import { DataTable, type Column } from '../../../components/tables/DataTable';
import { RowMenu } from '../../../components/common/RowMenu';
import {
  PRIORITY_TONE,
  STATUS_TONE,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TASK_TYPE_LABELS,
  isOverdue,
  type Task,
  type TaskType,
} from '../types/task.types';

interface TaskTableProps {
  data: Task[];
  isLoading: boolean;
  onRowClick: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}

const TYPE_ICONS: Record<TaskType, React.ReactNode> = {
  call: <Phone size={11} />,
  email: <Mail size={11} />,
  meeting: <Users size={11} />,
  'follow-up': <Flag size={11} />,
  other: <Flag size={11} />,
};

export function TaskTable({ data, isLoading, onRowClick, onEdit, onDelete, onToggleComplete }: TaskTableProps) {
  const columns: Column<Task>[] = [
    {
      key: 'complete',
      header: '',
      width: '36px',
      align: 'center',
      render: (t) => {
        const done = t.status === 'done';
        return (
          <button
            type="button"
            aria-label={done ? 'Mark incomplete' : 'Mark complete'}
            onClick={(e) => { e.stopPropagation(); onToggleComplete(t); }}
            style={{
              display: 'grid',
              width: 18,
              height: 18,
              placeItems: 'center',
              border: `1.5px solid ${done ? '#397a55' : '#d5d8d2'}`,
              borderRadius: 4,
              background: done ? '#397a55' : '#fff',
              color: '#fff',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {done && <Check size={12} strokeWidth={3} />}
          </button>
        );
      },
    },
    {
      key: 'title',
      header: 'Task',
      render: (t) => {
        const overdue = isOverdue(t);
        const done = t.status === 'done';
        return (
          <div>
            <strong style={{
              display: 'block',
              color: done ? '#9aa19a' : '#46534b',
              fontSize: 11,
              textDecoration: done ? 'line-through' : 'none',
            }}>
              {t.title}
            </strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
              <span style={{ fontSize: 9, color: '#8d968e', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                {TYPE_ICONS[t.type]} {TASK_TYPE_LABELS[t.type]}
              </span>
              {t.relatedTo && (
                <span style={{ fontSize: 9, color: '#8d968e' }}>· {t.relatedTo}</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      align: 'center',
      render: (t) => {
        const tone = PRIORITY_TONE[t.priority];
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 20,
            background: tone.bg, color: tone.fg,
            fontSize: 9, fontWeight: 700,
          }}>
            {TASK_PRIORITY_LABELS[t.priority]}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => {
        const tone = STATUS_TONE[t.status];
        return (
          <span className="status-pill" style={{ color: tone.fg, background: tone.bg }}>
            <i />{TASK_STATUS_LABELS[t.status]}
          </span>
        );
      },
    },
    {
      key: 'due',
      header: 'Due',
      render: (t) => {
        if (!t.dueDate) return <span style={{ fontSize: 10, color: '#b0b6af' }}>—</span>;
        const overdue = isOverdue(t);
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 10,
            color: overdue ? '#bd6948' : '#5a655e',
            fontWeight: overdue ? 700 : 400,
          }}>
            {overdue && <AlertTriangle size={10} />}
            {!overdue && <Calendar size={10} />}
            {new Date(t.dueDate).toLocaleDateString('en', { day: 'numeric', month: 'short' })}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '80px',
      render: (t) => {
        const done = t.status === 'done';
        return (
          <RowMenu
            ariaLabel={`Actions for ${t.title}`}
            items={[
              { label: 'View details', icon: <Eye size={13} />, onClick: () => onRowClick(t) },
              {
                label: done ? 'Mark incomplete' : 'Mark complete',
                icon: done ? <RotateCcw size={13} /> : <Check size={13} />,
                onClick: () => onToggleComplete(t),
              },
              { label: 'Edit', icon: <Pencil size={13} />, onClick: () => onEdit(t) },
              { label: 'Delete', icon: <Trash2 size={13} />, onClick: () => onDelete(t), danger: true },
            ]}
          />
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey={(t) => t.id}
      isLoading={isLoading}
      onRowClick={onRowClick}
      emptyMessage="No tasks found. Create your first task to stay on top of things."
    />
  );
}