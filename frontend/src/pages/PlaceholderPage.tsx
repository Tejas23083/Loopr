import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

interface Props {
  title: string;
}

const PlaceholderPage: React.FC<Props> = ({ title }) => (
  <DashboardLayout title={title}>
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '400px', color: '#475569', textAlign: 'center',
    }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '16px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '28px', marginBottom: '16px',
      }}>
        🚧
      </div>
      <h2 style={{ color: '#64748b', fontSize: '20px', fontWeight: 600, margin: '0 0 8px' }}>{title}</h2>
      <p style={{ fontSize: '14px', color: '#334155', margin: 0 }}>This section is under construction.</p>
    </div>
  </DashboardLayout>
);

export default PlaceholderPage;
