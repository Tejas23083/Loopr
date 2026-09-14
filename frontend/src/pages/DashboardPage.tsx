import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import SummaryCards from '../components/dashboard/SummaryCards';
import OverviewChart from '../components/dashboard/OverviewChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { AnalyticsSummary, MonthlyData, Transaction } from '../types';
import { getSummary, getMonthlyData, getRecentTransactions } from '../api/analytics';
import { useAlert } from '../context/AlertContext';

const DashboardPage: React.FC = () => {
  const { addAlert } = useAlert();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [recentTxns, setRecentTxns] = useState<Transaction[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);

  const loadData = useCallback(async () => {
    // Load all in parallel
    const [summaryResult, chartResult, recentResult] = await Promise.allSettled([
      getSummary(),
      getMonthlyData(2024),
      getRecentTransactions(),
    ]);

    if (summaryResult.status === 'fulfilled') {
      setSummary(summaryResult.value);
    } else {
      addAlert('error', 'Failed to load summary metrics.');
    }
    setIsLoadingSummary(false);

    if (chartResult.status === 'fulfilled') {
      setMonthlyData(chartResult.value);
    } else {
      addAlert('error', 'Failed to load chart data.');
    }
    setIsLoadingChart(false);

    if (recentResult.status === 'fulfilled') {
      setRecentTxns(recentResult.value);
    } else {
      addAlert('error', 'Failed to load recent transactions.');
    }
    setIsLoadingRecent(false);
  }, [addAlert]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <DashboardLayout title="Dashboard">
      {/* Summary cards */}
      <SummaryCards summary={summary} isLoading={isLoadingSummary} />

      {/* Chart + Recent panel */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <OverviewChart data={monthlyData} isLoading={isLoadingChart} />
        <RecentTransactions transactions={recentTxns} isLoading={isLoadingRecent} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
