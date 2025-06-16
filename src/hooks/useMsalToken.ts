// useMsalToken.ts removed. Migrating to Firebase Auth.
// Placeholder: useFirebaseAuth.ts will be implemented for Firebase Auth.

interface UseMsalTokenResult {
  token: string | null;
  accounts: AccountInfo[];
  instance: IPublicClientApplication;
  getToken: () => Promise<string | null>;
  loading: boolean;
  error: string | null;
}

/**
 * Standalone function to acquire an access token for a given account and scopes.
 * Use this for non-hook usage (e.g., in utility functions).
 */
export async function getAccessToken(
  instance: IPublicClientApplication,
  account: AccountInfo,
  scopes: string[] = BASE_SCOPES
): Promise<string> {
  const request = {
    scopes,
    account,
  };
  try {
    const response = await instance.acquireTokenSilent(request);
    return response.accessToken;
  } catch (error) {
    // Optionally fallback to popup or redirect here
    throw error;
  }
}

/**
 * React hook to acquire a valid MSAL access token for API calls.
 * Handles silent and interactive flows, error reporting, and loading state.
 */
export function useMsalToken(autoFetch: boolean = true): UseMsalTokenResult {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Returns a valid access token for the current account.
   */
  const getToken = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    setError(null);
    if (!account) {
      setLoading(false);
      setError("No MSAL account found");
      setToken(null);
      return null;
    }
    try {
      const token = await getAccessToken(instance, account, BASE_SCOPES);
      setToken(token);
      setLoading(false);
      return token;
    } catch (e: any) {
      console.error("MSAL token error:", e); // Log full error for debugging
      setError(e.message || "Failed to acquire token");
      setToken(null);
      setLoading(false);
      return null;
    }
  }, [instance, account]);

  // Auto-fetch token on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      getToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, account, instance]);

  return {
    token,
    accounts,
    instance,
    getToken,
    loading,
    error,
  };
}