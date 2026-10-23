import { useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: (rememberMe: boolean) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onLogin(rememberMe);
  }

  return (
    <main className="login-shell">
      <section className="login-brand-panel" aria-label="Universal CRM">
        <div className="brand-orbit brand-orbit-one" />
        <div className="brand-orbit brand-orbit-two" />
        <div className="brand-panel-content">
          <div className="brand-lockup">
            <span className="brand-mark"><Sparkles size={23} strokeWidth={2.5} /></span>
            <span>universal<span className="brand-lockup-light">crm</span></span>
          </div>
          <div className="brand-welcome">
            <p className="eyebrow eyebrow-light">One clear view of your business</p>
            <h1>Good relationships<br />move everything.</h1>
            <p className="brand-description">
              Bring your people, pipeline, and next big opportunity into focus.
            </p>
          </div>
          <div className="brand-footnote">
            <span className="brand-footnote-dot" /> Built for the way your team works
          </div>
        </div>
        <div className="brand-scallop" aria-hidden="true" />
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrap">
          <div className="mobile-brand-lockup">
            <span className="brand-mark"><Sparkles size={20} strokeWidth={2.5} /></span>
            <span>universal<span className="brand-lockup-light">crm</span></span>
          </div>
          <div className="login-heading">
            <p className="eyebrow">Welcome back</p>
            <h2>Log in</h2>
            <p>Enter your details to pick up where you left off.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="employee-id">Work email or ID</label>
            <input
              className="text-input"
              id="employee-id"
              name="employeeId"
              type="text"
              placeholder="e.g. EMP123456"
              autoComplete="username"
              required
            />

            <div className="password-label-row">
              <label className="field-label" htmlFor="password">Password</label>
              <a href="mailto:support@universalcrm.example">Forgot password?</a>
            </div>
            <div className="password-input-wrap">
              <input
                className="text-input"
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                className="password-toggle"
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="remember-option">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span className="custom-checkbox" aria-hidden="true" />
              <span>Remember me</span>
            </label>

            <button className="login-submit" type="submit">
              <span>Log in</span>
              <ArrowRight size={17} />
            </button>
          </form>

          <p className="login-security-note">
            <span className="security-lock">●</span>
            Your workspace is private and protected.
          </p>
        </div>
        <footer className="login-footer">© 2026 Universal CRM <span>·</span> A better view of what matters</footer>
      </section>
    </main>
  );
}