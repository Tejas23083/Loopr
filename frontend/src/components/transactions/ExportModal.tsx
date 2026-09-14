import React, { useState } from 'react';
import { X, Download, FileText, Check, Loader } from 'lucide-react';
import { TransactionFilters } from '../../types';
import { exportCSV } from '../../api/transactions';
import { useAlert } from '../../context/AlertContext';

interface Props {
  onClose: () => void;
  currentFilters: TransactionFilters;
}

const COLUMNS = [
  { key: 'id', label: 'Transaction ID', description: 'Unique numeric identifier' },
  { key: 'date', label: 'Date', description: 'Transaction date (YYYY-MM-DD)' },
  { key: 'amount', label: 'Amount', description: 'Transaction amount in USD' },
  { key: 'category', label: 'Category', description: 'Revenue or Expense' },
  { key: 'status', label: 'Status', description: 'Paid or Pending' },
  { key: 'user_id', label: 'User ID', description: 'Associated user identifier' },
];

const ExportModal: React.FC<Props> = ({ onClose, currentFilters }) => {
  const { addAlert } = useAlert();
  const [selected, setSelected] = useState<string[]>(COLUMNS.map((c) => c.key));
  const [useCurrentFilters, setUseCurrentFilters] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const toggleColumn = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleAll = () => {
    setSelected(selected.length === COLUMNS.length ? [] : COLUMNS.map((c) => c.key));
  };

  const handleExport = async () => {
    if (selected.length === 0) {
      addAlert('warning', 'Please select at least one column to export.');
      return;
    }
    setIsExporting(true);
    try {
      const filters = useCurrentFilters ? currentFilters : {};
      await exportCSV(selected, filters);
      addAlert('success', 'CSV exported successfully! Your download has started.');
      onClose();
    } catch {
      addAlert('error', 'Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const activeFilterCount = Object.entries(currentFilters).filter(
    ([k, v]) => !['page', 'limit', 'sortBy', 'sortOrder'].includes(k) && v
  ).length;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1001,
        width: '520px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#1a2234',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        animation: 'modalIn 0.25s ease',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 24px 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'rgba(0,200,120,0.12)',
              border: '1px solid rgba(0,200,120,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FileText size={20} color="#00c878" />
            </div>
            <div>
              <h2 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: 700, margin: 0 }}>Export CSV</h2>
              <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0 0' }}>Configure your report export</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px 24px 24px' }}>

          {/* Column selector header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <h3 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600, margin: 0 }}>Select Columns</h3>
              <p style={{ color: '#475569', fontSize: '12px', margin: '2px 0 0' }}>
                {selected.length} of {COLUMNS.length} columns selected
              </p>
            </div>
            <button
              onClick={toggleAll}
              style={{
                background: 'rgba(0,200,120,0.08)',
                border: '1px solid rgba(0,200,120,0.2)',
                borderRadius: '8px',
                color: '#00c878', fontSize: '12px', fontWeight: 600,
                padding: '5px 12px', cursor: 'pointer',
              }}
            >
              {selected.length === COLUMNS.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {/* Column grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '8px', marginBottom: '20px',
          }}>
            {COLUMNS.map(({ key, label, description }) => {
              const isSelected = selected.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleColumn(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 14px',
                    background: isSelected ? 'rgba(0,200,120,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isSelected ? 'rgba(0,200,120,0.3)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '5px',
                    border: `2px solid ${isSelected ? '#00c878' : '#475569'}`,
                    background: isSelected ? '#00c878' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.15s',
                  }}>
                    {isSelected && <Check size={11} color="black" strokeWidth={3} />}
                  </div>
                  <div>
                    <p style={{ color: isSelected ? '#f1f5f9' : '#94a3b8', fontSize: '13px', fontWeight: 500, margin: 0 }}>
                      {label}
                    </p>
                    <p style={{ color: '#475569', fontSize: '11px', margin: '2px 0 0' }}>
                      {description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Filter scope */}
          <div style={{
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            marginBottom: '20px',
          }}>
            <h4 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600, margin: '0 0 10px' }}>
              Export Scope
            </h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '8px' }}>
              <div
                onClick={() => setUseCurrentFilters(true)}
                style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  border: `2px solid ${useCurrentFilters ? '#00c878' : '#475569'}`,
                  background: useCurrentFilters ? '#00c878' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.15s', cursor: 'pointer',
                }}
              >
                {useCurrentFilters && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'black' }} />}
              </div>
              <div>
                <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>Apply current filters</span>
                {activeFilterCount > 0 && (
                  <span style={{
                    marginLeft: '8px', background: 'rgba(0,200,120,0.12)',
                    border: '1px solid rgba(0,200,120,0.2)', borderRadius: '10px',
                    color: '#00c878', fontSize: '11px', padding: '1px 7px',
                  }}>
                    {activeFilterCount} active
                  </span>
                )}
              </div>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div
                onClick={() => setUseCurrentFilters(false)}
                style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  border: `2px solid ${!useCurrentFilters ? '#00c878' : '#475569'}`,
                  background: !useCurrentFilters ? '#00c878' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.15s', cursor: 'pointer',
                }}
              >
                {!useCurrentFilters && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'black' }} />}
              </div>
              <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>Export all transactions</span>
            </label>
          </div>

          {/* Preview info */}
          <div style={{
            padding: '12px 14px',
            background: 'rgba(59,130,246,0.06)',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '12px',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Download size={14} color="#3b82f6" />
            File will download automatically as <strong style={{ color: '#f1f5f9' }}>transactions_{new Date().toISOString().split('T')[0]}.csv</strong>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', color: '#94a3b8',
                fontSize: '14px', cursor: 'pointer', fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || selected.length === 0}
              style={{
                flex: 2, padding: '12px',
                background: selected.length === 0 ? 'rgba(0,200,120,0.3)' : 'linear-gradient(135deg, #00c878, #00a060)',
                border: 'none', borderRadius: '10px', color: 'white',
                fontSize: '14px', fontWeight: 600,
                cursor: isExporting || selected.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: selected.length > 0 ? '0 4px 16px rgba(0,200,120,0.3)' : 'none',
              }}
            >
              {isExporting ? (
                <>
                  <Loader size={16} style={{ animation: 'spin 0.7s linear infinite' }} />
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Export {selected.length} Column{selected.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translate(-50%, -52%) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default ExportModal;
