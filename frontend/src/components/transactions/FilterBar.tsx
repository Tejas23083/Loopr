import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { TransactionFilters } from '../../types';

interface Props {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '9px 12px',
  color: '#f1f5f9',
  fontSize: '13px',
  outline: 'none',
};

const FilterBar: React.FC<Props> = ({ filters, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (key: keyof TransactionFilters, value: string) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const hasActiveFilters = !!(
    filters.category || filters.status || filters.user_id ||
    filters.dateFrom || filters.dateTo || filters.minAmount || filters.maxAmount
  );

  const clearAll = () => onChange({ search: filters.search, page: 1, limit: filters.limit, sortBy: filters.sortBy, sortOrder: filters.sortOrder });

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Main row */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => update('search', e.target.value)}
            placeholder="Search for anything..."
            style={{ ...inputStyle, width: '100%', paddingLeft: '36px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Category */}
        <select
          value={filters.category || ''}
          onChange={(e) => update('category', e.target.value)}
          style={{ ...inputStyle, minWidth: '130px', cursor: 'pointer' }}
        >
          <option value="">All Categories</option>
          <option value="Revenue">Revenue</option>
          <option value="Expense">Expense</option>
        </select>

        {/* Status */}
        <select
          value={filters.status || ''}
          onChange={(e) => update('status', e.target.value)}
          style={{ ...inputStyle, minWidth: '120px', cursor: 'pointer' }}
        >
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 14px',
            background: showAdvanced ? 'rgba(0,200,120,0.1)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${showAdvanced ? '#00c878' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '10px',
            color: showAdvanced ? '#00c878' : '#94a3b8',
            fontSize: '13px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <Filter size={14} />
          Filters {hasActiveFilters && <span style={{ background: '#00c878', color: 'black', borderRadius: '10px', fontSize: '10px', padding: '0 6px', fontWeight: 700 }}>ON</span>}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 14px', background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px',
              color: '#ef4444', fontSize: '13px', cursor: 'pointer',
            }}
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '12px',
          marginTop: '12px',
          padding: '16px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px',
        }}>
          <div>
            <label style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              User ID
            </label>
            <select
              value={filters.user_id || ''}
              onChange={(e) => update('user_id', e.target.value)}
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', cursor: 'pointer' }}
            >
              <option value="">All Users</option>
              {['user_001', 'user_002', 'user_003', 'user_004'].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => update('dateFrom', e.target.value)}
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', colorScheme: 'dark' }}
            />
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => update('dateTo', e.target.value)}
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', colorScheme: 'dark' }}
            />
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Min Amount ($)
            </label>
            <input
              type="number"
              value={filters.minAmount || ''}
              onChange={(e) => update('minAmount', e.target.value)}
              placeholder="0"
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Max Amount ($)
            </label>
            <input
              type="number"
              value={filters.maxAmount || ''}
              onChange={(e) => update('maxAmount', e.target.value)}
              placeholder="99999"
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
