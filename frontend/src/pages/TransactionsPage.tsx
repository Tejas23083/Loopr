import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Download } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import FilterBar from '../components/transactions/FilterBar';
import TransactionTable from '../components/transactions/TransactionTable';
import ExportModal from '../components/transactions/ExportModal';
import { Transaction, Pagination, TransactionFilters } from '../types';
import { getTransactions } from '../api/transactions';
import { useAlert } from '../context/AlertContext';

const DEFAULT_FILTERS: TransactionFilters = {
  page: 1,
  limit: 10,
  sortBy: 'date',
  sortOrder: 'desc',
};

const TransactionsPage: React.FC = () => {
  const { addAlert } = useAlert();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [showExport, setShowExport] = useState(false);

  // debounce search
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadTransactions = useCallback(async (f: TransactionFilters) => {
    setIsLoading(true);
    try {
      const resp = await getTransactions(f);
      setTransactions(resp.data);
      setPagination(resp.pagination);
    } catch {
      addAlert('error', 'Failed to load transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [addAlert]);

  useEffect(() => {
    loadTransactions(filters);
  }, [filters, loadTransactions]);

  const handleFilterChange = (newFilters: TransactionFilters) => {
    if (newFilters.search !== filters.search) {
      // Debounce search
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => {
        setFilters(newFilters);
      }, 400);
    } else {
      setFilters(newFilters);
    }
  };

  const handleTopBarSearch = (query: string) => {
    handleFilterChange({ ...filters, search: query, page: 1 });
  };

  return (
    <DashboardLayout title="Transactions" onSearch={handleTopBarSearch}>
      <div style={{
        background: '#1a2234',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '24px',
      }}>
        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: 700, margin: 0 }}>All Transactions</h2>
            {pagination && (
              <p style={{ color: '#475569', fontSize: '13px', margin: '4px 0 0' }}>
                {pagination.total.toLocaleString()} records found
              </p>
            )}
          </div>
          <button
            onClick={() => setShowExport(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #00c878, #00a060)',
              border: 'none', borderRadius: '10px',
              color: 'white', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,200,120,0.3)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(0,200,120,0.4)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(0,200,120,0.3)';
            }}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Filter bar */}
        <FilterBar filters={filters} onChange={handleFilterChange} />

        {/* Table */}
        <TransactionTable
          transactions={transactions}
          pagination={pagination}
          filters={filters}
          isLoading={isLoading}
          onFilterChange={setFilters}
        />
      </div>

      {/* Export modal */}
      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          currentFilters={filters}
        />
      )}
    </DashboardLayout>
  );
};

export default TransactionsPage;
