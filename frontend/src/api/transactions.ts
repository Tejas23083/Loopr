import api from './axios';
import { Transaction, Pagination, TransactionFilters } from '../types';

export interface TransactionsResponse {
  success: boolean;
  data: Transaction[];
  pagination: Pagination;
}

export const getTransactions = async (
  filters: TransactionFilters = {}
): Promise<TransactionsResponse> => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
  );
  const { data } = await api.get<TransactionsResponse>('/transactions', { params });
  return data;
};

export const exportCSV = async (
  columns: string[],
  filters: TransactionFilters = {}
): Promise<void> => {
  const response = await api.post(
    '/transactions/export/csv',
    { columns, filters },
    { responseType: 'blob' }
  );

  const blob = new Blob([response.data], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const today = new Date().toISOString().split('T')[0];
  link.download = `transactions_${today}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
