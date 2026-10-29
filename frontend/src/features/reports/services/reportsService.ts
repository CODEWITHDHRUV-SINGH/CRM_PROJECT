import type {
  CollectionsReport,
  PipelineReport,
  ReportRange,
  SalesReport,
} from '../types/report.types';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const SOURCE_COLORS = ['#176451', '#e87648', '#719bb5', '#e6b953', '#806ca3', '#73a985'];

/**
 * MOCK REPORTS SERVICE — Phase 14 me real /reports/* endpoints se replace hoga.
 */

export const reportsService = {
  async getSalesReport(range: ReportRange): Promise<SalesReport> {
    await delay();
    const rangeScale = { '7d': 0.25, '30d': 1, '90d': 3, '12m': 12 }[range];

    return {
      kpis: [
        { label: 'Total revenue', value: `$${(216000 * rangeScale).toLocaleString()}`, delta: 18.4, footnote: 'vs. previous period' },
        { label: 'Deals closed', value: String(Math.round(12 * rangeScale)), delta: 8.2, footnote: 'in selected range' },
        { label: 'Average deal size', value: `$${Math.round(18000).toLocaleString()}`, delta: 3.1 },
        { label: 'Win rate', value: '32.5%', delta: 2.4, footnote: 'won / (won + lost)' },
      ],
      revenueByMonth: [
        { label: 'Nov', value: 128000 },
        { label: 'Dec', value: 156000 },
        { label: 'Jan', value: 143000 },
        { label: 'Feb', value: 168000 },
        { label: 'Mar', value: 182000 },
        { label: 'Apr', value: 175000 },
        { label: 'May', value: 198000 },
        { label: 'Jun', value: 210000 },
        { label: 'Jul', value: 195000 },
        { label: 'Aug', value: 224000 },
        { label: 'Sep', value: 238000 },
        { label: 'Oct', value: 216000 },
      ],
      dealsClosedByMonth: [
        { label: 'Nov', value: 8 }, { label: 'Dec', value: 11 },
        { label: 'Jan', value: 9 }, { label: 'Feb', value: 12 },
        { label: 'Mar', value: 14 }, { label: 'Apr', value: 13 },
        { label: 'May', value: 15 }, { label: 'Jun', value: 17 },
        { label: 'Jul', value: 14 }, { label: 'Aug', value: 18 },
        { label: 'Sep', value: 19 }, { label: 'Oct', value: 12 },
      ],
      sources: [
        { label: 'Inbound', value: 42, color: SOURCE_COLORS[0] },
        { label: 'Referral', value: 28, color: SOURCE_COLORS[1] },
        { label: 'Outbound', value: 18, color: SOURCE_COLORS[2] },
        { label: 'Event', value: 12, color: SOURCE_COLORS[3] },
      ],
      topDeals: [
        { name: 'Quotient — Platform Expansion', company: 'Quotient', value: 125000, stage: 'Proposal' },
        { name: 'Bright — Enterprise Seats', company: 'Bright', value: 96000, stage: 'Won' },
        { name: 'Apex — Compliance Module', company: 'Apex', value: 62000, stage: 'Proposal' },
        { name: 'Layers — Enterprise Plan', company: 'Layers', value: 48000, stage: 'Qualified' },
        { name: 'Catalog — Annual Renewal', company: 'Catalog', value: 36000, stage: 'Won' },
      ],
    };
  },

  async getPipelineReport(_range: ReportRange): Promise<PipelineReport> {
    await delay();
    return {
      kpis: [
        { label: 'Active pipeline', value: '$642,000', delta: 12.6 },
        { label: 'Weighted forecast', value: '$384,200', delta: 9.3, footnote: 'probability-adjusted' },
        { label: 'Avg. deal age', value: '27 days', delta: -3.1, footnote: 'negative is good' },
        { label: 'Deals in progress', value: '8', delta: 0 },
      ],
      funnel: [
        { label: 'New', count: 42, conversion: 100 },
        { label: 'Contacted', count: 28, conversion: 66.7 },
        { label: 'Qualified', count: 18, conversion: 64.3 },
        { label: 'Proposal', count: 9, conversion: 50 },
        { label: 'Won', count: 4, conversion: 44.4 },
      ],
      byStage: [
        { label: 'New', count: 2, value: 23000, color: '#e87648' },
        { label: 'Contacted', count: 2, value: 26000, color: '#e6b953' },
        { label: 'Qualified', count: 2, value: 72000, color: '#73a985' },
        { label: 'Proposal', count: 2, value: 187000, color: '#719bb5' },
        { label: 'Won', count: 2, value: 132000, color: '#176451' },
        { label: 'Lost', count: 1, value: 85000, color: '#bd6948' },
      ],
      forecast: [
        { label: 'This month', value: 84000, color: '#176451' },
        { label: 'Next month', value: 128000, color: '#73a985' },
        { label: 'Quarter 4', value: 342000, color: '#719bb5' },
      ],
    };
  },

  async getCollectionsReport(_range: ReportRange): Promise<CollectionsReport> {
    await delay();
    return {
      kpis: [
        { label: 'Total invoiced', value: '$508,000', delta: 14.2 },
        { label: 'Collected', value: '$200,000', delta: 22.6 },
        { label: 'Outstanding', value: '$308,000', delta: -8.4, footnote: 'pending collection' },
        { label: 'Avg. collection days', value: '31.4', delta: -2.1 },
      ],
      aging: [
        { label: '0–30 days', amount: 145000, count: 3, color: '#73a985' },
        { label: '31–60 days', amount: 126000, count: 2, color: '#e6b953' },
        { label: '61–90 days', amount: 25000, count: 1, color: '#e87648' },
        { label: '90+ days', amount: 12000, count: 1, color: '#bd6948' },
      ],
      topCustomers: [
        { customer: 'Quotient', total: 125000, paid: 50000, outstanding: 75000, daysOverdue: 15 },
        { customer: 'Apex', total: 62000, paid: 0, outstanding: 62000, daysOverdue: -47 },
        { customer: 'Catalog', total: 39600, paid: 0, outstanding: 39600, daysOverdue: -7 },
        { customer: 'Pixelly', total: 26400, paid: 0, outstanding: 26400, daysOverdue: -27 },
        { customer: 'Circooles', total: 12000, paid: 0, outstanding: 12000, daysOverdue: 9 },
      ],
      collectedByMonth: [
        { label: 'Nov', value: 98000 }, { label: 'Dec', value: 112000 },
        { label: 'Jan', value: 95000 }, { label: 'Feb', value: 128000 },
        { label: 'Mar', value: 141000 }, { label: 'Apr', value: 138000 },
        { label: 'May', value: 162000 }, { label: 'Jun', value: 175000 },
        { label: 'Jul', value: 158000 }, { label: 'Aug', value: 189000 },
        { label: 'Sep', value: 202000 }, { label: 'Oct', value: 200000 },
      ],
    };
  },
};