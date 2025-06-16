import React, { useState, useEffect } from 'react';
import { TextField, PrimaryButton, Spinner, SpinnerSize, MessageBar, MessageBarType } from '@fluentui/react';
import { useSearch } from '../hooks/useSearch.ts';
import ResultsList from './ResultsList.tsx';
import { useMsalToken } from '../hooks/useMsalToken.ts';
import './SearchInterface.css';

function getPlan(account) {
  if (!account || !account.idTokenClaims) return '';
  const roles = account.idTokenClaims.roles || [];
  if (roles.includes('paid_user')) return 'paid';
  if (roles.includes('free_user')) return 'free';
  return '';
}

const SearchInterface: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const { results, loading, error, search } = useSearch();
  const [remaining, setRemaining] = useState<number | null>(null);
  // Use MSAL token hook
  const { token, getToken, accounts } = useMsalToken();
  const account = accounts[0];
  const plan = getPlan(account);

  // On mount and after each search, update remaining quota from localStorage
  useEffect(() => {
    const rem = window.localStorage.getItem('search_remaining');
    if (rem !== null) {
      setRemaining(Number(rem));
    } else {
      setRemaining(null);
    }
  }, [results]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await search(query);
    }
  };

  return (
    <div className="search-interface">
      <h1>PowerPoint Semantic Search</h1>

      {/* Show remaining quota only for free users */}
      {plan === 'free' && remaining !== null && (
        <div style={{ position: 'absolute', top: 44, right: 0, zIndex: 1000, fontWeight: 400, color: '#2ecc40', background: 'rgba(243,249,243,0.7)', padding: '2px 10px', borderRadius: '0 0 0 8px', fontSize: '0.80rem', opacity: 0.85, letterSpacing: 0.1, pointerEvents: 'none', minWidth: 90, textAlign: 'right' }}>
          {remaining > 0 ? `${remaining} searches left` : 'No searches left'}
        </div>
      )}
      
      <form onSubmit={handleSearch} className="search-form">
        <TextField 
          label="Search for slides semantically"
          placeholder="E.g., 'quarterly financial results' or 'product roadmap timeline'"
          value={query}
          onChange={(_, newValue) => setQuery(newValue || '')}
          className="search-input"
          disabled={loading}
        />
        <PrimaryButton 
          type="submit" 
          text={loading ? 'Searching...' : 'Search'}
          disabled={loading || !query.trim()}
          className="search-button"
        />
      </form>
      
      {loading && (
        <div className="loading-container">
          <Spinner size={SpinnerSize.large} label="Searching presentations..." />
        </div>
      )}
      
      {error && (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          dismissButtonAriaLabel="Close"
          className="error-message"
        >
          {error}
        </MessageBar>
      )}
      
      {!loading && results.length > 0 && (
        <ResultsList 
          results={results.map(slide => ({
            ...slide,
            searchHistoryId: slide.search_history_id || slide.searchHistoryId || ''
          }))} 
          searchHistoryId={results[0]?.search_history_id || results[0]?.searchHistoryId || ''} 
        />
      )}
      
      {!loading && !error && results.length === 0 && query.trim() !== '' && (
        <MessageBar
          messageBarType={MessageBarType.info}
          isMultiline={false}
          className="info-message"
        >
          No results found. Try a different search query.
        </MessageBar>
      )}
    </div>
  );
};

export default SearchInterface;
