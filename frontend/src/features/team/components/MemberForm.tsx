import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { validateMember, hasErrors, type ValidationErrors } from '../validation/team.schema';
import {
  ROLE_LABELS,
  type CreateMemberInput,
  type TeamMember,
  type TeamRole,
} from '../types/team.types';

interface MemberFormProps {
  initial?: TeamMember;
  onSubmit: (values: CreateMemberInput) => Promise<void>;
  onCancel: () => void;
}

export function MemberForm({ initial, onSubmit, onCancel }: MemberFormProps) {
  const [values, setValues] = useState<CreateMemberInput>({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    role: initial?.role ?? 'member',
    department: initial?.department ?? '',
    phone: initial?.phone ?? '',
  });
  const [errors, setErrors] = useState<ValidationErrors<CreateMemberInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof CreateMemberInput>(key: K, value: CreateMemberInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateMember(values);
    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isOwner = initial?.role === 'owner';
  const isEditing = !!initial;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Input
        label="Full name"
        requiredMark
        value={values.name}
        onChange={(e) => update('name', e.target.value)}
        error={errors.name}
        placeholder="e.g. Sam Taylor"
      />
      <Input
        label="Work email"
        requiredMark
        type="email"
        value={values.email}
        onChange={(e) => update('email', e.target.value)}
        error={errors.email}
        placeholder="sam@company.com"
        disabled={isEditing}
        hint={isEditing ? 'Email cannot be changed after invite' : undefined}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input
          label="Department"
          value={values.department ?? ''}
          onChange={(e) => update('department', e.target.value)}
          placeholder="e.g. Sales"
        />
        <Input
          label="Phone"
          value={values.phone ?? ''}
          onChange={(e) => update('phone', e.target.value)}
          error={errors.phone}
          placeholder="+1-..."
        />
      </div>

      <div className="input-field">
        <label className="field-label" htmlFor="member-role">
          Role
          {isOwner && <span style={{ color: '#8a6b2c', marginLeft: 6, fontSize: 9, fontWeight: 600 }}>(owner locked)</span>}
        </label>
        <select
          id="member-role"
          className="text-input"
          value={values.role}
          onChange={(e) => update('role', e.target.value as TeamRole)}
          disabled={isOwner}
        >
          {(Object.keys(ROLE_LABELS) as TeamRole[])
            .filter((r) => r !== 'owner')
            .map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
        </select>
        <span className="input-hint">
          {values.role === 'admin' && 'Can manage team, billing, and settings.'}
          {values.role === 'manager' && 'Can manage records and reports for their team.'}
          {values.role === 'member' && 'Can create and edit records they own.'}
          {values.role === 'viewer' && 'Read-only access to all records.'}
        </span>
      </div>

      <div className="modal-actions">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isSubmitting}>
          {isEditing ? 'Save changes' : 'Send invitation'}
        </Button>
      </div>
    </form>
  );
}