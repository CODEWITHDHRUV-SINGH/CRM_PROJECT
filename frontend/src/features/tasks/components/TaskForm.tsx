import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { validateTask, hasErrors, type ValidationErrors } from '../validation/task.schema';
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TASK_TYPE_LABELS,
  type CreateTaskInput,
  type Task,
  type TaskPriority,
  type TaskStatus,
  type TaskType,
} from '../types/task.types';

interface TaskFormProps {
  initial?: Task;
  onSubmit: (values: CreateTaskInput) => Promise<void>;
  onCancel: () => void;
}

export function TaskForm({ initial, onSubmit, onCancel }: TaskFormProps) {
  const [values, setValues] = useState<CreateTaskInput>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    type: initial?.type ?? 'follow-up',
    status: initial?.status ?? 'todo',
    priority: initial?.priority ?? 'medium',
    dueDate: initial?.dueDate ?? '',
    relatedTo: initial?.relatedTo ?? '',
  });
  const [errors, setErrors] = useState<ValidationErrors<CreateTaskInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof CreateTaskInput>(key: K, value: CreateTaskInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateTask(values);
    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Input
        label="Task title"
        requiredMark
        value={values.title}
        onChange={(e) => update('title', e.target.value)}
        error={errors.title}
        placeholder="e.g. Follow up with Olivia"
      />

      <div className="input-field">
        <label className="field-label" htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          className="text-input"
          style={{ height: 70, padding: 10, resize: 'vertical' }}
          value={values.description ?? ''}
          onChange={(e) => update('description', e.target.value)}
          placeholder="What needs to happen?"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="input-field">
          <label className="field-label" htmlFor="task-type">Type</label>
          <select
            id="task-type"
            className="text-input"
            value={values.type}
            onChange={(e) => update('type', e.target.value as TaskType)}
          >
            {(Object.keys(TASK_TYPE_LABELS) as TaskType[]).map((t) => (
              <option key={t} value={t}>{TASK_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>
        <div className="input-field">
          <label className="field-label" htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            className="text-input"
            value={values.priority}
            onChange={(e) => update('priority', e.target.value as TaskPriority)}
          >
            {(Object.keys(TASK_PRIORITY_LABELS) as TaskPriority[]).map((p) => (
              <option key={p} value={p}>{TASK_PRIORITY_LABELS[p]}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input
          label="Due date"
          type="date"
          value={values.dueDate ?? ''}
          onChange={(e) => update('dueDate', e.target.value)}
          error={errors.dueDate}
        />
        <div className="input-field">
          <label className="field-label" htmlFor="task-status">Status</label>
          <select
            id="task-status"
            className="text-input"
            value={values.status}
            onChange={(e) => update('status', e.target.value as TaskStatus)}
          >
            {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((s) => (
              <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>

      <Input
        label="Related to"
        value={values.relatedTo ?? ''}
        onChange={(e) => update('relatedTo', e.target.value)}
        placeholder="Company, deal, or contact"
        hint="Optional. Link this task to a CRM record."
      />

      <div className="modal-actions">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isSubmitting}>
          {initial ? 'Save changes' : 'Add task'}
        </Button>
      </div>
    </form>
  );
}