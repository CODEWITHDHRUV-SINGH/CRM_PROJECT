import { Button } from '../../../components/common/Button';
import {
  CONTACT_ROLE_LABELS,
  CONTACT_STATUS_LABELS,
  type Contact,
} from '../types/contact.types';

interface ContactDetailsProps {
  contact: Contact;
  onClose: () => void;
  onEdit: () => void;
}

export function ContactDetails({ contact, onClose, onEdit }: ContactDetailsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="lead-avatar" style={{ width: 44, height: 44, fontSize: 14 }}>
          {contact.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
        </span>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 16, color: '#2b3831' }}>{contact.name}</h3>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#89928b' }}>
            {contact.jobTitle ? `${contact.jobTitle} · ` : ''}{contact.company}
          </p>
        </div>
        <span
          className="status-pill"
          style={{
            color: contact.status === 'active' ? '#397a55' : contact.status === 'inactive' ? '#6d7770' : '#bd6948',
            background: contact.status === 'active' ? '#edf5ed' : contact.status === 'inactive' ? '#f3f3f0' : '#fff1e9',
          }}
        >
          <i />{CONTACT_STATUS_LABELS[contact.status]}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11 }}>
        <Field label="Email" value={contact.email} />
        <Field label="Phone" value={contact.phone ?? '—'} />
        <Field label="Role" value={CONTACT_ROLE_LABELS[contact.role]} />
        <Field label="Owner" value={contact.owner} />
        <Field
          label="Added"
          value={new Date(contact.createdAt).toLocaleDateString('en', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        />
        <Field
          label="Last updated"
          value={new Date(contact.updatedAt).toLocaleDateString('en', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        />
      </div>

      {contact.notes && (
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: '#89928b', textTransform: 'uppercase', letterSpacing: 1 }}>
            Notes
          </p>
          <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#5a655e', background: '#fafaf8', padding: 10, borderRadius: 6 }}>
            {contact.notes}
          </p>
        </div>
      )}

      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={onEdit}>Edit contact</Button>
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