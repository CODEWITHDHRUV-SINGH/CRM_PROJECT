import { Calendar, User, Building2, DollarSign } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import {
  DEAL_SOURCE_LABELS,
  DEAL_STAGE_LABELS,
  type Deal,
} from '../types/deal.types';

interface DealDetailsProps {
  deal: Deal;
  onClose: () => void;
  onEdit: () => void;
}

const STAGE_TONE: Record<string, { color: string; bg: string }> = {
  new: { color: '#bd6948', bg: '#fff1e9' },
  contacted: { color: '#aa7531', bg: '#fbf3e2' },
  qualified: { color: '#397a55', bg: '#edf5ed' },
  proposal: { color: '#547c9c', bg: '#edf4f9' },
  won: { color: '#176451', bg: '#e7f4ec' },
  lost: { color: '#8a6b5d', bg: '#f5f0ed' },
};

export function DealDetails({ deal, onClose, onEdit }: DealDetailsProps) {
  const tone = STAGE_TONE[deal.stage];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 16, color: '#2b3831' }}>{deal.name}</h3>
        <p style={{ margin: '2px 0 8px', fontSize: 11, color: '#89928b' }}>{deal.companyName}</p>
        <span className="status-pill" style={{ color: tone.color, background: tone.bg }}>
          <i />{DEAL_STAGE_LABELS[deal.stage]}
        </span>
      </div>

      <div style={{
        padding: 14,
        background: '#fafaf8',
        borderRadius: 8,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
      }}>
        <Stat icon={<DollarSign size={12} />} label="Value" value={`$${deal.value.toLocaleString()}`} />
        <Stat label="Probability" value={`${deal.probability}%`} />
        <Stat icon={<Building2 size={12} />} label="Company" value={deal.companyName} />
        <Stat icon={<User size={12} />} label="Contact" value={deal.contactName ?? '—'} />
        <Stat icon={<Calendar size={12} />} label="Expected close" value={
          deal.expectedCloseDate
            ? new Date(deal.expectedCloseDate).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })
            : '—'
        } />
        <Stat label="Source" value={DEAL_SOURCE_LABELS[deal.source]} />
      </div>

      {deal.notes && (
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: '#89928b', textTransform: 'uppercase', letterSpacing: 1 }}>
            Notes
          </p>
          <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#5a655e', background: '#fafaf8', padding: 10, borderRadius: 6 }}>
            {deal.notes}
          </p>
        </div>
      )}

      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={onEdit}>Edit deal</Button>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 700, color: '#a0a69f', textTransform: 'uppercase', letterSpacing: 0.8, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
        {icon}{label}
      </p>
      <p style={{ margin: 0, color: '#2b3831', fontSize: 12, fontWeight: 600 }}>{value}</p>
    </div>
  );
}