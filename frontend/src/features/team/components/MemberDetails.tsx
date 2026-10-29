import { Mail, Phone, Building2, Calendar, Shield } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import {
  ROLE_LABELS,
  ROLE_TONE,
  STATUS_LABELS,
  STATUS_TONE,
  formatLastActive,
  type TeamMember,
} from '../types/team.types';

interface MemberDetailsProps {
  member: TeamMember;
  onClose: () => void;
  onEdit: () => void;
}

export function MemberDetails({ member, onClose, onEdit }: MemberDetailsProps) {
  const roleTone = ROLE_TONE[member.role];
  const statusTone = STATUS_TONE[member.status];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="lead-avatar" style={{ width: 48, height: 48, fontSize: 16, borderRadius: 12 }}>
          {member.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
        </span>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 16, color: '#2b3831' }}>{member.name}</h3>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#89928b' }}>
            {member.department ?? 'No department'}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 20,
            background: roleTone.bg, color: roleTone.fg,
            fontSize: 9, fontWeight: 700,
          }}>
            <Shield size={9} /> {ROLE_LABELS[member.role]}
          </span>
          <span className="status-pill" style={{ color: statusTone.fg, background: statusTone.bg }}>
            <i />{STATUS_LABELS[member.status]}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11 }}>
        <Field icon={<Mail size={9} />} label="Email" value={member.email} />
        <Field icon={<Phone size={9} />} label="Phone" value={member.phone ?? '—'} />
        <Field icon={<Building2 size={9} />} label="Department" value={member.department ?? '—'} />
        <Field label="Last active" value={formatLastActive(member)} />
        {member.joinedAt && (
          <Field
            icon={<Calendar size={9} />}
            label="Joined"
            value={new Date(member.joinedAt).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}
          />
        )}
        {member.invitedAt && member.status === 'invited' && (
          <Field
            icon={<Calendar size={9} />}
            label="Invited"
            value={new Date(member.invitedAt).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}
          />
        )}
      </div>

      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>Close</Button>
        {member.role !== 'owner' && (
          <Button variant="primary" onClick={onEdit}>Edit member</Button>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 700, color: '#a0a69f', textTransform: 'uppercase', letterSpacing: 0.8, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
        {icon}{label}
      </p>
      <p style={{ margin: 0, color: '#3a4640' }}>{value}</p>
    </div>
  );
}