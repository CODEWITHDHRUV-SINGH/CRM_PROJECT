import type { CreateContactInput } from '../types/contact.types';

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateContact(input: CreateContactInput): ValidationErrors<CreateContactInput> {
  const errors: ValidationErrors<CreateContactInput> = {};

  if (!input.name?.trim()) {
    errors.name = 'Name is required';
  } else if (input.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!input.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!input.company?.trim()) {
    errors.company = 'Company is required';
  }

  if (input.phone && input.phone.trim() && !/^[+\d][\d\s\-()]{6,}$/.test(input.phone)) {
    errors.phone = 'Enter a valid phone number';
  }

  return errors;
}

export function hasErrors<T>(errors: ValidationErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}