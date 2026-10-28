import { useEffect, useRef, useState } from 'react';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = user?.name?.split(' ').map((p) => p[0]).join('').slice(0, 2) ?? 'AM';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="topbar-avatar"
        type="button"
        aria-label="Open user menu"
        onClick={() => setOpen((v) => !v)}
      >
        {initials}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: 200,
            padding: 6,
            border: '1px solid #e9e9e3',
            borderRadius: 8,
            background: '#fff',
            boxShadow: '0 12px 32px rgba(30, 40, 33, .1)',
            zIndex: 30,
          }}
        >
          <div style={{ padding: '8px 10px', borderBottom: '1px solid #f0f0ec' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2b3831' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: 10, color: '#89928b' }}>{user?.email}</div>
          </div>
          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 10px',
              fontSize: 11,
              color: '#5a655e',
              textDecoration: 'none',
              borderRadius: 5,
            }}
          >
            <UserIcon size={14} /> Profile
          </Link>
          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 10px',
              fontSize: 11,
              color: '#5a655e',
              textDecoration: 'none',
              borderRadius: 5,
            }}
          >
            <Settings size={14} /> Settings
          </Link>
          <button
            type="button"
            onClick={() => { setOpen(false); logout(); }}
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              gap: 8,
              padding: '8px 10px',
              fontSize: 11,
              color: '#bd6948',
              background: 'transparent',
              border: 0,
              borderRadius: 5,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}