import React, { useState } from 'react';
import LandingLayout from '../../pages/landing/LandingLayout.tsx';
import AccountSidebar from './AccountSidebar.tsx';
import ProfileSection from './ProfileSection.tsx';
import UsageSection from './UsageSection.tsx';
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
  const [selectedSection, setSelectedSection] = useState<string>('profile');
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

  React.useEffect(() => {
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
      setRole(data.role);
    } catch (e: any) {
      setError('Could not fetch role info.');
    } finally {
      setRoleLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setError(null);
    try {
      await logout();
      navigate('/');
    } catch (e: any) {
      setError('Failed to log out.');
    } finally {
      setLoggingOut(false);
    }
  };

  // Section rendering
  const renderSection = () => {
    switch (selectedSection) {
      case 'profile':
        return (
          <ProfileSection>
            <section style={{ padding: 0 }}>
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Account Profile</div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{displayName}</div>
                <div style={{ color: '#888', fontSize: 16 }}>{email}</div>
                <div style={{ color: '#aaa', fontSize: 13 }}>UID: {uid}</div>
                <div style={{ color: '#aaa', fontSize: 13 }}>Role: {roleLoading ? 'Loading...' : role}</div>
              </div>
              {quotaLoading ? (
                <div style={{ color: '#aaa' }}>Loading quota...</div>
              ) : quotaError ? (
                <div style={{ color: '#ef4444' }}>{quotaError}</div>
              ) : quota ? (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 15 }}>
                    <span style={{ color: '#888' }}>Storage used:&nbsp;</span>
                    {quota.storage_quota.limit === null ? (
                      <span style={{ color: '#a259ff', fontWeight: 600 }}>
                        {(quota.storage_quota.used / 1048576).toFixed(2)} MB (Unlimited allowed)
                      </span>
                    ) : (
                      <span style={{ color: '#00bfae', fontWeight: 600 }}>
                        {(quota.storage_quota.used / 1048576).toFixed(2)} MB / {(quota.storage_quota.limit / 1048576).toFixed(0)} MB
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 15 }}>
                    <span style={{ color: '#888' }}>Slides processed:&nbsp;</span>
                    {quota.slides_processed.limit === null ? (
                      <span style={{ color: '#a259ff', fontWeight: 600 }}>
                        {quota.slides_processed.used ?? 0} (Unlimited allowed)
                      </span>
                    ) : (
                      <span style={{ color: '#36d1c4', fontWeight: 600 }}>
                        {quota.slides_processed.used ?? 0} / {quota.slides_processed.limit} ({quota.slides_processed.remaining} left)
                      </span>
                    )}
                  </div>
                </div>
              ) : null}
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
            </section>
          </ProfileSection>
        );
      case 'usage':
        return (
          <div style={{ padding: '48px 0 0 0', minHeight: '100vh', background: '#000' }}>
            <UsageSection
              searchesUsed={quota?.searches?.used ?? 0}
              searchesSince={quota?.searches?.since || 'N/A'}
              slidesUsed={quota?.slides_processed?.used ?? 0}
              slidesSince={quota?.slides_processed?.since || 'N/A'}
            />
          </div>
        );
      default:
        return (
          <ProfileSection>
            <div style={{ color: '#888', fontSize: 16 }}>Section coming soon.</div>
          </ProfileSection>
        );
    }
  };


  return (
    <LandingLayout>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: '#000' }}>
        <AccountSidebar selectedKey={selectedSection} onSelect={setSelectedSection} />
        <div style={{ flex: 1, background: '#000', minHeight: '100vh' }}>{renderSection()}</div>
      </div>
    </LandingLayout>
  );
};

export default AccountPage;
