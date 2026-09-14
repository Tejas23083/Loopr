import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AlertChips from './components/common/AlertChips';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import PlaceholderPage from './pages/PlaceholderPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AlertProvider>
        <AuthProvider>
          <AlertChips />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/wallet"    element={<ProtectedRoute><PlaceholderPage title="Wallet" /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><PlaceholderPage title="Analytics" /></ProtectedRoute>} />
            <Route path="/personal"  element={<ProtectedRoute><PlaceholderPage title="Personal" /></ProtectedRoute>} />
            <Route path="/message"   element={<ProtectedRoute><PlaceholderPage title="Message" /></ProtectedRoute>} />
            <Route path="/setting"   element={<ProtectedRoute><PlaceholderPage title="Setting" /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </AlertProvider>
    </BrowserRouter>
  );
};

export default App;
