import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ErrorMessage } from '../components/feedback/ErrorMessage';
import { useToast } from '../components/feedback/Toast';
import { useLeads } from '../features/leads/hooks/useLeads';
import { LeadFilters } from '../features/leads/components/LeadFilters';
import { LeadTable } from '../features/leads/components/LeadTable';
import { LeadForm } from '../features/leads/components/LeadForm';
import { LeadDetails } from '../features/leads/components/LeadDetails';
import type {
  CreateLeadInput,
  Lead,
  LeadFilters as Filters,
} from '../features/leads/types/lead.types';
import { getErrorMessage } from '../api/errorHandler';

export default function LeadsPage() {
  const toast = useToast();
  const [filters, setFilters] = useState<Filters>({ search: '', status: 'all', source: 'all' });
  const { data, isLoading, error, refetch, create, update, remove } = useLeads(filters);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Lead | null>(null);
  const [viewTarget, setViewTarget] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleCreate(values: CreateLeadInput) {
    try {
      await create(values);
      toast.success(`${values.name} added to your leads`);
      setCreateOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleUpdate(values: CreateLeadInput) {
    if (!editTarget) return;
    try {
      await update({ ...values, id: editTarget.id });
      toast.success('Lead updated');
      setEditTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success(`${deleteTarget.name} deleted`);
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
          <p className="eyebrow">WORKSPACE <span className="heading-eyebrow-dot">/</span> Leads</p>
          <h1>Leads</h1>
          <p className="page-subtitle">
            {isLoading ? 'Loading...' : `${data.length} ${data.length === 1 ? 'lead' : 'leads'} in your workspace`}
          </p>
        </div>
        <div className="heading-actions">
          <Button
            variant="primary"
            iconLeft={<Plus size={16} />}
            onClick={() => setCreateOpen(true)}
          >
            Add lead
          </Button>
        </div>
      </div>

      <section className="panel" style={{ padding: '16px 18px' }}>
        <div style={{ marginBottom: 14 }}>
          <LeadFilters filters={filters} onChange={setFilters} />
        </div>

        {error ? (
          <ErrorMessage onRetry={refetch} message={error} />
        ) : (
          <LeadTable
            data={data}
            isLoading={isLoading}
            onRowClick={setViewTarget}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
          />
        )}
      </section>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add a lead"
        subtitle="Add someone new to your pipeline."
      >
        <LeadForm
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit lead"
        subtitle={editTarget?.name}
      >
        {editTarget && (
          <LeadForm
            initial={editTarget}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      <Modal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Lead details"
      >
        {viewTarget && (
          <LeadDetails
            lead={viewTarget}
            onClose={() => setViewTarget(null)}
            onEdit={() => {
              setEditTarget(viewTarget);
              setViewTarget(null);
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete ${deleteTarget?.name ?? 'lead'}?`}
        description="This action cannot be undone. All notes and activity will be removed."
        confirmText="Delete"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}