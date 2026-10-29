export type CompanyStatus = 'prospect' | 'customer' | 'active' | 'churned';
export type CompanySize = '1-10' | '11-50' | '51-200' | '201-1000' | '1000+';
export type CompanyIndustry =
  | 'technology'
  | 'finance'
  | 'healthcare'
  | 'retail'
  | 'manufacturing'
  | 'education'
  | 'other';

export interface Company {
  id: string;
  name: string;
  domain?: string;
  industry: CompanyIndustry;
  size: CompanySize;
  location?: string;
  phone?: string;
  description?: string;
  status: CompanyStatus;
  owner: string;
  contactCount: number;
  dealCount: number;
  annualRevenue?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyInput {
  name: string;
  domain?: string;
  industry?: CompanyIndustry;
  size?: CompanySize;
  location?: string;
  phone?: string;
  description?: string;
  status?: CompanyStatus;
  annualRevenue?: number;
}

export interface UpdateCompanyInput extends Partial<CreateCompanyInput> {
  id: string;
}

export interface CompanyFilters {
  search?: string;
  status?: CompanyStatus | 'all';
  industry?: CompanyIndustry | 'all';
  size?: CompanySize | 'all';
}

export const COMPANY_STATUS_LABELS: Record<CompanyStatus, string> = {
  prospect: 'Prospect',
  customer: 'Customer',
  active: 'Active',
  churned: 'Churned',
};

export const COMPANY_SIZE_LABELS: Record<CompanySize, string> = {
  '1-10': '1-10 employees',
  '11-50': '11-50 employees',
  '51-200': '51-200 employees',
  '201-1000': '201-1,000 employees',
  '1000+': '1,000+ employees',
};

export const COMPANY_INDUSTRY_LABELS: Record<CompanyIndustry, string> = {
  technology: 'Technology',
  finance: 'Finance',
  healthcare: 'Healthcare',
  retail: 'Retail',
  manufacturing: 'Manufacturing',
  education: 'Education',
  other: 'Other',
};