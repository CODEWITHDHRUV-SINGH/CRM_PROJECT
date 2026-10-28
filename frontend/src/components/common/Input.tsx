import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  requiredMark?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, requiredMark, id, className = '', ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  const hintId = hint && inputId ? `${inputId}-hint` : undefined;

  return (
    <div className="input-field">
      {label && (
        <label className="field-label" htmlFor={inputId}>
          {label}
          {requiredMark && <span style={{ color: '#dc2626', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`text-input ${error ? 'input-invalid' : ''} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
        {...rest}
      />
      {hint && !error && <span id={hintId} className="input-hint">{hint}</span>}
      {error && <span id={errorId} className="input-error-text">{error}</span>}
    </div>
  );
});