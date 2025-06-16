import React from 'react';
import LandingLayout from '../../pages/landing/LandingLayout.tsx';

const FEATURES = [
  {
    title: 'Single Sign-On (SSO)',
    desc: 'Integrate with your corporate identity provider for seamless access and security.'
  },
  {
    title: 'Dedicated Support',
    desc: 'Priority email and video support with guaranteed SLAs.'
  },
  {
    title: 'Custom Integrations',
    desc: 'API, workflow, and storage integrations tailored to your enterprise needs.'
  },
  {
    title: 'Advanced Security',
    desc: 'Data encryption, audit logs, and compliance features for regulated industries.'
  },
  {
    title: 'Flexible Deployment',
    desc: 'On-premises, private cloud, or EU/US hosting options.'
  },
  {
    title: 'Custom Quotas & Billing',
    desc: 'Volume discounts, custom quotas, and invoicing.'
  },
];

const CONTACT_EMAIL = 'enterprise@deepslide.ai';

const EnterprisePage: React.FC = () => {
  return (
    <LandingLayout>
      <section
        style={{
          padding: '4rem 1rem 2rem',
          background: 'linear-gradient(90deg, #0f2027 0%, #2c5364 100%)',
          color: 'white',
          textAlign: 'center',
        }}
        aria-label="Enterprise Hero"
      >
        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>
          Deepslide Enterprise
        </h1>
        <p style={{ maxWidth: 600, margin: '0 auto 2.5rem', color: '#cbd5e1', fontSize: '1.25rem' }}>
          Unlock advanced features, integrations, and support for your organization. Scale securely with Deepslide Enterprise.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="enterprise-cta-btn"
          style={{
            display: 'inline-block',
            padding: '0.85em 2.2em',
            background: 'linear-gradient(90deg, #36d1c4 0%, #5b86e5 100%)',
            color: 'white',
            fontWeight: 700,
            borderRadius: 8,
            fontSize: '1.1rem',
            textDecoration: 'none',
            boxShadow: '0 2px 12px rgba(36, 198, 220, 0.08)',
            marginBottom: '2.5rem',
            transition: 'background 0.2s',
          }}
          aria-label="Contact Deepslide Enterprise Sales"
        >
          Contact Sales
        </a>
      </section>

      <section
        style={{
          background: '#181c25',
          padding: '2rem 1rem 4rem',
          color: '#e0e6ed',
        }}
        aria-label="Enterprise Features"
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
          Enterprise Features
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem',
            maxWidth: 1100,
            margin: '0 auto',
          }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              style={{
                background: '#23273a',
                borderRadius: 12,
                padding: '2rem 1.2rem',
                boxShadow: '0 2px 12px rgba(36, 198, 220, 0.06)',
                minHeight: 160,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12, color: '#36d1c4' }}>{f.title}</h3>
              <p style={{ fontSize: '1rem', color: '#cbd5e1', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </LandingLayout>
  );
};

export default EnterprisePage;
