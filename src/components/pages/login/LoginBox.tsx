import React, { useState } from 'react';
import './LoginBox.css';

interface LoginBoxProps {
  onLogin: (email: string, password: string) => void;
  onGoogleLogin?: () => void;
  onLinkedinLogin?: () => void;
  onMicrosoftLogin?: () => void;
  loading?: boolean;
  error?: string | null;
  onShowSignUp?: () => void;
}

const LoginBox: React.FC<LoginBoxProps> = ({
  onLogin,
  onGoogleLogin,
  onLinkedinLogin,
  onMicrosoftLogin,
  loading = false,
  error = null,
  onShowSignUp,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin) onLogin(email, password);
  };

  return (
    <div className="login-bg">
      {/* Inject accent color from env as CSS variable for use in CSS */}
      <div
        className="login-container"
        style={{
          // Set CSS variable for accent color, fallback to #00bfae
          '--accent-color': process.env.REACT_APP_ACCENT_COLOR || '#00bfae',
        } as React.CSSProperties}
      >
        <img src="/deepslide-logo-text.png" alt="Logo" className="login-logo" />
        <h2 className="login-title">Log in</h2>
        <button className="login-provider-btn google" onClick={onGoogleLogin} type="button">
          <img src="/google-logo.png" alt="Google" className="provider-logo" />
          Log in with Google
        </button>
        <button className="login-provider-btn linkedin" onClick={onLinkedinLogin} type="button">
          <img src="/linkedin-logo.png" alt="LinkedIn" className="provider-logo" />
          Log in with LinkedIn
        </button>
        <button className="login-provider-btn microsoft" onClick={onMicrosoftLogin} type="button">
          <img src="/microsoft-logo.png" alt="Microsoft" className="provider-logo" />
          Log in with Microsoft
        </button>
        <div className="login-divider">
          <span className="login-divider-line" />
          <span className="login-divider-or">or</span>
          <span className="login-divider-line" />
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="email" className="login-label">Email</label>
          <input
            id="email"
            type="email"
            className="login-input"
            placeholder="Enter your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <label htmlFor="password" className="login-label">Password</label>
          <input
            id="password"
            type="password"
            className="login-input"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            aria-invalid={!!error}
            style={error ? { border: '1.5px solid #ff4444' } : {}}
          />
          {error && (
            <div style={{ color: '#ff4444', marginTop: 4, fontSize: 14 }} role="alert">
              {error}
            </div>
          )}
          <div className="login-links-row" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
  <span className="login-link" style={{ textAlign: 'center' }}>
    Forgot password?{' '}
    <button
      type="button"
      className="login-link-action login-accent-btn"
      style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent-color)', textDecoration: 'underline', cursor: 'pointer' }}
    >
      Send reset code.
    </button>
  </span>
</div>
          <button type="submit" className="login-submit-btn">Log in</button>
        </form>
        <div className="login-signup-row">
          Don't have an account?{' '}
            <button
  type="button"
  className="login-link-action login-accent-btn"
  onClick={() => {
    if (onShowSignUp) onShowSignUp();
  }}
  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent-color)', textDecoration: 'underline', cursor: 'pointer' }}
>
  Sign up.
</button>
        </div>
        {loading && (
          <div className="login-loading-bar">
            <span className="login-loading-inner" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginBox;