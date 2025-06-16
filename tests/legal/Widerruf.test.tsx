import { render, screen } from '@testing-library/react';
import Widerruf from '../../src/components/legal/Widerruf';

describe('Widerruf', () => {
  it('renders Widerrufsbelehrung header', () => {
    render(<Widerruf />);
    expect(screen.getByText(/Widerrufsbelehrung/i)).toBeInTheDocument();
  });
  it('shows placeholder warning', () => {
    render(<Widerruf />);
    expect(screen.getByText(/Bitte passen Sie die Widerrufsbelehrung an Ihr Angebot an/i)).toBeInTheDocument();
  });
});
