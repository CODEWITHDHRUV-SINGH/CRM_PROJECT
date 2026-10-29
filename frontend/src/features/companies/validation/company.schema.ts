import type { CreateCompanyInput } from '../types/company.types';

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateCompany(input: CreateCompanyInput): ValidationErrors<CreateCompanyInput> {
  const errors: ValidationErrors<CreateCompanyInput> = {};

  if (!input.name?.trim()) {
    errors.name = 'Company name is required';
  } else if (input.name.trim().length < 2) {
    errors.name = 'Company name must be at least 2 characters';
  }

  if (input.domain && input.domain.trim()) {
    const domainPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/i;
    if (!domainPattern.test(input.domain.trim())) {
      errors.domain = 'Enter a valid website (e.g. example.com)';
    }
  }

  if (input.phone && input.phone.trim() && !/^[+\d][\d\s\-()]{6,}$/.test(input.phone)) {
    errors.phone = 'Enter a valid phone number';
  }

  if (input.annualRevenue !== undefined && input.annualRevenue < 0) {
    errors.annualRevenue = 'Revenue cannot be negative';
  }

  return errors;
}

export function hasErrors<T>(errors: ValidationErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}