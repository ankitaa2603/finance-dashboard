import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Zap } from 'lucide-react';

const typeConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    iconColor: 'text-emerald-500',
    valueColor: 'text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800/50',
    iconColor: 'text-amber-500',
    valueColor: 'text-amber-600 dark:text-amber-400',
  },
  danger: {
    icon: TrendingDown,
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800/50',
    iconColor: 'text-red-500',
    valueColor: 'text-red-600 dark:text-red-400',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800/50',
    iconColor: 'text-blue-500',
    valueColor: 'text-blue-600 dark:text-blue-400',
  },
};

function InsightCard({ insight, delay = 0 }) {
  const config = typeConfig[insight.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`rounded-xl p-4 border animate-slide-up ${config.bg} ${config.border}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${config.iconColor}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-secondary mb-0.5">{insight.title}</p>
          <p className={`text-base font-bold font-mono ${config.valueColor}`}>{insight.value}</p>
          <p className="text-xs text-muted mt-0.5 leading-relaxed">{insight.detail}</p>
        </div>
      </div>
    </div>
  );
}

export default function Insights({ insights }) {
  if (!insights.length) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-accent" />
          <h3 className="font-semibold text-primary">Smart Insights</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-sm text-muted">Add transactions to see insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} className="text-accent" />
        <h3 className="font-semibold text-primary">Smart Insights</h3>
        <span className="ml-auto text-xs text-muted">Auto-generated</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
        {insights.map((insight, i) => (
          <InsightCard key={insight.id} insight={insight} delay={i * 80} />
        ))}
      </div>
    </div>
  );
}
