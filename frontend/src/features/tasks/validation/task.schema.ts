import type { CreateTaskInput } from '../types/task.types';

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateTask(input: CreateTaskInput): ValidationErrors<CreateTaskInput> {
  const errors: ValidationErrors<CreateTaskInput> = {};

  if (!input.title?.trim()) {
    errors.title = 'Title is required';
  } else if (input.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (input.dueDate) {
    const due = new Date(input.dueDate);
    if (isNaN(due.getTime())) {
      errors.dueDate = 'Enter a valid date';
    }
  }

  return errors;
}

export function hasErrors<T>(errors: ValidationErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}