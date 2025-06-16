import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AccountPage from './AccountPage.tsx';
import { useFirebaseAuth } from '../../../auth/useFirebaseAuth.ts';

/**
 * Guards the Account page: if not authenticated, redirects to login with redirectTo param.
 * If authenticated, renders the AccountPage.
 */
const AccountPageGuard: React.FC = () => {
  const { user, loading } = useFirebaseAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`);
    }
  }, [loading, user, navigate, location.pathname]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  return <AccountPage />;
};

export default AccountPageGuard;
