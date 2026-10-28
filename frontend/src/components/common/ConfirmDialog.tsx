import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span
          style={{
            display: 'grid',
            width: 38,
            height: 38,
            flex: '0 0 auto',
            placeItems: 'center',
            borderRadius: 10,
            background: variant === 'danger' ? '#fff1e9' : '#edf4ef',
            color: variant === 'danger' ? '#bd6948' : '#176451',
          }}
        >
          <AlertTriangle size={18} />
        </span>
        <div>
          <h3 style={{ margin: '4px 0 6px', fontSize: 14, color: '#2b3831' }}>{title}</h3>
          {description && (
            <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#89928b' }}>
              {description}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}