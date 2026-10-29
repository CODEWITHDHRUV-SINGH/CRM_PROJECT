import type { CreateInvoiceInput, CreatePaymentInput } from '../types/invoice.types';

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateInvoice(input: CreateInvoiceInput): ValidationErrors<CreateInvoiceInput> {
  const errors: ValidationErrors<CreateInvoiceInput> = {};

  if (!input.customer?.trim()) {
    errors.customer = 'Customer is required';
  }

  if (!input.issueDate) {
    errors.issueDate = 'Issue date is required';
  }

  if (!input.dueDate) {
    errors.dueDate = 'Due date is required';
  } else if (input.issueDate && new Date(input.dueDate) < new Date(input.issueDate)) {
    errors.dueDate = 'Due date cannot be before issue date';
  }

  if (input.subtotal === undefined || input.subtotal <= 0) {
    errors.subtotal = 'Subtotal must be greater than 0';
  }

  if (input.tax !== undefined && input.tax < 0) {
    errors.tax = 'Tax cannot be negative';
  }

  return errors;
}

export function validatePayment(input: CreatePaymentInput, outstanding: number): ValidationErrors<CreatePaymentInput> {
  const errors: ValidationErrors<CreatePaymentInput> = {};

  if (input.amount === undefined || input.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  } else if (input.amount > outstanding) {
    errors.amount = `Amount cannot exceed outstanding ($${outstanding.toFixed(2)})`;
  }

  if (!input.method) {
    errors.method = 'Payment method is required';
  }

  return errors;
}

export function hasErrors<T>(errors: ValidationErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}