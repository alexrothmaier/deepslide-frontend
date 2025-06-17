import React, { useEffect, useState } from 'react';
import LandingLayout from '../../pages/landing/LandingLayout.tsx';
import { useFirebaseAuth } from '../../../auth/useFirebaseAuth.ts';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8001';

const AccountPage: React.FC = () => {
  const { user, logout, refreshUser } = useFirebaseAuth();
  const displayName = user?.displayName || 'Unknown';
  const email = user?.email || 'Unknown';
  const uid = user?.uid || 'Unknown';
  const [loggingOut, setLoggingOut] = useState(false);
  const [role, setRole] = useState<string>('');
  const [roleLoading, setRoleLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [quota, setQuota] = useState<any>(null);
  const [quotaLoading, setQuotaLoading] = useState(false);
  const [quotaError, setQuotaError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch quota info
  const fetchQuota = async () => {
    setQuotaLoading(true);
    setQuotaError(null);
    try {
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/api/quota/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch quota info');
      const data = await res.json();
      setQuota(data);
    } catch (e: any) {
      setQuotaError('Could not fetch quota info.');
    } finally {
      setQuotaLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
    fetchQuota();
    // eslint-disable-next-line
  }, [user]);

  // Fetch current role from backend (authoritative)
  const fetchRole = async () => {
    setRoleLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/api/account/role`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch role');
      const data = await res.json();
      setRole(Array.isArray(data.roles) ? data.roles[0] : String(data.roles));
    } catch (e: any) {
      setError('Could not fetch role.');
    } finally {
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
    // eslint-disable-next-line
  }, [user]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      window.location.href = '/';
    } finally {
      setLoggingOut(false);
    }
  };

  // Helper for upgrade/downgrade
  const handleRoleChange = async (target: 'upgrade' | 'downgrade') => {
    setActionLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (!user) throw new Error('Not signed in');
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/api/account/${target}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to change role');
      // Force refresh the ID token so new custom claims are present immediately
      await user.getIdToken(true);
      await refreshUser(); // Refresh Firebase user and ID token
      await fetchRole();   // Re-fetch role from backend
      setMessage(target === 'upgrade' ? 'Upgraded to paid user!' : 'Downgraded to free user.');
    } catch (e: any) {
      setError(e.message || 'Role change failed.');
    } finally {
      setActionLoading(false);
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
          <div style={{ marginBottom: 16 }}>
            <b>Current Role:</b>{' '}
            {roleLoading ? (
  <span style={{ color: '#aaa' }}>Loading...</span>
) : (
  role === 'pro' ? (
    <span style={{ color: '#a259ff', fontWeight: 600 }}>Pro</span>
  ) : role === 'free' ? (
    <span style={{ color: '#fbbf24', fontWeight: 600 }}>Free</span>
  ) : (
    <span style={{ color: '#fff' }}>{role || 'unknown'}</span>
  )
)}
          </div>
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={() => handleRoleChange('upgrade')}
              disabled={role === 'pro' || actionLoading}
              style={{ marginRight: 12, padding: '8px 22px', fontWeight: 600, fontSize: 16, borderRadius: 8, background: '#a259ff', color: 'white', border: 'none', cursor: role === 'pro' ? 'not-allowed' : 'pointer', opacity: actionLoading ? 0.7 : 1 }}
              aria-busy={actionLoading}
            >
              Upgrade to Pro
            </button>
            <button
              onClick={() => handleRoleChange('downgrade')}
              disabled={role === 'free' || actionLoading}
              style={{ padding: '8px 22px', fontWeight: 600, fontSize: 16, borderRadius: 8, background: '#fbbf24', color: '#23272f', border: 'none', cursor: role === 'free' ? 'not-allowed' : 'pointer', opacity: actionLoading ? 0.7 : 1 }}
              aria-busy={actionLoading}
            >
              Downgrade to Free
            </button>
          </div>
          {/* Quota Info */}
          <div style={{ marginBottom: 16, padding: '16px 0 0 0' }}>
            <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 6 }}>Quota</div>
            {quotaLoading ? (
              <span style={{ color: '#aaa' }}>Loading quota...</span>
            ) : quotaError ? (
              <span style={{ color: '#ef4444' }}>{quotaError}</span>
            ) : quota ? (
              <div>
                <div style={{ fontSize: 15, marginBottom: 3 }}>
                  <span style={{ color: '#888' }}>Searches used:&nbsp;</span>
                  {quota.search_quota.limit === null ? (
                    <span style={{ color: '#a259ff', fontWeight: 600 }}>
                      {quota.search_quota.used ?? 0} (Unlimited allowed)
                    </span>
                  ) : (
                    <span style={{ color: '#00bfae', fontWeight: 600 }}>
                      {quota.search_quota.used ?? 0} / {quota.search_quota.limit} ({quota.search_quota.remaining} left)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 15 }}>
                  <span style={{ color: '#888' }}>Storage used:&nbsp;</span>
                  {quota.storage_quota.limit === null ? (
                    <span style={{ color: '#a259ff', fontWeight: 600 }}>Unlimited</span>
                  ) : (
                    <span style={{ color: '#00bfae', fontWeight: 600 }}>{(quota.storage_quota.used / 1048576).toFixed(2)} MB / {(quota.storage_quota.limit / 1048576).toFixed(0)} MB</span>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {message && <div style={{ color: '#36d1c4', marginBottom: 8 }}>{message}</div>}
          {error && <div style={{ color: '#ef4444', marginBottom: 8 }}>{error}</div>}
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
