import type { ReactNode } from 'react';
import { AlertCircle, Inbox } from 'lucide-react';
import { Button } from '../common/Button';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorMessage({
  title = 'Something went wrong',
  message = 'We could not load this data. Please try again.',
  onRetry,
  retryLabel = 'Try again',
}: ErrorMessageProps) {
  return (
    <div className="empty-state error-state">
      <span className="empty-state-icon"><AlertCircle size={22} /></span>
      <h3>{title}</h3>
      <p>{message}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>{retryLabel}</Button>}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">{icon ?? <Inbox size={22} />}</span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}