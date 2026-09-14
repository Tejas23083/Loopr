import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';

interface TopBarProps {
  title: string;
  onSearch?: (query: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ title, onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header style={{
      height: '64px',
      background: '#151b27',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      flexShrink: 0,
    }}>
      <h1 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700, margin: 0 }}>{title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search..."
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '8px 14px 8px 36px',
              color: '#f1f5f9',
              fontSize: '13px',
              width: '200px',
              outline: 'none',
            }}
          />
        </div>

        {/* Bell */}
        <button style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
        }}>
          <Bell size={16} color="#94a3b8" />
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#00c878',
          }} />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
