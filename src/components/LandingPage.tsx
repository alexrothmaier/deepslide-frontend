import React from 'react';
import LandingLayout from './landing/LandingLayout.tsx';
import HeroSection from './landing/HeroSection.tsx';

const LandingPage: React.FC = () => {
  return (
    <LandingLayout>
      <HeroSection />
    </LandingLayout>
  );
};

export default LandingPage;
