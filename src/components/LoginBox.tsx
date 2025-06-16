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
      <div className="login-container">
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
        <button
          className="login-submit-btn email-green"
          style={{ marginTop: 18, width: '100%' }}
          onClick={onMicrosoftLogin}
          type="button"
        >
          Log in with Email &amp; Password
        </button>
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