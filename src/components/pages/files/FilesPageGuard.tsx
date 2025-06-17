import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FilesPage from './FilesPage.tsx';
import { useFirebaseAuth } from '../../../auth/useFirebaseAuth.ts';

/**
 * Guards the Files page: if not authenticated, redirects to login with redirectTo param.
 * If authenticated, renders the FilesPage.
 */
const FilesPageGuard: React.FC = () => {
  const { user, loading } = useFirebaseAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`);
    }
  }, [loading, user, navigate, location.pathname]);

  if (loading) return null;
  if (!user) return null;
  return <FilesPage />;
};

export default FilesPageGuard;
