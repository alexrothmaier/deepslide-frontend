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
  const navigate = useNavigate();

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
            {roleLoading ? <span style={{ color: '#aaa' }}>Loading...</span> : <span style={{ color: role === 'paid_user' ? '#36d1c4' : '#fbbf24' }}>{role || 'unknown'}</span>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={() => handleRoleChange('upgrade')}
              disabled={role === 'paid_user' || actionLoading}
              style={{ marginRight: 12, padding: '8px 22px', fontWeight: 600, fontSize: 16, borderRadius: 8, background: '#36d1c4', color: 'white', border: 'none', cursor: role === 'paid_user' ? 'not-allowed' : 'pointer', opacity: actionLoading ? 0.7 : 1 }}
              aria-busy={actionLoading}
            >
              Upgrade to Paid User
            </button>
            <button
              onClick={() => handleRoleChange('downgrade')}
              disabled={role === 'free_user' || actionLoading}
              style={{ padding: '8px 22px', fontWeight: 600, fontSize: 16, borderRadius: 8, background: '#fbbf24', color: '#23272f', border: 'none', cursor: role === 'free_user' ? 'not-allowed' : 'pointer', opacity: actionLoading ? 0.7 : 1 }}
              aria-busy={actionLoading}
            >
              Downgrade to Free User
            </button>
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
