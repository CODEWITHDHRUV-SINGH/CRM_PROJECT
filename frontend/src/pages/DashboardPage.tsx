import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Sparkles,
  Target,
  Trash2,
  UsersRound,
} from 'lucide-react';
import { useToast } from '../components/feedback/Toast';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { RowMenu } from '../components/common/RowMenu';
import { LeadForm } from '../features/leads/components/LeadForm';
import { LeadDetails } from '../features/leads/components/LeadDetails';
import { LeadScoreBadge } from '../features/leads/components/LeadScoreBadge';
import { useLeads } from '../features/leads/hooks/useLeads';
import {
  LEAD_STATUS_LABELS,
  type CreateLeadInput,
  type Lead,
} from '../features/leads/types/lead.types';
import { getErrorMessage } from '../api/errorHandler';
import type { DashboardOutletContext } from '../layouts/DashboardLayout';

const stages = [
  { label: 'New leads', value: 128, width: '92%', color: 'stage-orange' },
  { label: 'Contacted', value: 86, width: '70%', color: 'stage-yellow' },
  { label: 'Qualified', value: 54, width: '48%', color: 'stage-green' },
  { label: 'Proposal', value: 31, width: '34%', color: 'stage-blue' },
  { label: 'Won', value: 18, width: '23%', color: 'stage-ink' },
];

const AVATAR_COLORS = ['coral', 'blue', 'green', 'yellow', 'purple'];

export default function DashboardPage() {
  const { search } = useOutletContext<DashboardOutletContext>();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: leads, isLoading, error, create, update, remove } = useLeads({ search });

  // Add / Edit / View / Delete states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Lead | null>(null);
  const [viewTarget, setViewTarget] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleCreate(values: CreateLeadInput) {
    try {
      await create(values);
      toast.success(`${values.name} was added to your leads`);
      setIsCreateOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleUpdate(values: CreateLeadInput) {
    if (!editTarget) return;
    try {
      await update({ ...values, id: editTarget.id });
      toast.success('Lead updated');
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

  const today = new Intl.DateTimeFormat('en', {
    weekday: 'short', month: 'short', day: 'numeric',
  }).format(new Date());

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="dashboard-content">
      <div className="page-heading-row">
        <div>
          <p className="eyebrow">{today} <span className="heading-eyebrow-dot">/</span> Your workspace</p>
          <h1>Good morning, Alex <span className="wave">✳</span></h1>
          <p className="page-subtitle">Here’s the pulse of your business today.</p>
        </div>
        <div className="heading-actions">
          <button className="secondary-button" type="button">
            <CalendarDays size={16} /> Last 30 days <ChevronDown size={14} />
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus size={17} /> Add lead
          </button>
        </div>
      </div>

      <section className="stat-grid" aria-label="Business overview">
        <article className="stat-card">
          <div className="stat-card-top">
            <span className="stat-icon stat-icon-orange"><UsersRound size={18} /></span>
            <button className="more-button" aria-label="More" type="button"><MoreHorizontal size={19} /></button>
          </div>
          <p className="stat-label">Total leads</p>
          <div className="stat-value-row">
            <strong>{leads.length || '1,284'}</strong>
            <span className="trend trend-up"><ArrowUpRight size={14} /> 12.8%</span>
          </div>
          <p className="stat-footnote">vs. previous 30 days</p>
        </article>
        <article className="stat-card">
          <div className="stat-card-top">
            <span className="stat-icon stat-icon-green"><Target size={18} /></span>
            <button className="more-button" aria-label="More" type="button"><MoreHorizontal size={19} /></button>
          </div>
          <p className="stat-label">Open opportunities</p>
          <div className="stat-value-row">
            <strong>৳ 8.42M</strong>
            <span className="trend trend-up"><ArrowUpRight size={14} /> 8.2%</span>
          </div>
          <p className="stat-footnote">across 46 active deals</p>
        </article>
        <article className="stat-card">
          <div className="stat-card-top">
            <span className="stat-icon stat-icon-blue"><CircleDollarSign size={18} /></span>
            <button className="more-button" aria-label="More" type="button"><MoreHorizontal size={19} /></button>
          </div>
          <p className="stat-label">Revenue this month</p>
          <div className="stat-value-row">
            <strong>৳ 2.16M</strong>
            <span className="trend trend-up"><ArrowUpRight size={14} /> 18.4%</span>
          </div>
          <p className="stat-footnote">৳ 340K above your target</p>
        </article>
        <article className="stat-card">
          <div className="stat-card-top">
            <span className="stat-icon stat-icon-lilac"><Activity size={18} /></span>
            <button className="more-button" aria-label="More" type="button"><MoreHorizontal size={19} /></button>
          </div>
          <p className="stat-label">Conversion rate</p>
          <div className="stat-value-row">
            <strong>24.6%</strong>
            <span className="trend trend-down"><ArrowDownRight size={14} /> 2.1%</span>
          </div>
          <p className="stat-footnote">lead to customer conversion</p>
        </article>
      </section>

      <section className="dashboard-middle-grid">
        <article className="panel pipeline-panel">
          <div className="panel-heading">
            <div><h2>Pipeline overview</h2><p>Deals moving through your sales stages</p></div>
            <button className="subtle-select" type="button">This quarter <ChevronDown size={14} /></button>
          </div>
          <div className="pipeline-summary">
            <strong>৳ 8,420,000</strong>
            <span className="trend trend-up"><ArrowUpRight size={14} /> 14.6%</span>
            <span className="summary-caption">weighted pipeline value</span>
          </div>
          <div className="pipeline-chart" aria-label="Deal counts by pipeline stage">
            {stages.map((stage) => (
              <div className="pipeline-row" key={stage.label}>
                <span className="pipeline-stage-label">{stage.label}</span>
                <div className="pipeline-track">
                  <div className={`pipeline-fill ${stage.color}`} style={{ width: stage.width }} />
                </div>
                <strong>{stage.value}</strong>
              </div>
            ))}
          </div>
          <div className="pipeline-footer">
            <span><i className="legend-dot legend-orange" /> 317 total deals</span>
            <button type="button" onClick={() => navigate('/deals')}>
              View pipeline <ArrowRight size={14} />
            </button>
          </div>
        </article>

        <article className="panel activity-panel">
          <div className="panel-heading">
            <div><h2>Today’s focus</h2><p>A few things worth your attention</p></div>
            <button className="icon-button panel-more" type="button" aria-label="More">
              <MoreHorizontal size={19} />
            </button>
          </div>
          <div className="focus-list">
            <div className="focus-item">
              <span className="focus-icon focus-icon-peach"><CalendarDays size={16} /></span>
              <div><strong>4 follow-ups due</strong><p>Start with your priority leads</p></div>
              <span className="focus-count">4</span>
            </div>
            <div className="focus-item">
              <span className="focus-icon focus-icon-mint"><Check size={16} /></span>
              <div><strong>2 deals need attention</strong><p>No activity in the last 7 days</p></div>
              <span className="focus-count">2</span>
            </div>
            <div className="focus-item">
              <span className="focus-icon focus-icon-sky"><Sparkles size={16} /></span>
              <div><strong>AI found 3 insights</strong><p>New signals in your pipeline</p></div>
              <ArrowRight className="focus-arrow" size={16} />
            </div>
          </div>
        </article>
      </section>

      <section className="panel leads-panel">
        <div className="panel-heading leads-panel-heading">
          <div><h2>Recently added leads</h2><p>Keep the conversation moving</p></div>
          <div className="leads-panel-actions">
            <span className="lead-total">{leads.length} leads</span>
            <button className="text-button" type="button" onClick={() => navigate('/leads')}>
              View all <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <div className="leads-table-wrap">
          <table className="leads-table">
            <thead>
              <tr>
                <th>LEAD NAME</th>
                <th>COMPANY</th>
                <th>STATUS</th>
                <th>SCORE</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td className="empty-search" colSpan={5}>Loading leads...</td></tr>
              )}
              {!isLoading && error && (
                <tr><td className="empty-search" colSpan={5}>{error}</td></tr>
              )}
              {!isLoading && !error && recentLeads.length === 0 && (
                <tr><td className="empty-search" colSpan={5}>No leads yet — add your first one.</td></tr>
              )}
              {!isLoading && !error && recentLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setViewTarget(lead)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div className="lead-person">
                      <span className={`lead-avatar avatar-${AVATAR_COLORS[lead.name.length % AVATAR_COLORS.length]}`}>
                        {lead.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                      <strong>{lead.name}</strong>
                    </div>
                  </td>
                  <td><span className="company-name">{lead.company}</span></td>
                  <td>
                    <span className={`status-pill status-${lead.status}`}>
                      <i />{LEAD_STATUS_LABELS[lead.status]}
                    </span>
                  </td>
                  <td><LeadScoreBadge score={lead.score} /></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <RowMenu
                      ariaLabel={`Actions for ${lead.name}`}
                      items={[
                        {
                          label: 'View details',
                          icon: <Eye size={13} />,
                          onClick: () => setViewTarget(lead),
                        },
                        {
                          label: 'Edit',
                          icon: <Pencil size={13} />,
                          onClick: () => setEditTarget(lead),
                        },
                        {
                          label: 'Delete',
                          icon: <Trash2 size={13} />,
                          onClick: () => setDeleteTarget(lead),
                          danger: true,
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>
            Showing <strong>{recentLeads.length}</strong> of <strong>{leads.length}</strong> leads
          </span>
          <button type="button" onClick={() => navigate('/leads')}>
            Go to leads <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* CREATE modal */}
      <Modal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add a lead"
        subtitle="Add someone new to your pipeline."
      >
        <LeadForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* VIEW modal */}
      <Modal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Lead details"
      >
        {viewTarget && (
          <LeadDetails
            lead={viewTarget}
            onClose={() => setViewTarget(null)}
            onEdit={() => {
              setEditTarget(viewTarget);
              setViewTarget(null);
            }}
          />
        )}
      </Modal>

      {/* EDIT modal */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit lead"
        subtitle={editTarget?.name}
      >
        {editTarget && (
          <LeadForm
            initial={editTarget}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      {/* DELETE confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete ${deleteTarget?.name ?? 'lead'}?`}
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