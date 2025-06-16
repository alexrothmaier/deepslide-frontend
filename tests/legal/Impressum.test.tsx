import { render, screen } from '@testing-library/react';
import Impressum from '../../src/components/legal/Impressum';

describe('Impressum', () => {
  it('renders legal address and contact info', () => {
    render(<Impressum />);
    expect(screen.getByText(/Angaben gemäß § 5 TMG/i)).toBeInTheDocument();
    expect(screen.getByText(/Max Mustermann/i)).toBeInTheDocument();
    expect(screen.getByText(/Musterstraße 1/i)).toBeInTheDocument();
    expect(screen.getByText(/info@example.com/i)).toBeInTheDocument();
  });

  it('shows placeholder warning', () => {
    render(<Impressum />);
    expect(screen.getByText(/Bitte ersetzen Sie alle Platzhalter/i)).toBeInTheDocument();
  });
});
