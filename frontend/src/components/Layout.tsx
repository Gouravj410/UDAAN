import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#1a5490', color: 'white', padding: '1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0 }}>U.D.A.A.N Platform</h1>
        </div>
      </header>
      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '2rem' }}>
        {children}
      </main>
      <footer style={{ background: '#f5f5f5', borderTop: '1px solid #ddd', padding: '2rem', textAlign: 'center' }}>
        <p>&copy; 2024 U.D.A.A.N Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};
