import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Area, AreaChart,
} from 'recharts';
import { MonthlyData } from '../../types';

interface Props {
  data: MonthlyData[];
  isLoading: boolean;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1e2a3a',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 8px', fontWeight: 500 }}>{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color }} />
          <span style={{ color: '#cbd5e1', fontSize: '13px', textTransform: 'capitalize' }}>{entry.name}:</span>
          <span style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>
            ${entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const OverviewChart: React.FC<Props> = ({ data, isLoading }) => {
  const [period, setPeriod] = useState<'Monthly' | 'Quarterly'>('Monthly');

  const chartData = period === 'Quarterly'
    ? [
        { month: 'Q1', revenue: data.slice(0, 3).reduce((s, d) => s + d.revenue, 0), expenses: data.slice(0, 3).reduce((s, d) => s + d.expenses, 0) },
        { month: 'Q2', revenue: data.slice(3, 6).reduce((s, d) => s + d.revenue, 0), expenses: data.slice(3, 6).reduce((s, d) => s + d.expenses, 0) },
        { month: 'Q3', revenue: data.slice(6, 9).reduce((s, d) => s + d.revenue, 0), expenses: data.slice(6, 9).reduce((s, d) => s + d.expenses, 0) },
        { month: 'Q4', revenue: data.slice(9, 12).reduce((s, d) => s + d.revenue, 0), expenses: data.slice(9, 12).reduce((s, d) => s + d.expenses, 0) },
      ]
    : data;

  return (
    <div style={{
      background: '#1a2234',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '16px',
      padding: '24px',
      flex: 1,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 600, margin: 0 }}>Overview</h3>
          <p style={{ color: '#475569', fontSize: '12px', margin: '4px 0 0' }}>Revenue vs Expenses trend</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00c878' }} />
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>Income</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>Expenses</span>
          </div>
          {/* Period toggle */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'Monthly' | 'Quarterly')}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#f1f5f9',
              padding: '5px 10px',
              fontSize: '12px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00c878" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#00c878" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#475569', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#00c878"
              strokeWidth={2.5}
              fill="url(#colorRevenue)"
              dot={false}
              activeDot={{ r: 5, fill: '#00c878', strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fill="url(#colorExpenses)"
              dot={false}
              activeDot={{ r: 5, fill: '#f59e0b', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

// Suppress unused import warning
void LineChart; void Line; void Legend;

export default OverviewChart;
