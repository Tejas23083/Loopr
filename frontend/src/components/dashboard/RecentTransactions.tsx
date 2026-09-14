import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction } from '../../types';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Props {
  transactions: Transaction[];
  isLoading: boolean;
}

const avatarColors = ['#00c878', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

const RecentTransactions: React.FC<Props> = ({ transactions, isLoading }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      background: '#1a2234',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '16px',
      padding: '24px',
      width: '300px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, margin: 0 }}>Recent Transactions</h3>
        <button
          onClick={() => navigate('/transactions')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#00c878', fontSize: '12px', fontWeight: 600,
          }}
        >
          See all
        </button>
      </div>

      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: '80%', height: '12px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', marginBottom: '6px', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ width: '50%', height: '10px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            </div>
          </div>
        ))
      ) : (
        transactions.map((t, idx) => {
          const isRevenue = t.category === 'Revenue';
          const color = avatarColors[idx % avatarColors.length];
          return (
            <div key={t._id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 0',
              borderBottom: idx < transactions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              {/* Avatar */}
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: `${color}22`,
                border: `1px solid ${color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ color, fontWeight: 700, fontSize: '13px' }}>
                  {t.user_id.replace('user_', 'U')}
                </span>
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 500, margin: 0 }}>
                  {isRevenue ? 'Transfer from' : 'Transfer to'}
                </p>
                <p style={{ color: '#64748b', fontSize: '11px', margin: '2px 0 0' }}>
                  {t.user_id} · {format(new Date(t.date), 'dd MMM')}
                </p>
              </div>
              {/* Amount */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isRevenue
                  ? <ArrowUpRight size={14} color="#00c878" />
                  : <ArrowDownLeft size={14} color="#f59e0b" />
                }
                <span style={{
                  color: isRevenue ? '#00c878' : '#f59e0b',
                  fontSize: '13px',
                  fontWeight: 600,
                }}>
                  {isRevenue ? '+' : '-'}${t.amount.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })
      )}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};

export default RecentTransactions;
