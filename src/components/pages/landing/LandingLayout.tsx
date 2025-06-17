import React from 'react';
import NavBar from '../../NavBar/NavBar.tsx';
import './LandingLayout.css';
import Footer from '../../Footer/Footer.tsx';
interface Props {
  children: React.ReactNode;
}



const LandingLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="landing-layout" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <NavBar />
      <main className="landing-layout__content" style={{flex: 1}}>{children}</main>
      <Footer />
    </div>
  );
};

export default LandingLayout;
