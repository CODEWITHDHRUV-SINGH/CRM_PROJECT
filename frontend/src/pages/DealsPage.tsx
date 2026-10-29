import { useState } from 'react';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ErrorMessage } from '../components/feedback/ErrorMessage';
import { useToast } from '../components/feedback/Toast';
import { useDeals } from '../features/deals/hooks/useDeals';
import { DealFilters } from '../features/deals/components/DealFilters';
import { DealTable } from '../features/deals/components/DealTable';
import { DealPipeline } from '../features/deals/components/DealPipeline';
import { DealForm } from '../features/deals/components/DealForm';
import { DealDetails } from '../features/deals/components/DealDetails';
import type {
  CreateDealInput,
  Deal,
  DealFilters as Filters,
  DealStage,
} from '../features/deals/types/deal.types';
import { getErrorMessage } from '../api/errorHandler';

type ViewMode = 'board' | 'table';

export default function DealsPage() {
  const toast = useToast();
  const [view, setView] = useState<ViewMode>('board');
  const [filters, setFilters] = useState<Filters>({ search: '', stage: 'all', source: 'all' });
  const { data, isLoading, error, refetch, create, update, moveStage, remove } = useDeals(filters);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Deal | null>(null);
  const [viewTarget, setViewTarget] = useState<Deal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Deal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalValue = data.reduce((s, d) => s + d.value, 0);
  const activeDeals = data.filter((d) => d.stage !== 'won' && d.stage !== 'lost').length;

  async function handleCreate(values: CreateDealInput) {
    try {
      await create(values);
      toast.success(`${values.name} added to your deals`);
      setCreateOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleUpdate(values: CreateDealInput) {
    if (!editTarget) return;
    try {
      await update({ ...values, id: editTarget.id });
      toast.success('Deal updated');
      setEditTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleStageChange(dealId: string, stage: DealStage) {
    try {
      await moveStage(dealId, stage);
      toast.success(`Deal moved to ${stage}`);
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
          <p className="eyebrow">WORKSPACE <span className="heading-eyebrow-dot">/</span> Deals</p>
          <h1>Deals</h1>
          <p className="page-subtitle">
            {isLoading
              ? 'Loading...'
              : `${activeDeals} active deals · $${(totalValue / 1000).toFixed(0)}k total value`}
          </p>
        </div>
        <div className="heading-actions">
          <div style={{
            display: 'inline-flex',
            border: '1px solid #e5e7e0',
            borderRadius: 6,
            overflow: 'hidden',
          }}>
            <button
              type="button"
              onClick={() => setView('board')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '7px 12px', border: 0,
                background: view === 'board' ? '#176451' : '#fff',
                color: view === 'board' ? '#fff' : '#5a655e',
                fontSize: 10, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <LayoutGrid size={13} /> Board
            </button>
            <button
              type="button"
              onClick={() => setView('table')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '7px 12px', border: 0,
                background: view === 'table' ? '#176451' : '#fff',
                color: view === 'table' ? '#fff' : '#5a655e',
                fontSize: 10, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <List size={13} /> Table
            </button>
          </div>
          <Button
            variant="primary"
            iconLeft={<Plus size={16} />}
            onClick={() => setCreateOpen(true)}
          >
            Add deal
          </Button>
        </div>
      </div>

      <section className="panel" style={{ padding: '16px 18px' }}>
        <div style={{ marginBottom: 14 }}>
          <DealFilters filters={filters} onChange={setFilters} />
        </div>

        {error ? (
          <ErrorMessage onRetry={refetch} message={error} />
        ) : view === 'board' ? (
          <DealPipeline
            data={data}
            isLoading={isLoading}
            onDealClick={setViewTarget}
            onStageChange={handleStageChange}
          />
        ) : (
          <DealTable
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
        title="Add a deal"
        subtitle="Add a new opportunity to your pipeline."
        size="lg"
      >
        <DealForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit deal"
        subtitle={editTarget?.name}
        size="lg"
      >
        {editTarget && (
          <DealForm
            initial={editTarget}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      <Modal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Deal details"
      >
        {viewTarget && (
          <DealDetails
            deal={viewTarget}
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
        title={`Delete ${deleteTarget?.name ?? 'deal'}?`}
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