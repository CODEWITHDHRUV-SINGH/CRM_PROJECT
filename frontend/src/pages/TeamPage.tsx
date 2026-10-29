import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ErrorMessage } from '../components/feedback/ErrorMessage';
import { useToast } from '../components/feedback/Toast';
import { useTeam } from '../features/team/hooks/useTeam';
import { TeamFilters } from '../features/team/components/TeamFilters';
import { TeamTable } from '../features/team/components/TeamTable';
import { MemberForm } from '../features/team/components/MemberForm';
import { MemberDetails } from '../features/team/components/MemberDetails';
import type {
  CreateMemberInput,
  TeamFilters as Filters,
  TeamMember,
} from '../features/team/types/team.types';
import { getErrorMessage } from '../api/errorHandler';

export default function TeamPage() {
  const toast = useToast();
  const [filters, setFilters] = useState<Filters>({ search: '', role: 'all', status: 'all' });
  const { data, isLoading, error, refetch, invite, update, resendInvite, remove } = useTeam(filters);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TeamMember | null>(null);
  const [viewTarget, setViewTarget] = useState<TeamMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const activeCount = data.filter((m) => m.status === 'active').length;
  const invitedCount = data.filter((m) => m.status === 'invited').length;

  async function handleInvite(values: CreateMemberInput) {
    try {
      await invite(values);
      toast.success(`Invitation sent to ${values.email}`);
      setInviteOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleUpdate(values: CreateMemberInput) {
    if (!editTarget) return;
    try {
      const updated = await update({ ...values, id: editTarget.id });
      if (viewTarget?.id === updated.id) setViewTarget(updated);
      toast.success('Member updated');
      setEditTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleResend(target: TeamMember) {
    try {
      await resendInvite(target.id);
      toast.success(`Invitation resent to ${target.email}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success(`${deleteTarget.name} removed from team`);
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
          <p className="eyebrow">ADMIN <span className="heading-eyebrow-dot">/</span> Team</p>
          <h1>Team</h1>
          <p className="page-subtitle">
            {isLoading ? 'Loading...' : `${data.length} members · ${activeCount} active · ${invitedCount} pending`}
          </p>
        </div>
        <div className="heading-actions">
          <Button variant="primary" iconLeft={<Plus size={16} />} onClick={() => setInviteOpen(true)}>
            Invite member
          </Button>
        </div>
      </div>

      <section className="panel" style={{ padding: '16px 18px' }}>
        <div style={{ marginBottom: 14 }}>
          <TeamFilters filters={filters} onChange={setFilters} />
        </div>
        {error ? (
          <ErrorMessage onRetry={refetch} message={error} />
        ) : (
          <TeamTable
            data={data}
            isLoading={isLoading}
            onRowClick={setViewTarget}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
            onResendInvite={handleResend}
          />
        )}
      </section>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite a team member"
        subtitle="They'll receive an email to join your workspace."
      >
        <MemberForm onSubmit={handleInvite} onCancel={() => setInviteOpen(false)} />
      </Modal>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit member"
        subtitle={editTarget?.name}
      >
        {editTarget && (
          <MemberForm
            initial={editTarget}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      <Modal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Member profile"
      >
        {viewTarget && (
          <MemberDetails
            member={viewTarget}
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
        title={`Remove ${deleteTarget?.name ?? 'member'}?`}
        description="They will lose access immediately. Their records stay intact but will be reassigned."
        confirmText="Remove"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}