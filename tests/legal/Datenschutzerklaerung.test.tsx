import { render, screen } from '@testing-library/react';
import Datenschutzerklaerung from '../../src/components/legal/Datenschutzerklaerung';

describe('Datenschutzerklaerung', () => {
  it('renders privacy policy header', () => {
    render(<Datenschutzerklaerung />);
    expect(screen.getByText(/Datenschutzerklärung/i)).toBeInTheDocument();
  });

  it('shows contact email', () => {
    render(<Datenschutzerklaerung />);
    expect(screen.getByText(/info@example.com/i)).toBeInTheDocument();
  });

  it('shows placeholder warning', () => {
    render(<Datenschutzerklaerung />);
    expect(screen.getByText(/Bitte ersetzen Sie alle Platzhalter/i)).toBeInTheDocument();
  });
});
