import React from 'react';
import LandingLayout from '../landing/LandingLayout.tsx';

const AccountPage: React.FC = () => {
  return (
    <LandingLayout>
      <section style={{ padding: '4rem 1rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Account</h1>
        <p style={{ maxWidth: 600, margin: '1rem auto', color: '#cbd5e1' }}>
          This is a placeholder account page.
        </p>
      </section>
    </LandingLayout>
  );
};

export default AccountPage;
