export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Transaction {
  _id: string;
  id: number;
  date: string;
  amount: number;
  category: 'Revenue' | 'Expense';
  status: 'Paid' | 'Pending';
  user_id: string;
  user_profile: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransactionFilters {
  search?: string;
  category?: string;
  status?: string;
  user_id?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: string;
  maxAmount?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalExpenses: number;
  balance: number;
  savings: number;
  transactionCount: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

export interface AlertMessage {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info';
  message: string;
}
