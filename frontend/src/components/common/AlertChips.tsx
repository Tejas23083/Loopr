import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useAlert } from '../../context/AlertContext';

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: { bg: '#1a3a2a', border: '#22c55e', text: '#22c55e', icon: '#22c55e' },
  warning: { bg: '#3a2f1a', border: '#f59e0b', text: '#f59e0b', icon: '#f59e0b' },
  error:   { bg: '#3a1a1a', border: '#ef4444', text: '#ef4444', icon: '#ef4444' },
  info:    { bg: '#1a2a3a', border: '#3b82f6', text: '#3b82f6', icon: '#3b82f6' },
};

const AlertChips: React.FC = () => {
  const { alerts, removeAlert } = useAlert();

  if (alerts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '400px',
    }}>
      {alerts.map((alert) => {
        const Icon = icons[alert.type];
        const c = colors[alert.type];
        return (
          <div key={alert.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            background: c.bg,
            border: `1px solid ${c.border}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            animation: 'slideIn 0.3s ease',
          }}>
            <Icon size={18} color={c.icon} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: '14px', color: '#e2e8f0', lineHeight: 1.4 }}>
              {alert.message}
            </span>
            <button
              onClick={() => removeAlert(alert.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default AlertChips;
