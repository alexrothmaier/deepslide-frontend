import React, { useEffect, useState } from 'react';

import { initializeIcons, Spinner, SpinnerSize, MessageBar, MessageBarType, Stack, DefaultButton } from '@fluentui/react';
import SearchInterface from './components/SearchInterface.tsx';
import LoginBox from './components/LoginBox.tsx';
import SignUpBox from './components/SignUpBox.tsx';
import LandingPage from './components/pages/landing/LandingPage.tsx';
import FilesPage from './components/pages/files/FilesPage.tsx';
import PricingPage from './components/pages/pricing/PricingPage.tsx';
import EnterprisePage from './components/pages/enterprise/EnterprisePage.tsx';
import AccountPageGuard from './components/pages/account/AccountPageGuard.tsx';
import AuthInitializer from './components/AuthInitializer.tsx';
import Footer from './components/Footer.tsx';
import CookieConsent from './components/CookieConsent.tsx';
import Impressum from './components/legal/Impressum.tsx';
import Datenschutzerklaerung from './components/legal/Datenschutzerklaerung.tsx';
import AGB from './components/legal/AGB.tsx';
import Widerruf from './components/legal/Widerruf.tsx';


import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './components/pages/login/LoginPage.tsx';
import { FirebaseAuthProvider } from './auth/FirebaseAuthProvider.tsx';
// import { PublicClientApplication, EventType, AccountInfo, InteractionStatus } from '@azure/msal-browser';
// import { MsalProvider, useMsal } from '@azure/msal-react';
// TODO: Integrate Firebase Auth context/provider

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
    <div className="App" style={{ background: '#18181b', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <div style={{ padding: '20px 0', textAlign: 'center', fontWeight: 700, fontSize: 22 }}>
          DeepSlide
        </div>
        <div style={{ textAlign: 'center', marginBottom: 16, color: '#00bfae', fontWeight: 600, fontSize: 18 }}>
          {plan === 'Free Plan' ? 'free plan' : plan}
        </div>
        <SearchInterface />
      </div>
      <Footer />
    </div>
  );
};



// TODO: Remove msalInstance prop, use Firebase Auth context instead
const App: React.FC = () => {
  return (
    <FirebaseAuthProvider>
      <CookieConsent />
      <Router>
        <Routes>
          <Route path="/" element={<PageWithFooter><LandingPage /></PageWithFooter>} />
          <Route path="/account" element={<AccountPageGuard />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
<Route path="/enterprise" element={<EnterprisePage />} />
          <Route path="/search" element={<SearchInterface />} />
          <Route path="/signup" element={<SignUpBox />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/impressum" element={<LegalPageLayout><Impressum /></LegalPageLayout>} />
          <Route path="/datenschutz" element={<LegalPageLayout><Datenschutzerklaerung /></LegalPageLayout>} />
          <Route path="/agb" element={<LegalPageLayout><AGB /></LegalPageLayout>} />
          <Route path="/widerruf" element={<LegalPageLayout><Widerruf /></LegalPageLayout>} />
          <Route path="/cookie-einstellungen" element={<CookieSettingsPage />} />
        </Routes>
      </Router>
    </FirebaseAuthProvider>
  );
};

// Wrap LandingPage with Footer for legal links
const PageWithFooter: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <div style={{ flex: 1 }}>
      {children}
    </div>
    <Footer />
  </div>
);

// Simple LegalPageLayout to add footer to legal pages
const LegalPageLayout: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#111', color: '#fff' }}>
    <div style={{ flex: 1 }}>{children}</div>
    <Footer />
  </div>
);

// Simple Cookie Settings page to allow users to re-open consent dialog
const CookieSettingsPage: React.FC = () => {
  useEffect(() => {
    // Remove consent to force re-show
    localStorage.removeItem('cookie_consent');
    window.dispatchEvent(new Event('cookie-consent-updated'));
  }, []);
  return (
    <LegalPageLayout>
      <div style={{ maxWidth: 800, margin: 'auto', padding: 32 }}>
        <h1>Cookie-Einstellungen</h1>
        <p>Sie können Ihre Cookie-Präferenzen unten ändern:</p>
        <CookieConsent />
      </div>
    </LegalPageLayout>
  );
};

export default App;
