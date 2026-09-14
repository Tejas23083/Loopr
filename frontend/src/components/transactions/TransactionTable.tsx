import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Transaction, TransactionFilters, Pagination } from '../../types';
import { format } from 'date-fns';

interface Props {
  transactions: Transaction[];
  pagination: Pagination | null;
  filters: TransactionFilters;
  isLoading: boolean;
  onFilterChange: (f: TransactionFilters) => void;
}

const avatarColors = ['#00c878', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
const getUserColor = (userId: string) => {
  const num = parseInt(userId.replace(/\D/g, '')) || 0;
  return avatarColors[num % avatarColors.length];
};

const columns = [
  { key: 'user_id', label: 'User' },
  { key: 'date', label: 'Date' },
  { key: 'amount', label: 'Amount' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
];

const SortIcon: React.FC<{ col: string; sortBy: string; sortOrder: string }> = ({ col, sortBy, sortOrder }) => {
  if (sortBy !== col) return <ChevronsUpDown size={13} color="#475569" />;
  return sortOrder === 'asc'
    ? <ChevronUp size={13} color="#00c878" />
    : <ChevronDown size={13} color="#00c878" />;
};

const TransactionTable: React.FC<Props> = ({
  transactions, pagination, filters, isLoading, onFilterChange,
}) => {
  const handleSort = (col: string) => {
    const isSame = filters.sortBy === col;
    onFilterChange({
      ...filters,
      sortBy: col,
      sortOrder: isSame && filters.sortOrder === 'desc' ? 'asc' : 'desc',
      page: 1,
    });
  };

  const handlePageChange = (page: number) => onFilterChange({ ...filters, page });

  const skeletonRows = Array.from({ length: filters.limit || 10 });

  return (
    <div>
      {/* Table wrapper */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ background: '#1e2a3a' }}>
              {columns.map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  style={{
                    padding: '13px 16px',
                    textAlign: 'left',
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {label}
                    <SortIcon col={key} sortBy={filters.sortBy || ''} sortOrder={filters.sortOrder || 'desc'} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? skeletonRows.map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {columns.map((col) => (
                      <td key={col.key} style={{ padding: '14px 16px' }}>
                        <div style={{ height: '16px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite', width: col.key === 'user_id' ? '120px' : '80px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              : transactions.length === 0
                ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#475569', fontSize: '14px' }}>
                      No transactions found. Try adjusting your filters.
                    </td>
                  </tr>
                )
                : transactions.map((t, idx) => {
                    const isRevenue = t.category === 'Revenue';
                    const isPaid = t.status === 'Paid';
                    const color = getUserColor(t.user_id);
                    const rowBg = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)';
                    return (
                      <tr
                        key={t._id}
                        style={{
                          background: rowBg,
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(0,200,120,0.04)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = rowBg; }}
                      >
                        {/* User */}
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '34px', height: '34px', borderRadius: '50%',
                              background: `${color}22`, border: `1px solid ${color}44`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 700, fontSize: '11px', color, flexShrink: 0,
                            }}>
                              {t.user_id.replace('user_', 'U')}
                            </div>
                            <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>{t.user_id}</span>
                          </div>
                        </td>
                        {/* Date */}
                        <td style={{ padding: '13px 16px', color: '#94a3b8', fontSize: '13px', whiteSpace: 'nowrap' }}>
                          {format(new Date(t.date), 'EEE, dd MMM yyyy')}
                        </td>
                        {/* Amount */}
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{
                            color: isRevenue ? '#00c878' : '#f59e0b',
                            fontSize: '14px',
                            fontWeight: 600,
                          }}>
                            {isRevenue ? '+' : '-'}${t.amount.toFixed(2)}
                          </span>
                        </td>
                        {/* Category */}
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 500,
                            background: isRevenue ? 'rgba(0,200,120,0.1)' : 'rgba(245,158,11,0.1)',
                            color: isRevenue ? '#00c878' : '#f59e0b',
                            border: `1px solid ${isRevenue ? 'rgba(0,200,120,0.2)' : 'rgba(245,158,11,0.2)'}`,
                          }}>
                            {t.category}
                          </span>
                        </td>
                        {/* Status */}
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: isPaid ? 'rgba(0,200,120,0.12)' : 'rgba(245,158,11,0.12)',
                            color: isPaid ? '#00c878' : '#f59e0b',
                          }}>
                            <span style={{
                              width: '5px', height: '5px', borderRadius: '50%',
                              background: isPaid ? '#00c878' : '#f59e0b',
                            }} />
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <span style={{ color: '#64748b', fontSize: '13px' }}>
            Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              style={pageBtn(pagination.page <= 1)}
            >
              ← Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(7, pagination.totalPages) }, (_, i) => {
              let page: number;
              if (pagination.totalPages <= 7) page = i + 1;
              else if (pagination.page <= 4) page = i + 1;
              else if (pagination.page >= pagination.totalPages - 3) page = pagination.totalPages - 6 + i;
              else page = pagination.page - 3 + i;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={pageBtn(false, page === pagination.page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              style={pageBtn(pagination.page >= pagination.totalPages)}
            >
              Next →
            </button>
          </div>

          {/* Rows per page */}
          <select
            value={filters.limit || 10}
            onChange={(e) => onFilterChange({ ...filters, limit: parseInt(e.target.value), page: 1 })}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#f1f5f9',
              fontSize: '12px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {[10, 20, 50].map((n) => <option key={n} value={n}>{n} / page</option>)}
          </select>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};

const pageBtn = (disabled: boolean, active = false): React.CSSProperties => ({
  padding: '6px 12px',
  borderRadius: '8px',
  border: `1px solid ${active ? '#00c878' : 'rgba(255,255,255,0.1)'}`,
  background: active ? 'rgba(0,200,120,0.15)' : disabled ? 'transparent' : 'rgba(255,255,255,0.04)',
  color: active ? '#00c878' : disabled ? '#334155' : '#94a3b8',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '13px',
  fontWeight: active ? 600 : 400,
  transition: 'all 0.15s',
  minWidth: '32px',
});

export default TransactionTable;
