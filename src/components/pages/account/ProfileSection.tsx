import React from 'react';

/**
 * Profile section for the account page (was the original AccountPage content).
 */
const ProfileSection: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: '32px 32px 0 32px', maxWidth: 700, margin: '0 auto', width: '100%' }}>
    {children}
  </div>
);

export default ProfileSection;
