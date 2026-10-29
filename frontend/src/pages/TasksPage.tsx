import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ErrorMessage } from '../components/feedback/ErrorMessage';
import { useToast } from '../components/feedback/Toast';
import { useTasks } from '../features/tasks/hooks/useTasks';
import { TaskFilters } from '../features/tasks/components/TaskFilters';
import { TaskTable } from '../features/tasks/components/TaskTable';
import { TaskForm } from '../features/tasks/components/TaskForm';
import { TaskDetails } from '../features/tasks/components/TaskDetails';
import type {
  CreateTaskInput,
  Task,
  TaskFilters as Filters,
} from '../features/tasks/types/task.types';
import { getErrorMessage } from '../api/errorHandler';

export default function TasksPage() {
  const toast = useToast();
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    priority: 'all',
    type: 'all',
  });
  const { data, isLoading, error, refetch, create, update, toggleComplete, remove } = useTasks(filters);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Task | null>(null);
  const [viewTarget, setViewTarget] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCount = data.filter((t) => t.status !== 'done' && t.status !== 'cancelled').length;
  const overdueCount = data.filter((t) => {
    if (t.status === 'done' || t.status === 'cancelled' || !t.dueDate) return false;
    const d = new Date(t.dueDate); d.setHours(0, 0, 0, 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return d < today;
  }).length;

  async function handleCreate(values: CreateTaskInput) {
    try {
      await create(values);
      toast.success(`Task created`);
      setCreateOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleUpdate(values: CreateTaskInput) {
    if (!editTarget) return;
    try {
      await update({ ...values, id: editTarget.id });
      toast.success('Task updated');
      setEditTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleToggleComplete(task: Task) {
    try {
      const updated = await toggleComplete(task.id);
      toast.success(updated.status === 'done' ? 'Task completed' : 'Task reopened');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success(`Task deleted`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="dashboard-content">
      <div className="page-heading-row">
        <div>
          <p className="eyebrow">OPERATIONS <span className="heading-eyebrow-dot">/</span> Tasks</p>
          <h1>Tasks</h1>
          <p className="page-subtitle">
            {isLoading
              ? 'Loading...'
              : `${openCount} open · ${overdueCount} overdue · ${data.length} total`}
          </p>
        </div>
        <div className="heading-actions">
          <Button
            variant="primary"
            iconLeft={<Plus size={16} />}
            onClick={() => setCreateOpen(true)}
          >
            Add task
          </Button>
        </div>
      </div>

      <section className="panel" style={{ padding: '16px 18px' }}>
        <div style={{ marginBottom: 14 }}>
          <TaskFilters filters={filters} onChange={setFilters} />
        </div>

        {error ? (
          <ErrorMessage onRetry={refetch} message={error} />
        ) : (
          <TaskTable
            data={data}
            isLoading={isLoading}
            onRowClick={setViewTarget}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </section>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add a task"
        subtitle="Something to follow up on."
        size="lg"
      >
        <TaskForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit task"
        subtitle={editTarget?.title}
        size="lg"
      >
        {editTarget && (
          <TaskForm
            initial={editTarget}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      <Modal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Task details"
      >
        {viewTarget && (
          <TaskDetails
            task={viewTarget}
            onClose={() => setViewTarget(null)}
            onEdit={() => {
              setEditTarget(viewTarget);
              setViewTarget(null);
            }}
            onToggleComplete={async () => {
              await handleToggleComplete(viewTarget);
              setViewTarget(null);
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete this task?`}
        description="This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}