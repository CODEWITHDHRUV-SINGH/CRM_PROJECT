import { Globe, Users, Briefcase, MapPin, Phone } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import {
  COMPANY_INDUSTRY_LABELS,
  COMPANY_SIZE_LABELS,
  COMPANY_STATUS_LABELS,
  type Company,
} from '../types/company.types';

interface CompanyDetailsProps {
  company: Company;
  onClose: () => void;
  onEdit: () => void;
}

export function CompanyDetails({ company, onClose, onEdit }: CompanyDetailsProps) {
  const statusTone =
    company.status === 'customer' ? { color: '#397a55', bg: '#edf5ed' } :
    company.status === 'prospect' ? { color: '#547c9c', bg: '#edf4f9' } :
    company.status === 'active' ? { color: '#397a55', bg: '#edf5ed' } :
    { color: '#bd6948', bg: '#fff1e9' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          className="lead-avatar"
          style={{ width: 48, height: 48, fontSize: 16, borderRadius: 12 }}
        >
          {company.name.slice(0, 2).toUpperCase()}
        </span>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 16, color: '#2b3831' }}>{company.name}</h3>
          {company.domain && (
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#89928b', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Globe size={10} /> {company.domain}
            </p>
          )}
        </div>
        <span className="status-pill" style={{ color: statusTone.color, background: statusTone.bg }}>
          <i />{COMPANY_STATUS_LABELS[company.status]}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11 }}>
        <Field label="Industry" value={COMPANY_INDUSTRY_LABELS[company.industry]} />
        <Field label="Size" value={COMPANY_SIZE_LABELS[company.size]} />
        <Field icon={<MapPin size={9} />} label="Location" value={company.location ?? '—'} />
        <Field icon={<Phone size={9} />} label="Phone" value={company.phone ?? '—'} />
        <Field label="Owner" value={company.owner} />
        <Field
          label="Annual revenue"
          value={company.annualRevenue ? `$${company.annualRevenue.toLocaleString()}` : '—'}
        />
        <Field icon={<Users size={9} />} label="Contacts" value={String(company.contactCount)} />
        <Field icon={<Briefcase size={9} />} label="Deals" value={String(company.dealCount)} />
      </div>

      {company.description && (
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: '#89928b', textTransform: 'uppercase', letterSpacing: 1 }}>
            About
          </p>
          <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#5a655e', background: '#fafaf8', padding: 10, borderRadius: 6 }}>
            {company.description}
          </p>
        </div>
      )}

      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={onEdit}>Edit company</Button>
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