import { Button } from '../../../components/common/Button';
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  type Lead,
} from '../types/lead.types';
import { LeadScoreBadge } from './LeadScoreBadge';

interface LeadDetailsProps {
  lead: Lead;
  onClose: () => void;
  onEdit: () => void;
}

export function LeadDetails({ lead, onClose, onEdit }: LeadDetailsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          className="lead-avatar"
          style={{ width: 44, height: 44, fontSize: 14 }}
        >
          {lead.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
        </span>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 16, color: '#2b3831' }}>{lead.name}</h3>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#89928b' }}>
            {lead.jobTitle ? `${lead.jobTitle} · ` : ''}{lead.company}
          </p>
        </div>
        <LeadScoreBadge score={lead.score} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11 }}>
        <Field label="Email" value={lead.email} />
        <Field label="Phone" value={lead.phone ?? '—'} />
        <Field label="Status" value={LEAD_STATUS_LABELS[lead.status]} />
        <Field label="Source" value={LEAD_SOURCE_LABELS[lead.source]} />
        <Field label="Owner" value={lead.owner} />
        <Field
          label="Created"
          value={new Date(lead.createdAt).toLocaleDateString('en', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        />
      </div>

      {lead.notes && (
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: '#89928b', textTransform: 'uppercase', letterSpacing: 1 }}>
            Notes
          </p>
          <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#5a655e', background: '#fafaf8', padding: 10, borderRadius: 6 }}>
            {lead.notes}
          </p>
        </div>
      )}

      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={onEdit}>Edit lead</Button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 700, color: '#a0a69f', textTransform: 'uppercase', letterSpacing: 0.8 }}>
        {label}
      </p>
      <p style={{ margin: 0, color: '#3a4640' }}>{value}</p>
    </div>
  );
}