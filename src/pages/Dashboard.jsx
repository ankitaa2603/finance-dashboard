import React, { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SummaryCard from '../components/SummaryCard';
import { BalanceChart, ExpensePieChart } from '../components/Charts';
import Insights from '../components/Insights';
import TransactionTable from '../components/TransactionTable';
import {
  computeSummary,
  buildMonthlyChartData,
  buildCategoryData,
  getInsights,
  percentChange,
} from '../utils/helpers';

export default function Dashboard() {
  const { transactions } = useApp();

  const summary = useMemo(() => computeSummary(transactions), [transactions]);
  const monthlyData = useMemo(() => buildMonthlyChartData(transactions), [transactions]);
  const categoryData = useMemo(() => buildCategoryData(transactions), [transactions]);
  const insights = useMemo(() => getInsights(transactions), [transactions]);

  // Trend vs previous month
  const trends = useMemo(() => {
    if (monthlyData.length < 2) return { balance: 0, income: 0, expenses: 0 };
    const prev = monthlyData[monthlyData.length - 2];
    const curr = monthlyData[monthlyData.length - 1];
    return {
      balance: percentChange(prev.balance, curr.balance),
      income: percentChange(prev.income, curr.income),
      expenses: percentChange(prev.expenses, curr.expenses),
    };
  }, [monthlyData]);

  const cards = [
    {
      title: 'Total Balance',
      amount: summary.balance,
      icon: Wallet,
      iconBg: '#0c90e1',
      trend: trends.balance,
      trendLabel: 'vs previous month',
      delay: 0,
    },
    {
      title: 'Total Income',
      amount: summary.income,
      icon: TrendingUp,
      iconBg: '#059669',
      trend: trends.income,
      trendLabel: 'vs previous month',
      delay: 80,
    },
    {
      title: 'Total Expenses',
      amount: summary.expenses,
      icon: TrendingDown,
      iconBg: '#dc2626',
      trend: -trends.expenses,  // invert: expense up is bad
      trendLabel: 'vs previous month',
      delay: 160,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-primary">Overview</h1>
        <p className="text-sm text-secondary mt-0.5">Your complete financial snapshot</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(card => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <BalanceChart data={monthlyData} />
        </div>
        <div>
          <ExpensePieChart data={categoryData} />
        </div>
      </div>

      {/* Insights + Recent Transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <TransactionTable />
        </div>
        <div>
          <Insights insights={insights} />
        </div>
      </div>
    </div>
  );
}
