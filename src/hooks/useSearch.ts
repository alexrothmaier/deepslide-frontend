import { useState, useCallback } from 'react';
import axios from 'axios';
import { SearchResult } from '../types';
import { useMsalToken } from './useMsalToken.ts';

interface UseSearchReturn {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
}

export const useSearch = (): UseSearchReturn => {
  const { getToken, accounts } = useMsalToken();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get API URL from environment variable or use default
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';

  const search = useCallback(async (query: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const startTime = performance.now();
      
      // Get MSAL access token
      if (!accounts || accounts.length === 0) {
        setError('Not authenticated. Please sign in again.');
        setResults([]);
        setLoading(false);
        return;
      }
      const token = await getToken();
      if (!token) {
        setError('Not authenticated. Please sign in again.');
        setResults([]);
        setLoading(false);
        return;
      }
      // Log the token for debugging
      console.log('MSAL Access Token (after login):', token);
      // Use GET request to /api/query-slides with prompt and limit as query params
      const response = await axios.get(`${apiUrl}/api/query-slides`, {
        params: { prompt: query, limit: 3 },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Preferred: Check for free_searches_remaining in response body
      if (response.data && Array.isArray(response.data.results)) {
        setResults(response.data.results);
        if ('free_searches_remaining' in response.data) {
          window.localStorage.setItem('search_remaining', response.data.free_searches_remaining);
        }
      } else if (Array.isArray(response.data)) {
        setResults(response.data); // fallback for old API
      }

      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      // Log search metrics
      console.log(`Search completed in ${responseTime.toFixed(2)}ms`);
    } catch (err) {
      console.error('Search error:', err);
      
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const errorDetail = err.response.data?.detail || '';
          setError(`Error ${err.response.status}: ${errorDetail || 'Search failed'}`);

          // Force logout if token expired or unauthorized
          if (
            err.response.status === 401 &&
            (errorDetail.toLowerCase().includes('token expired') || errorDetail.toLowerCase().includes('signature has expired') || errorDetail.toLowerCase().includes('not authenticated') || errorDetail.toLowerCase().includes('jwt'))
          ) {

          }
        } else if (err.request) {
          // The request was made but no response was received
          setError('No response from server. Please check your connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(`Error: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred');
      }
      
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  return { results, loading, error, search };
};
