import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ErrorMessage } from '../components/feedback/ErrorMessage';
import { useToast } from '../components/feedback/Toast';
import { useContacts } from '../features/contacts/hooks/useContacts';
import { ContactFilters } from '../features/contacts/components/ContactFilters';
import { ContactTable } from '../features/contacts/components/ContactTable';
import { ContactForm } from '../features/contacts/components/ContactForm';
import { ContactDetails } from '../features/contacts/components/ContactDetails';
import type {
  Contact,
  ContactFilters as Filters,
  CreateContactInput,
} from '../features/contacts/types/contact.types';
import { getErrorMessage } from '../api/errorHandler';

export default function ContactsPage() {
  const toast = useToast();
  const [filters, setFilters] = useState<Filters>({ search: '', status: 'all', role: 'all' });
  const { data, isLoading, error, refetch, create, update, remove } = useContacts(filters);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Contact | null>(null);
  const [viewTarget, setViewTarget] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleCreate(values: CreateContactInput) {
    try {
      await create(values);
      toast.success(`${values.name} added to your contacts`);
      setCreateOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleUpdate(values: CreateContactInput) {
    if (!editTarget) return;
    try {
      await update({ ...values, id: editTarget.id });
      toast.success('Contact updated');
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
          <p className="eyebrow">WORKSPACE <span className="heading-eyebrow-dot">/</span> Contacts</p>
          <h1>Contacts</h1>
          <p className="page-subtitle">
            {isLoading ? 'Loading...' : `${data.length} ${data.length === 1 ? 'contact' : 'contacts'} in your workspace`}
          </p>
        </div>
        <div className="heading-actions">
          <Button
            variant="primary"
            iconLeft={<Plus size={16} />}
            onClick={() => setCreateOpen(true)}
          >
            Add contact
          </Button>
        </div>
      </div>

      <section className="panel" style={{ padding: '16px 18px' }}>
        <div style={{ marginBottom: 14 }}>
          <ContactFilters filters={filters} onChange={setFilters} />
        </div>

        {error ? (
          <ErrorMessage onRetry={refetch} message={error} />
        ) : (
          <ContactTable
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
        title="Add a contact"
        subtitle="Add someone new to your network."
      >
        <ContactForm
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit contact"
        subtitle={editTarget?.name}
      >
        {editTarget && (
          <ContactForm
            initial={editTarget}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      <Modal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Contact details"
      >
        {viewTarget && (
          <ContactDetails
            contact={viewTarget}
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
        title={`Delete ${deleteTarget?.name ?? 'contact'}?`}
        description="This action cannot be undone. All notes and history will be removed."
        confirmText="Delete"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}