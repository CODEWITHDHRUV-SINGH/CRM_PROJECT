import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: 30,
      textAlign: 'center',
      background: '#f6f5f1',
    }}>
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 style={{
          margin: '6px 0 10px',
          fontFamily: "'Fraunces', Georgia, serif",
          fontWeight: 500,
          fontSize: 48,
          color: '#2b3831',
        }}>
          Page not found
        </h1>
        <p style={{ color: '#89928b', fontSize: 13, marginBottom: 20 }}>
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link to="/" className="primary-button" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
      </div>
    </div>
  );
}