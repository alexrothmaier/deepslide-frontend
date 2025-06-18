import React from 'react';

interface UsageBarProps {
  label: string;
  used: number;
  limit: number;
  since: string;
}

function getBarColor(used: number, limit: number) {
  const percent = limit === 0 ? 0 : used / limit;
  if (percent < 0.7) return '#00bfae'; // teal
  if (percent < 0.9) return '#ffe066'; // yellow
  return '#ef4444'; // red
}

const UsageBar: React.FC<UsageBarProps> = ({ label, used, limit, since }) => {
  const percent = limit === 0 ? 0 : Math.min(used / limit, 1);
  const barColor = getBarColor(used, limit);
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ color: '#fff', fontWeight: 500, fontSize: 15, marginBottom: 2, letterSpacing: 0.5 }}>{label}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 14, color: '#fff', fontWeight: 400, letterSpacing: 0.2 }}>{used.toFixed(2)}<span style={{ color: '#888', fontWeight: 400 }}>&nbsp;/&nbsp;{limit}</span></span>
        <span style={{ color: barColor, fontWeight: 500, fontSize: 14, letterSpacing: 0.2 }}>{Math.max(limit - used, 0)} left</span>
      </div>
      <div style={{ height: 12, background: '#222', borderRadius: 6, margin: '10px 0 4px 0', width: '100%' }}>
        <div style={{ width: `${percent * 100}%`, height: '100%', background: barColor, borderRadius: 6, transition: 'width 0.3s' }} />
      </div>
      <div style={{ color: '#aaa', fontSize: 15, marginTop: 2 }}>Usage since {since}</div>
    </div>
  );
};

export default UsageBar;
