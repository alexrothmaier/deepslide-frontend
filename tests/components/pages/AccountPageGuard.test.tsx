import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MemoryRouter } from 'react-router-dom';
import AccountPageGuard from '../../../src/components/pages/AccountPageGuard';

// Mock MSAL instance
const msalInstance = new PublicClientApplication({
  auth: { clientId: 'dummy-client-id', authority: 'https://login.microsoftonline.com/common' },
});

jest.mock('@azure/msal-react', () => {
  const actual = jest.requireActual('@azure/msal-react');
  return {
    ...actual,
    useMsal: () => ({
      instance: msalInstance,
      accounts: [],
    }),
  };
});

describe('AccountPageGuard', () => {
  it('redirects to login when not authenticated', async () => {
    render(
      <MsalProvider instance={msalInstance}>
        <MemoryRouter initialEntries={['/account']}>
          <AccountPageGuard />
        </MemoryRouter>
      </MsalProvider>
    );
    expect(screen.getByText(/Redirecting to login/i)).toBeInTheDocument();
  });

  it('renders AccountPage when authenticated', async () => {
    jest.spyOn(require('@azure/msal-react'), 'useMsal').mockReturnValue({
      instance: msalInstance,
      accounts: [{}],
    });
    render(
      <MsalProvider instance={msalInstance}>
        <MemoryRouter initialEntries={['/account']}>
          <AccountPageGuard />
        </MemoryRouter>
      </MsalProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Account/i)).toBeInTheDocument();
    });
  });
});
