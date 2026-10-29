export type InvoiceStatus = 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'void';
export type PaymentMethod = 'bank-transfer' | 'credit-card' | 'cash' | 'check' | 'other';
export type PaymentStatus = 'completed' | 'refunded';

export interface Invoice {
  id: string;
  number: string;
  customer: string;
  dealName?: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  paidAmount: number;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customer: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  reference?: string;
  status: PaymentStatus;
  paidAt: string;
  notes?: string;
}

export interface CreateInvoiceInput {
  customer: string;
  dealName?: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax?: number;
  notes?: string;
}

export interface UpdateInvoiceInput extends Partial<CreateInvoiceInput> {
  id: string;
}

export interface CreatePaymentInput {
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  paidAt?: string;
  notes?: string;
}

export interface InvoiceFilters {
  search?: string;
  status?: InvoiceStatus | 'all';
}

export interface PaymentFilters {
  search?: string;
  method?: PaymentMethod | 'all';
  status?: PaymentStatus | 'all';
}

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  partial: 'Partial',
  paid: 'Paid',
  overdue: 'Overdue',
  void: 'Void',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  'bank-transfer': 'Bank transfer',
  'credit-card': 'Credit card',
  cash: 'Cash',
  check: 'Check',
  other: 'Other',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  completed: 'Completed',
  refunded: 'Refunded',
};

export const INVOICE_STATUS_TONE: Record<InvoiceStatus, { fg: string; bg: string }> = {
  draft: { fg: '#6d7770', bg: '#f3f3f0' },
  sent: { fg: '#547c9c', bg: '#edf4f9' },
  partial: { fg: '#aa7531', bg: '#fbf3e2' },
  paid: { fg: '#397a55', bg: '#edf5ed' },
  overdue: { fg: '#bd6948', bg: '#fff1e9' },
  void: { fg: '#8a6b5d', bg: '#f5f0ed' },
};

export function getOutstanding(invoice: Invoice): number {
  return Math.max(0, invoice.total - invoice.paidAmount);
}

export function isInvoiceOverdue(invoice: Invoice): boolean {
  if (invoice.status === 'paid' || invoice.status === 'void') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(invoice.dueDate) < today;
}