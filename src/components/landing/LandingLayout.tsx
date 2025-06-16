import React from 'react';
import NavBar from './NavBar.tsx';
import './LandingLayout.css';

interface Props {
  children: React.ReactNode;
}

const LandingLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="landing-layout">
      <NavBar />
      <main className="landing-layout__content">{children}</main>
    </div>
  );
};

export default LandingLayout;
