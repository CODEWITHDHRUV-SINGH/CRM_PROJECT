import { Calendar, User, Link2, Flag } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import {
  PRIORITY_TONE,
  STATUS_TONE,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TASK_TYPE_LABELS,
  isOverdue,
  type Task,
} from '../types/task.types';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
  onToggleComplete: () => void;
}

export function TaskDetails({ task, onClose, onEdit, onToggleComplete }: TaskDetailsProps) {
  const priorityTone = PRIORITY_TONE[task.priority];
  const statusTone = STATUS_TONE[task.status];
  const overdue = isOverdue(task);
  const done = task.status === 'done';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h3 style={{
          margin: 0,
          fontSize: 16,
          color: done ? '#9aa19a' : '#2b3831',
          textDecoration: done ? 'line-through' : 'none',
        }}>
          {task.title}
        </h3>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          <span className="status-pill" style={{ color: statusTone.fg, background: statusTone.bg }}>
            <i />{TASK_STATUS_LABELS[task.status]}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 8px', borderRadius: 20,
            background: priorityTone.bg, color: priorityTone.fg,
            fontSize: 9, fontWeight: 700,
          }}>
            <Flag size={9} /> {TASK_PRIORITY_LABELS[task.priority]}
          </span>
        </div>
      </div>

      {task.description && (
        <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#5a655e', background: '#fafaf8', padding: 10, borderRadius: 6 }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11 }}>
        <Field label="Type" value={TASK_TYPE_LABELS[task.type]} />
        <Field icon={<User size={9} />} label="Assignee" value={task.assignee} />
        <Field
          icon={<Calendar size={9} />}
          label="Due date"
          value={
            task.dueDate
              ? `${new Date(task.dueDate).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}${overdue ? ' (overdue)' : ''}`
              : '—'
          }
          danger={overdue}
        />
        <Field icon={<Link2 size={9} />} label="Related to" value={task.relatedTo ?? '—'} />
      </div>

      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="secondary" onClick={onToggleComplete}>
          {done ? 'Mark incomplete' : 'Mark complete'}
        </Button>
        <Button variant="primary" onClick={onEdit}>Edit task</Button>
      </div>
    </div>
  );
}

function Field({ label, value, icon, danger }: { label: string; value: string; icon?: React.ReactNode; danger?: boolean }) {
  return (
    <div>
      <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 700, color: '#a0a69f', textTransform: 'uppercase', letterSpacing: 0.8, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
        {icon}{label}
      </p>
      <p style={{ margin: 0, color: danger ? '#bd6948' : '#3a4640', fontWeight: danger ? 600 : 400 }}>{value}</p>
    </div>
  );
}