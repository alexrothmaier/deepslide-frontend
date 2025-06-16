import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import AccountPage from './AccountPage.tsx';

/**
 * Guards the Account page: if not authenticated, triggers login and redirects back after login.
 * If authenticated, renders the AccountPage.
 */
const AccountPageGuard: React.FC = () => {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = accounts && accounts.length > 0;

  useEffect(() => {
    if (!isAuthenticated && inProgress === InteractionStatus.None) {
      instance.loginRedirect({
        scopes: ['openid', 'profile', 'email'],
        redirectUri: window.location.origin + '/account',
      });
    }
  }, [isAuthenticated, inProgress, instance]);

  if (!isAuthenticated) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '4rem' }}>Redirecting to login...</div>;
  }

  return <AccountPage />;
};

export default AccountPageGuard;
