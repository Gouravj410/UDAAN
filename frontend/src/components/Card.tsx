import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, title }) => {
  return (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
      {title && <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#1a5490' }}>{title}</h2>}
      {children}
    </div>
  );
};
