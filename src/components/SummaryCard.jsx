import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export default function SummaryCard({ title, amount, icon: Icon, iconBg, trend, trendLabel, delay = 0 }) {
  const isPositive = trend >= 0;

  return (
    <div
      className="card p-6 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={20} style={{ color: 'white' }} />
        </div>

        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
          isPositive ? 'stat-trend-up' : 'stat-trend-down'
        }`}>
          {isPositive
            ? <TrendingUp size={12} />
            : <TrendingDown size={12} />
          }
          {Math.abs(trend).toFixed(1)}%
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-secondary mb-1">{title}</p>
        <p className="text-2xl font-bold text-primary font-mono tracking-tight">
          {formatCurrency(amount)}
        </p>
        <p className="text-xs text-muted mt-1">{trendLabel}</p>
      </div>
    </div>
  );
}
