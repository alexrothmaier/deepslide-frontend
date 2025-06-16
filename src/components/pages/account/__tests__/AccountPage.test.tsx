import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountPage from '../AccountPage';
import { useFirebaseAuth } from '../../../auth/useFirebaseAuth';

jest.mock('../../../auth/useFirebaseAuth');

const mockLogout = jest.fn();
const mockRefreshUser = jest.fn();

const mockUser = {
  displayName: 'Test User',
  email: 'test@example.com',
  uid: 'test-uid',
  getIdToken: jest.fn().mockResolvedValue('test-token'),
};

describe('AccountPage', () => {
  beforeEach(() => {
    (useFirebaseAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      refreshUser: mockRefreshUser,
    });
    global.fetch = jest.fn().mockImplementation((url, opts) => {
      if (url?.toString().includes('/api/account/role')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ roles: ['free_user'] }) });
      }
      if (url?.toString().includes('/api/account/upgrade')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ role: 'paid_user' }) });
      }
      if (url?.toString().includes('/api/account/downgrade')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ role: 'free_user' }) });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders user info and role', async () => {
    render(<AccountPage />);
    expect(await screen.findByText(/Test User/)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
    expect(await screen.findByText(/Current Role:/)).toBeInTheDocument();
    expect(await screen.findByText(/free_user/)).toBeInTheDocument();
  });

  it('upgrades user to paid_user', async () => {
    render(<AccountPage />);
    const upgradeBtn = await screen.findByText(/Upgrade to Paid User/);
    fireEvent.click(upgradeBtn);
    await waitFor(() => expect(screen.getByText(/Upgraded to paid user/)).toBeInTheDocument());
  });

  it('downgrades user to free_user', async () => {
    render(<AccountPage />);
    const downgradeBtn = await screen.findByText(/Downgrade to Free User/);
    fireEvent.click(downgradeBtn);
    await waitFor(() => expect(screen.getByText(/Downgraded to free user/)).toBeInTheDocument());
  });
});
