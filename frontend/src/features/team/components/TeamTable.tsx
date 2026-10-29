import { Eye, Pencil, Trash2, Send, ShieldAlert } from 'lucide-react';
import { DataTable, type Column } from '../../../components/tables/DataTable';
import { RowMenu } from '../../../components/common/RowMenu';
import {
  ROLE_LABELS,
  ROLE_TONE,
  STATUS_LABELS,
  STATUS_TONE,
  formatLastActive,
  type TeamMember,
} from '../types/team.types';

interface TeamTableProps {
  data: TeamMember[];
  isLoading: boolean;
  onRowClick: (m: TeamMember) => void;
  onEdit: (m: TeamMember) => void;
  onDelete: (m: TeamMember) => void;
  onResendInvite: (m: TeamMember) => void;
}

const AVATAR_COLORS = ['coral', 'blue', 'green', 'yellow', 'purple'];

export function TeamTable({ data, isLoading, onRowClick, onEdit, onDelete, onResendInvite }: TeamTableProps) {
  const columns: Column<TeamMember>[] = [
    {
      key: 'name',
      header: 'Member',
      render: (m) => (
        <div className="lead-person">
          <span className={`lead-avatar avatar-${AVATAR_COLORS[m.name.length % AVATAR_COLORS.length]}`}>
            {m.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
          </span>
          <div>
            <strong style={{ display: 'block', color: '#46534b', fontSize: 11 }}>{m.name}</strong>
            <span style={{ fontSize: 10, color: '#8d968e' }}>{m.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (m) => {
        const tone = ROLE_TONE[m.role];
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            borderRadius: 20,
            background: tone.bg,
            color: tone.fg,
            fontSize: 9,
            fontWeight: 700,
          }}>
            {m.role === 'owner' && <ShieldAlert size={9} />}
            {ROLE_LABELS[m.role]}
          </span>
        );
      },
    },
    {
      key: 'department',
      header: 'Department',
      render: (m) => (
        <span style={{ fontSize: 10, color: '#5a655e' }}>{m.department ?? '—'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (m) => {
        const tone = STATUS_TONE[m.status];
        return (
          <span className="status-pill" style={{ color: tone.fg, background: tone.bg }}>
            <i />{STATUS_LABELS[m.status]}
          </span>
        );
      },
    },
    {
      key: 'lastActive',
      header: 'Last active',
      render: (m) => (
        <span style={{ fontSize: 10, color: '#5a655e' }}>{formatLastActive(m)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '80px',
      render: (m) => {
        const canEdit = m.role !== 'owner';
        const canDelete = m.role !== 'owner';
        return (
          <RowMenu
            ariaLabel={`Actions for ${m.name}`}
            items={[
              { label: 'View profile', icon: <Eye size={13} />, onClick: () => onRowClick(m) },
              ...(m.status === 'invited'
                ? [{ label: 'Resend invite', icon: <Send size={13} />, onClick: () => onResendInvite(m) }]
                : []),
              ...(canEdit
                ? [{ label: 'Edit member', icon: <Pencil size={13} />, onClick: () => onEdit(m) }]
                : []),
              ...(canDelete
                ? [{ label: 'Remove', icon: <Trash2 size={13} />, onClick: () => onDelete(m), danger: true as const }]
                : []),
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
      rowKey={(m) => m.id}
      isLoading={isLoading}
      onRowClick={onRowClick}
      emptyMessage="No team members found."
    />
  );
}