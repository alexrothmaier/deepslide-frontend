import React, { useState } from 'react';

const SignupPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Replace with your real signup logic (e.g., Firebase, API call)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) return;
    setLoading(true);
    setError(null);
    try {
      // Example: Replace with your API call
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Signup failed.');
        setLoading(false);
        return;
      }
      // Redirect to login or account page after successful signup
      window.location.href = '/account';
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  // Social signup handlers (optional, stubbed)
  const handleGoogleSignUp = () => alert('Google signup not implemented');
  const handleLinkedinSignUp = () => alert('LinkedIn signup not implemented');
  const handleMicrosoftSignUp = () => alert('Microsoft signup not implemented');

  const handleShowLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="login-bg">
      {/* Inject accent color from env as CSS variable for use in CSS */}
      <div
        className="login-container"
        style={{
          '--accent-color': process.env.REACT_APP_ACCENT_COLOR || '#00bfae',
        } as React.CSSProperties}
      >
        <img src="/deepslide-logo-text.png" alt="Logo" className="login-logo" />
        <h2 className="login-title">Sign up</h2>
        <button className="login-provider-btn google" onClick={handleGoogleSignUp} type="button">
          <img src="/google-logo.png" alt="Google" className="provider-logo" />
          Sign up with Google
        </button>
        <button className="login-provider-btn linkedin" onClick={handleLinkedinSignUp} type="button">
          <img src="/linkedin-logo.png" alt="LinkedIn" className="provider-logo" />
          Sign up with LinkedIn
        </button>
        <button className="login-provider-btn microsoft" onClick={handleMicrosoftSignUp} type="button">
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
              By signing up you agree to the <a href="/legal/AGB" style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}>terms and services</a> and the <a href="/legal/Datenschutzerklaerung" style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}>privacy policy</a>.
            </label>
          </div>
          <button type="submit" className="login-submit-btn" style={{ marginTop: 18 }} disabled={loading || !accepted}>
            {loading ? 'Signing up...' : 'Continue'}
          </button>
        </form>
        <div className="login-signup-row">
          Already have an account? <button
  type="button"
  className="login-link-action login-accent-btn"
  onClick={handleShowLogin}
  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent-color)', textDecoration: 'underline', cursor: 'pointer' }}
>Log in</button>.
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

export default SignupPage;