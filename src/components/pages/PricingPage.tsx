import React from 'react';
import LandingLayout from '../landing/LandingLayout.tsx';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: [
      'Basic slide analysis',
      'Up to 3 projects',
      'Community support',
    ],
    button: { label: 'Get Started', onClick: () => window.location.href = '/signup' },
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    features: [
      'All Free features',
      'Unlimited projects',
      'Priority support',
      'Advanced analytics',
    ],
    button: { label: 'Upgrade Now', onClick: () => window.location.href = '/upgrade' },
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact us',
    period: '',
    features: [
      'All Pro features',
      'Custom integrations',
      'Dedicated account manager',
      'SLA & compliance',
    ],
    button: { label: 'Contact Sales', onClick: () => window.location.href = '/contact' },
    highlight: false,
  },
];

const cardStyle: React.CSSProperties = {
  background: 'rgba(17, 24, 39, 0.95)',
  borderRadius: '1rem',
  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.15)',
  padding: '2rem',
  margin: '1rem',
  flex: 1,
  minWidth: 260,
  maxWidth: 340,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '2px solid transparent',
  transition: 'border 0.2s',
};

const highlightStyle: React.CSSProperties = {
  border: '2px solid #38bdf8',
  background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
  color: '#fff',
};

const PricingPage: React.FC = () => {
  return (
    <LandingLayout>
      <section
        style={{
          padding: '4rem 1rem',
          color: 'white',
          background: '#000',
          minHeight: '100vh',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>Plans and Pricing</h1>
        <p style={{ maxWidth: 600, margin: '1rem auto 2.5rem', color: '#cbd5e1', fontSize: '1.15rem' }}>
          Choose the plan that fits your needs. Upgrade or downgrade anytime.
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2rem',
            margin: '0 auto',
            maxWidth: 1100,
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={plan.highlight ? { ...cardStyle, ...highlightStyle } : cardStyle}
              aria-label={plan.name + ' plan'}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>{plan.name}</h2>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0', color: plan.highlight ? '#fff' : '#38bdf8' }}>
                {plan.price}
                <span style={{ fontSize: '1rem', fontWeight: 400, color: plan.highlight ? '#e0e7ef' : '#cbd5e1' }}>{plan.period}</span>
              </div>
              <ul style={{ textAlign: 'left', margin: '1.5rem 0', padding: 0, listStyle: 'none', width: '100%' }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 22,
                        height: 22,
                        background: plan.highlight ? '#fff' : '#38bdf8',
                        borderRadius: '50%',
                        marginRight: 10,
                        textAlign: 'center',
                        color: plan.highlight ? '#38bdf8' : '#fff',
                        fontWeight: 900,
                        fontSize: 16,
                        lineHeight: '22px',
                      }}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={plan.button.onClick}
                style={{
                  background: plan.highlight ? '#fff' : '#38bdf8',
                  color: plan.highlight ? '#0ea5e9' : '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.75rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: 'auto',
                  boxShadow: plan.highlight ? '0 2px 16px 0 rgba(56,189,248,0.25)' : 'none',
                  transition: 'background 0.2s, color 0.2s',
                }}
                aria-label={plan.button.label + ' for ' + plan.name}
              >
                {plan.button.label}
              </button>
            </div>
          ))}
        </div>
      </section>
    </LandingLayout>
  );
};

export default PricingPage;
