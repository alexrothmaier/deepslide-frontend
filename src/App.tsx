import React, { useEffect } from 'react';

import { initializeIcons } from '@fluentui/react';
import SignupPage from './components/pages/signup/SignupPage.tsx';
import LandingPage from './components/pages/landing/LandingPage.tsx';
import FilesPage from './components/pages/files/FilesPage.tsx';
import PricingPage from './components/pages/pricing/PricingPage.tsx';
import EnterprisePage from './components/pages/enterprise/EnterprisePage.tsx';
import AccountPageGuard from './components/pages/account/AccountPageGuard.tsx';
import Footer from './components/Footer/Footer.tsx';
import CookieConsent from './components/CookieConsent/CookieConsent.tsx';
import Impressum from './components/legal/Impressum.tsx';
import Datenschutzerklaerung from './components/legal/Datenschutzerklaerung.tsx';
import AGB from './components/legal/AGB.tsx';
import Widerruf from './components/legal/Widerruf.tsx';


import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/pages/login/LoginPage.tsx';
import { FirebaseAuthProvider } from './auth/FirebaseAuthProvider.tsx';

// TODO: Integrate Firebase Auth context/provider



initializeIcons();




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
          <Route path="/signup" element={<SignupPage />} />
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
