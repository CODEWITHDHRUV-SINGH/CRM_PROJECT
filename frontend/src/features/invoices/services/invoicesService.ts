import type {
  CreateInvoiceInput,
  CreatePaymentInput,
  Invoice,
  InvoiceFilters,
  Payment,
  PaymentFilters,
  UpdateInvoiceInput,
} from '../types/invoice.types';

const now = new Date().toISOString();
const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const seedInvoices: Invoice[] = [
  { id: 'INV-001', number: 'INV-2026-001', customer: 'Layers', dealName: 'Layers — Enterprise Plan', issueDate: '2026-10-01', dueDate: '2026-10-31', currency: 'USD', subtotal: 48000, tax: 0, total: 48000, paidAmount: 48000, status: 'paid', notes: 'Annual enterprise contract.', createdAt: '2026-10-01T10:00:00Z', updatedAt: now },
  { id: 'INV-002', number: 'INV-2026-002', customer: 'Quotient', dealName: 'Quotient — Platform Expansion', issueDate: '2026-10-15', dueDate: '2026-11-14', currency: 'USD', subtotal: 125000, tax: 0, total: 125000, paidAmount: 50000, status: 'partial', notes: 'Two-installment plan.', createdAt: '2026-10-15T11:30:00Z', updatedAt: now },
  { id: 'INV-003', number: 'INV-2026-003', customer: 'Circooles', dealName: 'Circooles — Starter Plan', issueDate: '2026-09-20', dueDate: '2026-10-20', currency: 'USD', subtotal: 12000, tax: 0, total: 12000, paidAmount: 0, status: 'overdue', createdAt: '2026-09-20T09:15:00Z', updatedAt: now },
  { id: 'INV-004', number: 'INV-2026-004', customer: 'Catalog', dealName: 'Catalog — Annual Renewal', issueDate: '2026-10-05', dueDate: '2026-11-05', currency: 'USD', subtotal: 36000, tax: 3600, total: 39600, paidAmount: 0, status: 'sent', createdAt: '2026-10-05T14:00:00Z', updatedAt: now },
  { id: 'INV-005', number: 'INV-2026-005', customer: 'Bright', dealName: 'Bright — Enterprise Seats', issueDate: '2026-10-20', dueDate: '2026-11-20', currency: 'USD', subtotal: 96000, tax: 0, total: 96000, paidAmount: 96000, status: 'paid', createdAt: '2026-10-20T10:00:00Z', updatedAt: now },
  { id: 'INV-006', number: 'INV-2026-006', customer: 'Pixelly', dealName: 'Pixelly — Mobile App Phase 2', issueDate: '2026-10-25', dueDate: '2026-11-25', currency: 'USD', subtotal: 24000, tax: 2400, total: 26400, paidAmount: 0, status: 'sent', createdAt: '2026-10-25T12:00:00Z', updatedAt: now },
  { id: 'INV-007', number: 'INV-2026-007', customer: 'Global', dealName: 'Global — Data Migration', issueDate: '2026-09-01', dueDate: '2026-10-01', currency: 'USD', subtotal: 85000, tax: 0, total: 85000, paidAmount: 0, status: 'void', notes: 'Cancelled — went with competitor.', createdAt: '2026-09-01T08:30:00Z', updatedAt: now },
  { id: 'INV-008', number: 'INV-2026-008', customer: 'Apex', dealName: 'Apex — Compliance Module', issueDate: '2026-10-28', dueDate: '2026-12-15', currency: 'USD', subtotal: 62000, tax: 0, total: 62000, paidAmount: 0, status: 'draft', createdAt: '2026-10-28T15:45:00Z', updatedAt: now },
];

const seedPayments: Payment[] = [
  { id: 'PAY-001', invoiceId: 'INV-001', invoiceNumber: 'INV-2026-001', customer: 'Layers', amount: 48000, currency: 'USD', method: 'bank-transfer', reference: 'WIRE-884921', status: 'completed', paidAt: '2026-10-15T10:00:00Z' },
  { id: 'PAY-002', invoiceId: 'INV-002', invoiceNumber: 'INV-2026-002', customer: 'Quotient', amount: 50000, currency: 'USD', method: 'bank-transfer', reference: 'WIRE-885103', status: 'completed', paidAt: '2026-10-20T11:30:00Z', notes: 'First installment.' },
  { id: 'PAY-003', invoiceId: 'INV-005', invoiceNumber: 'INV-2026-005', customer: 'Bright', amount: 96000, currency: 'USD', method: 'credit-card', reference: 'CC-7731', status: 'completed', paidAt: '2026-10-22T09:15:00Z' },
  { id: 'PAY-004', invoiceId: 'INV-003', invoiceNumber: 'INV-2026-003', customer: 'Circooles', amount: 12000, currency: 'USD', method: 'credit-card', reference: 'CC-7720', status: 'refunded', paidAt: '2026-10-10T14:00:00Z', notes: 'Refunded due to cancellation.' },
];

let invoicesDb: Invoice[] = [...seedInvoices];
let paymentsDb: Payment[] = [...seedPayments];
let nextInvoiceId = 9;
let nextPaymentId = 5;
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

function recalcStatus(invoice: Invoice): Invoice {
  const outstanding = invoice.total - invoice.paidAmount;
  if (invoice.status === 'void' || invoice.status === 'draft') return invoice;

  if (invoice.paidAmount >= invoice.total) {
    return { ...invoice, status: 'paid' };
  }
  if (invoice.paidAmount > 0) {
    return { ...invoice, status: 'partial' };
  }
  // 0 paid
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(invoice.dueDate) < today) {
    return { ...invoice, status: 'overdue' };
  }
  return { ...invoice, status: 'sent' };
}

export const invoicesService = {
  // ---------- INVOICES ----------
  async listInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
    await delay();
    let results = [...invoicesDb];

    if (filters?.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      results = results.filter((i) =>
        `${i.number} ${i.customer} ${i.dealName ?? ''}`.toLowerCase().includes(q),
      );
    }
    if (filters?.status && filters.status !== 'all') {
      results = results.filter((i) => i.status === filters.status);
    }

    // Recalculate status based on actual payments
    results = results.map(recalcStatus);

    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getInvoice(id: string): Promise<Invoice> {
    await delay(150);
    const inv = invoicesDb.find((i) => i.id === id);
    if (!inv) throw new Error('Invoice not found');
    return recalcStatus(inv);
  },

  async createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
    await delay(300);
    const now = new Date().toISOString();
    const tax = input.tax ?? 0;
    const total = input.subtotal + tax;
    const newInvoice: Invoice = {
      id: `INV-${String(nextInvoiceId).padStart(3, '0')}`,
      number: `INV-2026-${String(nextInvoiceId).padStart(3, '0')}`,
      customer: input.customer.trim(),
      dealName: input.dealName?.trim() || undefined,
      issueDate: input.issueDate,
      dueDate: input.dueDate,
      currency: 'USD',
      subtotal: input.subtotal,
      tax,
      total,
      paidAmount: 0,
      status: 'draft',
      notes: input.notes?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };
    nextInvoiceId += 1;
    invoicesDb = [newInvoice, ...invoicesDb];
    return newInvoice;
  },

  async updateInvoice(input: UpdateInvoiceInput): Promise<Invoice> {
    await delay(250);
    const index = invoicesDb.findIndex((i) => i.id === input.id);
    if (index === -1) throw new Error('Invoice not found');
    const existing = invoicesDb[index];
    const subtotal = input.subtotal ?? existing.subtotal;
    const tax = input.tax ?? existing.tax;
    const updated: Invoice = recalcStatus({
      ...existing,
      ...input,
      subtotal,
      tax,
      total: subtotal + tax,
      updatedAt: new Date().toISOString(),
    });
    invoicesDb = [...invoicesDb.slice(0, index), updated, ...invoicesDb.slice(index + 1)];
    return updated;
  },

  async voidInvoice(id: string): Promise<Invoice> {
    await delay(200);
    const index = invoicesDb.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Invoice not found');
    const updated: Invoice = { ...invoicesDb[index], status: 'void', updatedAt: new Date().toISOString() };
    invoicesDb = [...invoicesDb.slice(0, index), updated, ...invoicesDb.slice(index + 1)];
    return updated;
  },

  // ---------- PAYMENTS ----------
  async listPayments(filters?: PaymentFilters): Promise<Payment[]> {
    await delay();
    let results = [...paymentsDb];
    if (filters?.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      results = results.filter((p) =>
        `${p.invoiceNumber} ${p.customer} ${p.reference ?? ''}`.toLowerCase().includes(q),
      );
    }
    if (filters?.method && filters.method !== 'all') {
      results = results.filter((p) => p.method === filters.method);
    }
    if (filters?.status && filters.status !== 'all') {
      results = results.filter((p) => p.status === filters.status);
    }
    return results.sort((a, b) => b.paidAt.localeCompare(a.paidAt));
  },

  async listPaymentsForInvoice(invoiceId: string): Promise<Payment[]> {
    await delay(150);
    return paymentsDb
      .filter((p) => p.invoiceId === invoiceId)
      .sort((a, b) => b.paidAt.localeCompare(a.paidAt));
  },

  async addPayment(input: CreatePaymentInput): Promise<{ payment: Payment; invoice: Invoice }> {
    await delay(300);
    const invIndex = invoicesDb.findIndex((i) => i.id === input.invoiceId);
    if (invIndex === -1) throw new Error('Invoice not found');
    const invoice = invoicesDb[invIndex];

    const outstanding = invoice.total - invoice.paidAmount;
    if (input.amount > outstanding) {
      throw new Error(`Amount exceeds outstanding ($${outstanding.toFixed(2)})`);
    }

    const payment: Payment = {
      id: `PAY-${String(nextPaymentId).padStart(3, '0')}`,
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      customer: invoice.customer,
      amount: input.amount,
      currency: invoice.currency,
      method: input.method,
      reference: input.reference?.trim() || undefined,
      status: 'completed',
      paidAt: input.paidAt ?? new Date().toISOString(),
      notes: input.notes?.trim() || undefined,
    };
    nextPaymentId += 1;
    paymentsDb = [payment, ...paymentsDb];

    const updatedInvoice = recalcStatus({
      ...invoice,
      paidAmount: invoice.paidAmount + input.amount,
      updatedAt: new Date().toISOString(),
    });
    invoicesDb = [...invoicesDb.slice(0, invIndex), updatedInvoice, ...invoicesDb.slice(invIndex + 1)];

    return { payment, invoice: updatedInvoice };
  },

  async refundPayment(id: string): Promise<{ payment: Payment; invoice: Invoice }> {
    await delay(250);
    const payIndex = paymentsDb.findIndex((p) => p.id === id);
    if (payIndex === -1) throw new Error('Payment not found');
    const payment = paymentsDb[payIndex];
    if (payment.status === 'refunded') {
      throw new Error('Payment already refunded');
    }

    const updatedPayment: Payment = { ...payment, status: 'refunded' };
    paymentsDb = [...paymentsDb.slice(0, payIndex), updatedPayment, ...paymentsDb.slice(payIndex + 1)];

    const invIndex = invoicesDb.findIndex((i) => i.id === payment.invoiceId);
    let updatedInvoice: Invoice | null = null;
    if (invIndex !== -1) {
      const invoice = invoicesDb[invIndex];
      updatedInvoice = recalcStatus({
        ...invoice,
        paidAmount: Math.max(0, invoice.paidAmount - payment.amount),
        updatedAt: new Date().toISOString(),
      });
      invoicesDb = [...invoicesDb.slice(0, invIndex), updatedInvoice, ...invoicesDb.slice(invIndex + 1)];
    }

    return { payment: updatedPayment, invoice: updatedInvoice ?? invoicesDb[invIndex] };
  },
};