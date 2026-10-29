export type ReportRange = '7d' | '30d' | '90d' | '12m';

export interface KPIData {
  label: string;
  value: string;
  delta?: number;      // percent change vs previous period
  footnote?: string;
}

export interface MonthlyPoint {
  label: string;
  value: number;
}

export interface SourceBreakdown {
  label: string;
  value: number;
  color: string;
}

export interface TopDeal {
  name: string;
  company: string;
  value: number;
  stage: string;
}

export interface SalesReport {
  kpis: KPIData[];
  revenueByMonth: MonthlyPoint[];
  dealsClosedByMonth: MonthlyPoint[];
  sources: SourceBreakdown[];
  topDeals: TopDeal[];
}

export interface FunnelStage {
  label: string;
  count: number;
  conversion: number; // % of previous stage
}

export interface PipelineStage {
  label: string;
  count: number;
  value: number;
  color: string;
}

export interface PipelineReport {
  kpis: KPIData[];
  funnel: FunnelStage[];
  byStage: PipelineStage[];
  forecast: { label: string; value: number; color: string }[];
}

export interface AgingBucket {
  label: string;
  amount: number;
  count: number;
  color: string;
}

export interface CustomerCollection {
  customer: string;
  total: number;
  paid: number;
  outstanding: number;
  daysOverdue: number;
}

export interface CollectionsReport {
  kpis: KPIData[];
  aging: AgingBucket[];
  topCustomers: CustomerCollection[];
  collectedByMonth: MonthlyPoint[];
}

export const RANGE_LABELS: Record<ReportRange, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  '12m': 'Last 12 months',
};