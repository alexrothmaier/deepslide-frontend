import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../../firebase.ts';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse redirectTo param from query string
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get('redirectTo') || '/account';

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <img src="/deepslide-logo-text.png" alt="Logo" className="login-logo" />
        <h2 className="login-title">Log in</h2>
        <form onSubmit={handleEmailLogin} style={{ marginBottom: 24 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            disabled={loading}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
            className="login-input"
          />
          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in with Email'}
          </button>
        </form>
        <div className="login-divider">
          <span className="login-divider-line" />
          <span className="login-divider-or">or</span>
          <span className="login-divider-line" />
        </div>
        <button
          className="login-provider-btn google"
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
        >
          <img src="/google-logo.png" alt="Google" className="provider-logo" />
          Log in with Google
        </button>
        {error && <div className="login-error">{error}</div>}
        {loading && (
          <div className="login-loading-bar">
            <span className="login-loading-inner" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
