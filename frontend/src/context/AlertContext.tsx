import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertMessage } from '../types';

interface AlertContextType {
  alerts: AlertMessage[];
  addAlert: (type: AlertMessage['type'], message: string) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const addAlert = useCallback((type: AlertMessage['type'], message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setAlerts((prev) => [...prev, { id, type, message }]);
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 5000);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within AlertProvider');
  return context;
};
