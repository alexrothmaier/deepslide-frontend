import React from 'react';

interface SignUpBoxProps {
  onSignUp: () => void;
  onShowLogin?: () => void;
  loading?: boolean;
  error?: string | null;
}

const SignUpBox: React.FC<SignUpBoxProps> = ({
  onSignUp,
  onShowLogin,
  loading = false,
  error = null,
}) => {
  return (
    <div className="login-bg">
      <div className="login-container">
        <img src="/deepslide-logo-text.png" alt="Logo" className="login-logo" />
        <h2 className="login-title">Sign up</h2>
        <button
          className="login-submit-btn microsoft"
          style={{ marginTop: 18, width: '100%' }}
          onClick={onSignUp}
          type="button"
        >
          Sign up with Microsoft
        </button>
        <div className="login-signup-row">
          Already have an account?{' '}
          <a
            href="#"
            className="login-link-action"
            onClick={e => {
              e.preventDefault();
              if (typeof onShowLogin === 'function') onShowLogin();
            }}
          >
            Log in
          </a>.
        </div>
        {error && (
          <div className="login-error-message" style={{ color: 'red', marginTop: 12 }}>{error}</div>
        )}
      </div>
    </div>
  );
};

export default SignUpBox;