import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ title, children, onSearch }) => {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0f1117',
    }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar title={title} onSearch={onSearch} />
        <main style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
