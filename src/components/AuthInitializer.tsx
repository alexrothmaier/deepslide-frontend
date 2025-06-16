import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';

/**
 * Ensures MSAL redirect responses are always processed, no matter which route is hit.
 */
const AuthInitializer: React.FC = () => {
  const { instance } = useMsal();
  useEffect(() => {
    instance.handleRedirectPromise().catch(() => {});
  }, [instance]);
  return null;
};

export default AuthInitializer;
