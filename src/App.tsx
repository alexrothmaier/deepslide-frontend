import React, { useEffect, useState } from 'react';

import { initializeIcons, Spinner, SpinnerSize, MessageBar, MessageBarType, Stack, DefaultButton } from '@fluentui/react';
import SearchInterface from './components/SearchInterface.tsx';
import LoginBox from './components/LoginBox.tsx';
import SignUpBox from './components/SignUpBox.tsx';

import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { PublicClientApplication, EventType, AccountInfo, InteractionStatus } from '@azure/msal-browser';
import { MsalProvider, useMsal } from '@azure/msal-react';

// Helper to get user roles from ID token claims (if available)
function getUserRoles(account: AccountInfo | null) {
  if (!account || !account.idTokenClaims) return [];
  // Customize this if you have roles/groups in your Entra config
  return account.idTokenClaims.roles || account.idTokenClaims.groups || [];
}

initializeIcons();



const MainPage: React.FC = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const handleSignUp = async () => {
  try {
    await instance.loginRedirect({
      scopes: ['openid', 'profile', 'email'],
      prompt: 'login', 
    });
    setShowSignUp(false);
  } catch (err) {
    setSignupError('Signup failed. Please try again.');
  }
};

  const [msalReady, setMsalReady] = useState(false);
  // Inject loading bar animation style once on mount (ESLint-compliant)
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('loading-bar-anim-style')) {
      const style = document.createElement('style');
      style.id = 'loading-bar-anim-style';
      style.innerHTML = `
        @keyframes loadingBarAnim {
          0% { left: -100%; width: 30%; }
          50% { left: 35%; width: 40%; }
          100% { left: 100%; width: 30%; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const { instance, accounts, inProgress } = useMsal();
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>('No Plan');
  const navigate = useNavigate();

  // Handle redirect response and update MSAL state
  useEffect(() => {
    instance.handleRedirectPromise().catch((e: any) => {
      if (e.errorCode === 'no_token_request_cache_error') {
        // Do nothing, just show login page again
        setError(null);
        setAuthInitialized(false);
        setAuthenticated(false);
      } else {
        setError('Login failed: ' + (e.message || 'Unknown error'));
        setAuthInitialized(true);
        setAuthenticated(false);
      }
    }).finally(() => {
      setMsalReady(true);
    });
    // eslint-disable-next-line
  }, [instance]);

  useEffect(() => {
    if (!msalReady) return; // Wait for MSAL to be ready
    // Listen for login events
    const callbackId = instance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload?.account) {
        setAuthenticated(true);
        setAuthInitialized(true);
        setError(null);
        // Set plan type based on roles/groups
        const roles = getUserRoles(event.payload.account);
        if (roles.includes('paid_user')) setPlan('Paid Plan');
        else if (roles.includes('free_user')) setPlan('Free Plan');
        else setPlan('No Plan');
      }
      if (event.eventType === EventType.LOGIN_FAILURE) {
        setError('Authentication failed: ' + (event.error?.message || 'Unknown error'));
        setAuthInitialized(true);
        setAuthenticated(false);
      }
    });
    // See if already authenticated
    if (accounts && accounts.length > 0) {
      setAuthenticated(true);
      setAuthInitialized(true);
      setError(null);
      const roles = getUserRoles(accounts[0]);
      console.log('Accounts:', accounts);
      console.log('Roles:', roles);
      if (roles.includes('paid_user')) setPlan('Paid Plan');
      else if (roles.includes('free_user')) setPlan('Free Plan');
      else setPlan('No Plan');
    } else if (inProgress === InteractionStatus.None) {
      // Only prompt login if there are no accounts and not already in progress
      instance.loginPopup({ scopes: ['openid', 'profile', 'email'] }).catch((e) => {
        if (e.errorCode === 'user_cancelled') {
          // Do not show error, just reset error and auth state
          setError(null);
          setAuthInitialized(false);
          setAuthenticated(false);
        } else {
          setError('Login failed: ' + e.message);
          setAuthInitialized(true);
        }
      });
    } else {
      setAuthInitialized(true);
    }
    return () => {
      if (callbackId) instance.removeEventCallback(callbackId);
    };
  }, [instance, accounts]);

  // Email/password login state
  const [loadingEmailLogin, setLoadingEmailLogin] = useState(false);
  
  // Email/password login handler
  const handleEmailLogin = async (email: string, password: string) => {
    setLoadingEmailLogin(true);
    setError(null);
    try {
      console.log({ email, password }); // Debug log
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError('Your email or password was incorrect. Please try again.');
        setLoadingEmailLogin(false);
        return;
      }
      // Optionally: store token, update auth state, reload, etc.
      setAuthenticated(true);
      setAuthInitialized(true);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setAuthenticated(false);
      setAuthInitialized(true);
    } finally {
      setLoadingEmailLogin(false);
    }
  };

  const handleLogin = async () => {
    if (inProgress !== InteractionStatus.None) {
      // Prevent login while another interaction is in progress
      return;
    }
    try {
      await instance.loginPopup({ scopes: ['openid', 'profile', 'email'] });
    } catch (e: any) {
      if (e.errorCode === 'user_cancelled' || e.errorCode === 'interaction_in_progress') {
        setError(null);
        setAuthInitialized(false);
        setAuthenticated(false);
      } else {
        setError('Login failed: ' + (e.message || 'Unknown error'));
        setAuthInitialized(true);
        setAuthenticated(false);
      }
    }
  };


  // Show LoginBox with error above form for email/password login errors
  const isLoginError = error && (error.includes('incorrect') || error.includes('problem logging in') || error.includes('Login failed'));

  if (!authenticated) {
    if (showSignUp) {
      return (
        <Stack verticalAlign="center" horizontalAlign="center" style={{ minHeight: '100vh' }}>
          {isLoginError && (
            <MessageBar messageBarType={MessageBarType.error} style={{ marginBottom: 16 }}>{error}</MessageBar>
          )}
          <SignUpBox
            onSignUp={handleSignUp}
            onGoogleSignUp={() => alert('Google signup not implemented')}
            onGithubSignUp={() => alert('GitHub signup not implemented')}
            loading={signupLoading}
            error={signupError}
            onShowLogin={() => { console.log('setShowSignUp(false)'); setShowSignUp(false); }}
          />
        </Stack>
      );
    }
    return (
      <Stack verticalAlign="center" horizontalAlign="center" style={{ minHeight: '100vh' }}>
        {isLoginError && (
          <MessageBar messageBarType={MessageBarType.error} style={{ marginBottom: 16 }}>{error}</MessageBar>
        )}
        <LoginBox
          onLogin={handleEmailLogin}
          onGoogleLogin={() => alert('Google login not implemented')}
          onLinkedinLogin={() => alert('LinkedIn login not implemented')}
          onMicrosoftLogin={handleLogin}
          loading={inProgress !== InteractionStatus.None || loadingEmailLogin}
          error={error}
          onShowSignUp={() => setShowSignUp(true)}
        />
      </Stack>
    );
  }

  // Only show full-page error for unrecoverable errors (not login failures)
  if (error && !isLoginError) {
    return (
      <Stack verticalAlign="center" horizontalAlign="center" style={{ minHeight: '100vh' }}>
        <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>
        <DefaultButton onClick={handleLogin} disabled={inProgress !== InteractionStatus.None}>Retry Login</DefaultButton>
      </Stack>
    );
  }
  // Authenticated: show main app UI
  return (
    <div className="App" style={{ background: '#18181b', minHeight: '100vh', color: 'white' }}>
      <div style={{ padding: '20px 0', textAlign: 'center', fontWeight: 700, fontSize: 22 }}>
        DeepSlide
      </div>
      <div style={{ textAlign: 'center', marginBottom: 16, color: '#00bfae', fontWeight: 600, fontSize: 18 }}>
        {plan === 'Free Plan' ? 'free plan' : plan}
      </div>
        <SearchInterface />
    </div>
  );
};

interface AppProps {
  msalInstance: PublicClientApplication;
}

const App: React.FC<AppProps> = ({ msalInstance }) => {
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <Routes>
          <Route path="/*" element={<MainPage />} />
        </Routes>
      </Router>
    </MsalProvider>
  );
};

export default App;
