import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const PortalLayout: React.FC = () => {
  return (
    <div className="portal-layout" style={{ background: '#fff' }}>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <div id="page">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

