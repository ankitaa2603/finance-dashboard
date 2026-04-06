import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { INITIAL_TRANSACTIONS } from '../data/mockData';
import { generateId } from '../utils/helpers';

const AppContext = createContext(null);

// ── Storage helpers ──────────────────────────────────────────────────────────
const STORAGE_KEY = 'finflow_transactions';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// ── Reducer ──────────────────────────────────────────────────────────────────
function transactionsReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [{ ...action.payload, id: generateId() }, ...state];
    case 'UPDATE':
      return state.map(tx => tx.id === action.payload.id ? { ...tx, ...action.payload } : tx);
    case 'DELETE':
      return state.filter(tx => tx.id !== action.id);
    case 'RESET':
      return INITIAL_TRANSACTIONS;
    default:
      return state;
  }
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [transactions, dispatch] = useReducer(
    transactionsReducer,
    null,
    () => loadFromStorage() ?? INITIAL_TRANSACTIONS,
  );

  const [role, setRole] = useState(() => {
    return localStorage.getItem('finflow_role') ?? 'admin';
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('finflow_dark');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    sortField: 'date',
    sortDir: 'desc',
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  // Persist transactions
  useEffect(() => {
    saveToStorage(transactions);
  }, [transactions]);

  // Persist role
  useEffect(() => {
    localStorage.setItem('finflow_role', role);
  }, [role]);

  // Persist & apply dark mode
  useEffect(() => {
    localStorage.setItem('finflow_dark', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addTransaction = (data) => dispatch({ type: 'ADD', payload: data });
  const updateTransaction = (data) => dispatch({ type: 'UPDATE', payload: data });
  const deleteTransaction = (id) => dispatch({ type: 'DELETE', id });
  const resetData = () => dispatch({ type: 'RESET' });

  const isAdmin = role === 'admin';

  return (
    <AppContext.Provider value={{
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      resetData,
      role,
      setRole,
      isAdmin,
      darkMode,
      setDarkMode,
      filters,
      setFilters,
      activeTab,
      setActiveTab,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
