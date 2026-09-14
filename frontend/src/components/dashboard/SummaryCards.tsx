import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { AnalyticsSummary } from '../../types';

interface Props {
  summary: AnalyticsSummary | null;
  isLoading: boolean;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const cards = [
  {
    key: 'balance' as keyof AnalyticsSummary,
    label: 'Balance',
    icon: Wallet,
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.2)',
  },
  {
    key: 'totalRevenue' as keyof AnalyticsSummary,
    label: 'Revenue',
    icon: TrendingUp,
    color: '#00c878',
    glow: 'rgba(0,200,120,0.2)',
  },
  {
    key: 'totalExpenses' as keyof AnalyticsSummary,
    label: 'Expenses',
    icon: TrendingDown,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.2)',
  },
  {
    key: 'savings' as keyof AnalyticsSummary,
    label: 'Savings',
    icon: PiggyBank,
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.2)',
  },
];

const SummaryCards: React.FC<Props> = ({ summary, isLoading }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '24px',
    }}>
      {cards.map(({ key, label, icon: Icon, color, glow }) => (
        <div key={key} style={{
          background: '#1a2234',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          transition: 'transform 0.15s, box-shadow 0.15s',
          cursor: 'default',
        }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${glow}`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          }}
        >
          {/* Icon box */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: `${glow}`,
            border: `1px solid ${color}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={22} color={color} />
          </div>
          {/* Value */}
          <div>
            <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 500, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {label}
            </p>
            {isLoading ? (
              <div style={{ width: '90px', height: '22px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ) : (
              <p style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
                {summary ? formatCurrency(summary[key] as number) : '$0'}
              </p>
            )}
          </div>
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default SummaryCards;
