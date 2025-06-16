import React from 'react';
import LandingLayout from '../../pages/landing/LandingLayout.tsx';

import { useMsal } from '@azure/msal-react';

const AccountPage: React.FC = () => {
  const { accounts } = useMsal();
  const account = accounts[0];

  // Extract basic info
  const username = account?.username || 'Unknown';
  const name = account?.name || account?.idTokenClaims?.name || 'Unknown';
  const email = account?.idTokenClaims?.email || account?.username || 'Unknown';
  const oid = account?.idTokenClaims?.oid || account?.localAccountId || 'Unknown';

  return (
    <LandingLayout>
      <section style={{ padding: '4rem 1rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Account</h1>
        <div style={{ maxWidth: 600, margin: '2rem auto', color: '#cbd5e1', background: '#23272f', borderRadius: 12, padding: '2rem', boxShadow: '0 2px 8px #0002' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>Welcome, {name}</div>
          <div style={{ marginBottom: 8 }}><b>Email:</b> {email}</div>
          <div style={{ marginBottom: 8 }}><b>Username:</b> {username}</div>
          <div style={{ marginBottom: 8 }}><b>Account ID:</b> {oid}</div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default AccountPage;
