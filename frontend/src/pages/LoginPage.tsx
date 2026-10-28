import { useRef, useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';
import { useAuth } from '../auth/useAuth';
import { getErrorMessage } from '../api/errorHandler';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ✅ If already logged in → redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const email = emailRef.current?.value.trim() ?? '';
    const password = passwordRef.current?.value ?? '';

    if (!email) {
      setError('Please enter your email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      // ✅ Navigate handled by <Navigate> above once isAuthenticated becomes true
    } catch (err) {
      setError(getErrorMessage(err));
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="login-heading">
        <p className="eyebrow">Welcome back</p>
        <h2>Log in</h2>
        <p>Enter your details to pick up where you left off.</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <label className="field-label" htmlFor="email">Work email</label>
        <input
          ref={emailRef}
          className="text-input"
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="username"
        />

        <div className="password-label-row">
          <label className="field-label" htmlFor="password">Password</label>
          <a href="mailto:support@universalcrm.example">Forgot password?</a>
        </div>
        <div className="password-input-wrap">
          <input
            ref={passwordRef}
            className="text-input"
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          <button
            className="password-toggle"
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <label className="remember-option">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span className="custom-checkbox" aria-hidden="true" />
          <span>Remember me</span>
        </label>

        {error && (
          <p style={{ color: '#dc2626', fontSize: 11, margin: '12px 0 0' }}>
            {error}
          </p>
        )}

        <button className="login-submit" type="submit" disabled={isSubmitting}>
          <span>{isSubmitting ? 'Signing in...' : 'Log in'}</span>
          {!isSubmitting && <ArrowRight size={17} />}
        </button>
      </form>

      <p className="login-security-note">
        <span className="security-lock">●</span>
        Your workspace is private and protected.
      </p>
    </AuthLayout>
  );
}