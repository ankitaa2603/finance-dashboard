import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TransactionTable from './components/TransactionTable';
import Insights from './components/Insights';
import { getInsights, buildCategoryData, computeSummary } from './utils/helpers';
import { useMemo } from 'react';

function InsightsPage() {
  const { transactions } = useApp();
  const insights = useMemo(() => getInsights(transactions), [transactions]);
  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-primary">Insights</h1>
        <p className="text-sm text-secondary mt-0.5">Smart analysis of your finances</p>
      </div>
      <div className="max-w-2xl">
        <Insights insights={insights} />
      </div>
    </div>
  );
}

function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-primary">Transactions</h1>
        <p className="text-sm text-secondary mt-0.5">All your financial activity</p>
      </div>
      <TransactionTable />
    </div>
  );
}

function AppContent() {
  const { activeTab } = useApp();

  const pages = {
    dashboard: <Dashboard />,
    transactions: <TransactionsPage />,
    insights: <InsightsPage />,
  };

  return (
    <div className="flex min-h-screen bg-primary">
      <Sidebar />
      <main className="flex-1 min-w-0 lg:pt-0 pt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          {pages[activeTab] || <Dashboard />}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
