import { render, screen, fireEvent } from '@testing-library/react';
import CookieConsent from '../../src/components/CookieConsent';

describe('CookieConsent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders cookie consent banner if no consent is given', () => {
    render(<CookieConsent />);
    expect(screen.getByText(/Diese Website verwendet Cookies/i)).toBeInTheDocument();
  });

  it('accepts all cookies', () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByText(/Alle akzeptieren/i));
    expect(localStorage.getItem('cookie_consent')).toContain('analytics');
    expect(localStorage.getItem('cookie_consent')).toContain('marketing');
  });

  it('rejects all except necessary cookies', () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByText(/Nur notwendige/i));
    const prefs = JSON.parse(localStorage.getItem('cookie_consent')!);
    expect(prefs.necessary).toBe(true);
    expect(prefs.analytics).toBe(false);
    expect(prefs.marketing).toBe(false);
  });
});
