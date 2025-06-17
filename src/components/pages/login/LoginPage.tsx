import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../../../firebase/firebase.ts';
import LoginBox from './LoginBox.tsx';
import './LoginBox.css';
import SignupPage from '../signup/SignupPage.tsx';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);


  // Handler for email/password login
  const handleEmailLogin = async (email: string, password: string) => {
    console.log('[LoginPage] handleEmailLogin called', { email });
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('[LoginPage] Login successful, navigating to /account');
      navigate('/account', { replace: true });
      console.log('[LoginPage] Navigated to /account');
    } catch (err: any) {
      console.error('[LoginPage] Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ...

  // In the JSX, ensure error is displayed:
  // {error && <div className="login-error-message">{error}</div>}


  // Handler for Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/account', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  // Firebase signup handler
  const handleEmailSignUp = async (firstName: string, lastName: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Create user with Firebase
      await import('firebase/auth').then(({ createUserWithEmailAndPassword }) =>
        createUserWithEmailAndPassword(auth, email, password)
      );
      // Optionally, update user profile with first and last name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: `${firstName} ${lastName}` });
      }
      navigate('/account', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // Toggle handlers
  const handleShowSignUp = () => setShowSignUp(true);
  const handleShowLogin = () => setShowSignUp(false);

  return showSignUp ? (
    <SignupPage />
  ) : (
    <LoginBox
      onLogin={handleEmailLogin}
      onGoogleLogin={handleGoogleLogin}
      onLinkedinLogin={undefined}
      onMicrosoftLogin={undefined}
      loading={loading}
      error={error}
      onShowSignUp={handleShowSignUp}
    />
  );
};

export default LoginPage;
