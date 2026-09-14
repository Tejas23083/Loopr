import api from './axios';
import { AnalyticsSummary, MonthlyData, Transaction } from '../types';

export const getSummary = async (): Promise<AnalyticsSummary> => {
  const { data } = await api.get<{ success: boolean; data: AnalyticsSummary }>('/analytics/summary');
  return data.data;
};

export const getMonthlyData = async (year?: number): Promise<MonthlyData[]> => {
  const params = year ? { year } : {};
  const { data } = await api.get<{ success: boolean; data: MonthlyData[] }>('/analytics/monthly', { params });
  return data.data;
};

export const getRecentTransactions = async (): Promise<Transaction[]> => {
  const { data } = await api.get<{ success: boolean; data: Transaction[] }>('/analytics/recent');
  return data.data;
};
