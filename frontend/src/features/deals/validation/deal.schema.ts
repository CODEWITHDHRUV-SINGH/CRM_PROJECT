import type { CreateDealInput } from '../types/deal.types';

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateDeal(input: CreateDealInput): ValidationErrors<CreateDealInput> {
  const errors: ValidationErrors<CreateDealInput> = {};

  if (!input.name?.trim()) {
    errors.name = 'Deal name is required';
  } else if (input.name.trim().length < 2) {
    errors.name = 'Deal name must be at least 2 characters';
  }

  if (!input.companyName?.trim()) {
    errors.companyName = 'Company is required';
  }

  if (input.value === undefined || input.value === null) {
    errors.value = 'Deal value is required';
  } else if (input.value < 0) {
    errors.value = 'Value cannot be negative';
  }

  if (input.probability !== undefined && (input.probability < 0 || input.probability > 100)) {
    errors.probability = 'Probability must be between 0 and 100';
  }

  return errors;
}

export function hasErrors<T>(errors: ValidationErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}