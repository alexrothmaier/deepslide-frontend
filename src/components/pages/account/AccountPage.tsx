import React from 'react';
import LandingLayout from '../../pages/landing/LandingLayout.tsx';

// import { useMsal } from '@azure/msal-react';

import { useFirebaseAuth } from '../../../auth/useFirebaseAuth.ts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccountPage: React.FC = () => {
  const { user, logout } = useFirebaseAuth();
  const displayName = user?.displayName || 'Unknown';
  const email = user?.email || 'Unknown';
  const uid = user?.uid || 'Unknown';
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      window.location.href = '/';
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <LandingLayout>
      <section style={{ padding: '4rem 1rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Account</h1>
        <div style={{ maxWidth: 600, margin: '2rem auto', color: '#cbd5e1', background: '#23272f', borderRadius: 12, padding: '2rem', boxShadow: '0 2px 8px #0002' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>Welcome, {displayName}</div>
          <div style={{ marginBottom: 8 }}><b>Email:</b> {email}</div>
          <div style={{ marginBottom: 8 }}><b>Account ID:</b> {uid}</div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{ marginTop: 24, padding: '10px 28px', fontWeight: 600, fontSize: 16, borderRadius: 8, background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', opacity: loggingOut ? 0.7 : 1 }}
            aria-busy={loggingOut}
          >
            {loggingOut ? 'Logging out...' : 'Log out'}
          </button>
        </div>
      </section>
    </LandingLayout>
  );
};

export default AccountPage;
