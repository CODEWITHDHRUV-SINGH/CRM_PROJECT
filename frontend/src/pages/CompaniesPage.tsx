import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ErrorMessage } from '../components/feedback/ErrorMessage';
import { useToast } from '../components/feedback/Toast';
import { useCompanies } from '../features/companies/hooks/useCompanies';
import { CompanyFilters } from '../features/companies/components/CompanyFilters';
import { CompanyTable } from '../features/companies/components/CompanyTable';
import { CompanyForm } from '../features/companies/components/CompanyForm';
import { CompanyDetails } from '../features/companies/components/CompanyDetails';
import type {
  Company,
  CompanyFilters as Filters,
  CreateCompanyInput,
} from '../features/companies/types/company.types';
import { getErrorMessage } from '../api/errorHandler';

export default function CompaniesPage() {
  const toast = useToast();
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    industry: 'all',
    size: 'all',
  });
  const { data, isLoading, error, refetch, create, update, remove } = useCompanies(filters);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Company | null>(null);
  const [viewTarget, setViewTarget] = useState<Company | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleCreate(values: CreateCompanyInput) {
    try {
      await create(values);
      toast.success(`${values.name} added to your companies`);
      setCreateOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleUpdate(values: CreateCompanyInput) {
    if (!editTarget) return;
    try {
      await update({ ...values, id: editTarget.id });
      toast.success('Company updated');
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
          <p className="eyebrow">WORKSPACE <span className="heading-eyebrow-dot">/</span> Companies</p>
          <h1>Companies</h1>
          <p className="page-subtitle">
            {isLoading
              ? 'Loading...'
              : `${data.length} ${data.length === 1 ? 'company' : 'companies'} in your workspace`}
          </p>
        </div>
        <div className="heading-actions">
          <Button
            variant="primary"
            iconLeft={<Plus size={16} />}
            onClick={() => setCreateOpen(true)}
          >
            Add company
          </Button>
        </div>
      </div>

      <section className="panel" style={{ padding: '16px 18px' }}>
        <div style={{ marginBottom: 14 }}>
          <CompanyFilters filters={filters} onChange={setFilters} />
        </div>

        {error ? (
          <ErrorMessage onRetry={refetch} message={error} />
        ) : (
          <CompanyTable
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
        title="Add a company"
        subtitle="Add an organization to your CRM."
        size="lg"
      >
        <CompanyForm
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit company"
        subtitle={editTarget?.name}
        size="lg"
      >
        {editTarget && (
          <CompanyForm
            initial={editTarget}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      <Modal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Company details"
      >
        {viewTarget && (
          <CompanyDetails
            company={viewTarget}
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
        title={`Delete ${deleteTarget?.name ?? 'company'}?`}
        description="This action cannot be undone. Linked contacts and deals will remain, but the company record will be removed."
        confirmText="Delete"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}