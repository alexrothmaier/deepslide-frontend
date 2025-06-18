import React from 'react';
import UsageBar from './UsageBar.tsx';

interface UsageSectionProps {
  searchesUsed: number;
  searchesSince: string;
  slidesUsed: number;
  slidesSince: string;
}

const SEARCH_LIMIT = Number(process.env.REACT_APP_SEARCH_LIMIT) || 1000;
const SLIDES_LIMIT = Number(process.env.REACT_APP_SLIDES_LIMIT) || 500;

const UsageSection: React.FC<UsageSectionProps> = ({
  searchesUsed,
  searchesSince,
  slidesUsed,
  slidesSince,
}) => (
  <div style={{ background: '#111', borderRadius: 16, padding: 32, maxWidth: 700, margin: '0 auto', boxShadow: '0 2px 16px #0004', color: '#fff', minWidth: 420 }}>
    <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Usage Summary</div>
    <div style={{ color: '#aaa', fontSize: 15, marginBottom: 24 }}>Your usage statistics for the current period.</div>
    <UsageBar
      label="Searches"
      used={searchesUsed}
      limit={SEARCH_LIMIT}
      since={searchesSince}
    />
    <UsageBar
      label="Slides Processed"
      used={slidesUsed}
      limit={SLIDES_LIMIT}
      since={slidesSince}
    />
    <div style={{ color: '#888', fontSize: 14, marginTop: 16 }}>
      Once you reach your usage limit, additional usage may require an upgrade or add-on credits.
    </div>
  </div>
);

export default UsageSection;
