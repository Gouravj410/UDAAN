import React from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const HomePage: React.FC = () => {
  return (
    <Layout>
      <Card title="Welcome to U.D.A.A.N Platform">
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
          Universal Digital Architecture for Accessible Nirmaan (U.D.A.A.N) is a scalable digital public infrastructure
          platform designed to provide seamless citizen services.
        </p>

        <p style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#666' }}>
          Get started by logging in or creating a new account to access citizen profiles and services.
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button onClick={() => (window.location.href = '/login')}>Login</Button>
          <Button variant="secondary" onClick={() => (window.location.href = '/signup')}>
            Sign Up
          </Button>
        </div>
      </Card>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <Card title="Foundation">
          <p>Secure user authentication and identity management via Keycloak</p>
        </Card>
        <Card title="Operations">
          <p>Efficient CRUD operations for citizen profiles and documents</p>
        </Card>
        <Card title="Intelligence">
          <p>AI-powered services with HuggingFace integration</p>
        </Card>
        <Card title="Governance">
          <p>Comprehensive audit logging and policy enforcement</p>
        </Card>
      </div>
    </Layout>
  );
};
