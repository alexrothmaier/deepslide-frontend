import React, { useState } from 'react';

interface SignUpBoxProps {
  onSignUp: (firstName: string, lastName: string, email: string, password: string) => void;
  onGoogleSignUp?: () => void;
  onLinkedinSignUp?: () => void;
  onMicrosoftSignUp?: () => void;
  onGithubSignUp?: () => void;
  loading?: boolean;
  error?: string | null;
  onShowLogin?: () => void;
}

const SignUpBox: React.FC<SignUpBoxProps> = ({
  onSignUp,
  onGoogleSignUp,
  onLinkedinSignUp,
  onMicrosoftSignUp,
  onGithubSignUp,
  loading = false,
  error = null,
  onShowLogin,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accepted && onSignUp) {
      onSignUp(firstName, lastName, email, password);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <img src="/deepslide-logo-text.png" alt="Logo" className="login-logo" />
        <h2 className="login-title">Sign up</h2>
        <button className="login-provider-btn google" onClick={onGoogleSignUp} type="button">
          <img src="/google-logo.png" alt="Google" className="provider-logo" />
          Sign up with Google
        </button>
        <button className="login-provider-btn linkedin" onClick={typeof onLinkedinSignUp === 'function' ? onLinkedinSignUp : undefined} type="button">
          <img src="/linkedin-logo.png" alt="LinkedIn" className="provider-logo" />
          Sign up with LinkedIn
        </button>
        <button className="login-provider-btn microsoft" onClick={typeof onMicrosoftSignUp === 'function' ? onMicrosoftSignUp : undefined} type="button">
          <img src="/microsoft-logo.png" alt="Microsoft" className="provider-logo" />
          Sign up with Microsoft
        </button>
        <div className="login-divider">
          <span className="login-divider-line" />
          <span className="login-divider-or">or</span>
          <span className="login-divider-line" />
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <div style={{ width: '100%' }}>
              <label htmlFor="firstName" className="login-label">First name</label>
              <input
                id="firstName"
                type="text"
                className="login-input"
                placeholder="Your first name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ width: '100%' }}>
              <label htmlFor="lastName" className="login-label">Last name</label>
              <input
                id="lastName"
                type="text"
                className="login-input"
                placeholder="Your last name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                autoComplete="family-name"
                style={{ width: '100%' }}
              />
            </div>
          </div>
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
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <div style={{ display: 'flex', alignItems: 'center', margin: '12px 0 0 0' }}>
            <input
              id="accept"
              type="checkbox"
              checked={accepted}
              onChange={e => setAccepted(e.target.checked)}
              style={{ marginRight: 8 }}
              required
            />
            <label htmlFor="accept" style={{ fontSize: 14, color: '#ccc' }}>
              By signing up you agree to the <a href="#" style={{ color: '#00bfae', textDecoration: 'underline' }}>terms and services</a> and the <a href="#" style={{ color: '#00bfae', textDecoration: 'underline' }}>privacy policy</a>.
            </label>
          </div>
          <button type="submit" className="login-submit-btn" style={{ marginTop: 18 }} disabled={loading || !accepted}>
            {loading ? 'Signing up...' : 'Continue'}
          </button>
        </form>
        <div className="login-signup-row">
          Already have an account? <a href="#" className="login-link-action" onClick={e => { e.preventDefault(); if (onShowLogin) onShowLogin(); }}>Log in</a>.
        </div>
        {error && (
          <div style={{ color: '#ff4444', marginTop: 4, fontSize: 14 }} role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpBox;