import { render, screen } from '@testing-library/react';
import AGB from '../../src/components/legal/AGB';

describe('AGB', () => {
  it('renders AGB header', () => {
    render(<AGB />);
    expect(screen.getByText(/Allgemeine Geschäftsbedingungen/i)).toBeInTheDocument();
  });
  it('shows placeholder warning', () => {
    render(<AGB />);
    expect(screen.getByText(/Bitte passen Sie die AGB an Ihr Unternehmen an/i)).toBeInTheDocument();
  });
});
