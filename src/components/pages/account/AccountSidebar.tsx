import React from 'react';
import AccountSidebarSection from './AccountSidebarSection.tsx';

interface SidebarItem {
  label: string;
  key: string;
  onClick?: () => void;
  selected?: boolean;
  danger?: boolean;
}

interface AccountSidebarProps {
  selectedKey: string;
  onSelect: (key: string) => void;
}

const sections: { title: string; items: SidebarItem[] }[] = [
  {
    title: 'Account',
    items: [
      { label: 'Profile', key: 'profile' },
      { label: 'Notifications', key: 'notifications' },
      { label: 'Settings', key: 'settings' },
    ],
  },
  {
    title: 'Subscription',
    items: [
      { label: 'Usage', key: 'usage' },
      { label: 'Plan Management', key: 'plan' },
      { label: 'Model Provider API Keys', key: 'api-keys' },
    ],
  },
  {
    title: 'Features',
    items: [
      { label: 'Deploys', key: 'deploys' },
      { label: 'Conversation Shares', key: 'shares' },
    ],
  },
  {
    title: '',
    items: [
      { label: 'Referrals', key: 'referrals' },
    ],
  },
  {
    title: '',
    items: [
      { label: 'Log out', key: 'logout', danger: true },
    ],
  },
];

/**
 * Renders the sidebar for the account page, with sections and selectable items.
 */
const AccountSidebar: React.FC<AccountSidebarProps> = ({ selectedKey, onSelect }) => (
  <nav
    style={{
      width: 260,
      marginLeft: 36,
      background: '#000',
      padding: '32px 0 0 0',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #222',
    }}
    aria-label="Account navigation sidebar"
  >
    <div style={{ flex: 1 }}>
      {sections.map((section, idx) => (
        <AccountSidebarSection key={section.title + idx} title={section.title}>
          {section.items.map(item => (
            <div
              key={item.key}
              onClick={() => onSelect(item.key)}
              style={{
                padding: '10px 18px',
                fontSize: 14,
                background: selectedKey === item.key ? '#181818' : 'none',
                color: item.danger ? '#ef4444' : selectedKey === item.key ? '#fff' : '#e5e5e5',
                fontWeight: selectedKey === item.key ? 600 : 400,
                borderRadius: 8,
                marginBottom: 4,
                cursor: 'pointer',
                boxShadow: selectedKey === item.key ? '0 2px 8px 0 #111' : 'none',
                transition: 'background 0.15s, box-shadow 0.15s',
              
              }}
              tabIndex={0}
              aria-current={selectedKey === item.key ? 'page' : undefined}
              role="button"
              onMouseEnter={e => {
                e.currentTarget.style.background = '#181818';
                e.currentTarget.style.boxShadow = '0 2px 8px 0 #111';
                e.currentTarget.style.color = item.danger ? '#ef4444' : '#fff';
                e.currentTarget.style.fontWeight = '600';
              }}
              onMouseLeave={e => {
                if (selectedKey === item.key) {
                  e.currentTarget.style.background = '#181818';
                  e.currentTarget.style.boxShadow = '0 2px 8px 0 #111';
                  e.currentTarget.style.color = item.danger ? '#ef4444' : '#fff';
                  e.currentTarget.style.fontWeight = '600';
                } else {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.color = item.danger ? '#ef4444' : '#e5e5e5';
                  e.currentTarget.style.fontWeight = '400';
                }
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(item.key);
              }}
            >
              {item.label}
            </div>
          ))}
        </AccountSidebarSection>
      ))}
    </div>
  </nav>
);

export default AccountSidebar;
