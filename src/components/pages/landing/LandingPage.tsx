import React from 'react';
import LandingLayout from './LandingLayout.tsx';
import HeroSection from './HeroSection.tsx';

const LandingPage: React.FC = () => {
  return (
    <LandingLayout>
      <HeroSection />
    </LandingLayout>
  );
};

export default LandingPage;
