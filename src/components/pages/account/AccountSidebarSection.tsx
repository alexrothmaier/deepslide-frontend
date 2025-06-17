import React from 'react';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Renders a sidebar section with a title and children items.
 */
const AccountSidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{
      color: '#aaa',
      fontSize: 12,
      letterSpacing: 1.2,
      marginBottom: 8,
      textTransform: 'uppercase',
      fontWeight: 600,
    }}>{title}</div>
    <div>{children}</div>
  </div>
);

export default AccountSidebarSection;
