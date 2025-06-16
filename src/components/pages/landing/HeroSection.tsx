import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero__badge">AI-powered knowledge search</div>
      <h1 className="hero__title">
        Introducing <span className="hero__gradient">DeepSlide</span>
      </h1>
      <p className="hero__subtitle">
        Search slide decks and extract insights at lightning speed.
      </p>
      <div className="hero__actions">
        <Link to="/files" className="btn btn--primary">
          Try it now
        </Link>
        <a href="#features" className="btn btn--secondary">
          Explore features
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
