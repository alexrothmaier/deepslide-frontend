import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
  const location = useLocation();
  const navItems = [
    { path: '/files', label: 'Files' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/enterprise', label: 'Enterprise' },
  ];

  return (
    <header className="navbar">
      <div className="navbar__container">
        <div className="navbar__logo">
          <Link to="/" title="Home">
            <img src="/deepslide-logo-text.png" alt="Deepslide Home" style={{ height: '120px', width: 'auto', display: 'block' }} />
          </Link>
        </div>

        <nav className="navbar__nav">
          <ul className="navbar__nav-list">
            {navItems.map((item) => (
              <li
                key={item.path}
                className={`navbar__nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <Link to={item.path} className="navbar__nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="navbar__account">
          <Link to="/account" title="Account">
            <img src="/deepslide-logo.png" alt="Account" className="navbar__account-icon" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
