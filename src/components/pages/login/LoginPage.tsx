import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../../../firebase.ts';
import LoginBox from '../../LoginBox.tsx';
import SignUpBox from '../../SignUpBox.tsx';
import '../../LoginBox.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);

  // Parse redirectTo param from query string
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get('redirectTo') || '/account';

  // Handler for email/password login
  const handleEmailLogin = async (email: string, password: string) => {
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

  // Handler for Google login
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
    <SignUpBox
      onSignUp={handleEmailSignUp}
      loading={loading}
      error={error}
      onShowLogin={handleShowLogin}
      // You can implement these if needed:
      onGoogleSignUp={undefined}
      onGithubSignUp={undefined}
    />
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
