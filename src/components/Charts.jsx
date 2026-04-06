import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart,
} from 'recharts';
import { CATEGORY_COLORS } from '../data/mockData';
import { formatCompact, formatCurrency } from '../utils/helpers';
import { useApp } from '../context/AppContext';

// ── Custom Tooltip for Line Chart ────────────────────────────────────────────
function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-4 py-3 text-sm" style={{ minWidth: 160 }}>
      <p className="font-semibold text-primary mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-secondary capitalize">{p.dataKey}</span>
          </span>
          <span className="font-mono font-medium text-primary">{formatCompact(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Custom Tooltip for Pie Chart ─────────────────────────────────────────────
function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="card px-4 py-3 text-sm">
      <p className="font-semibold text-primary">{name}</p>
      <p className="font-mono font-medium text-accent mt-1">{formatCurrency(value)}</p>
    </div>
  );
}

// ── Custom Legend ─────────────────────────────────────────────────────────────
function CustomLegend({ payload }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-3">
      {payload.map(entry => (
        <div key={entry.value} className="flex items-center gap-1.5 text-xs text-secondary">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.value}
        </div>
      ))}
    </div>
  );
}

// ── Line Chart View ───────────────────────────────────────────────────────────
export function BalanceChart({ data }) {
  const { darkMode } = useApp();
  const gridColor = darkMode ? '#1e2d45' : '#f1f5f9';
  const textColor = darkMode ? '#64748b' : '#94a3b8';

  const [activeLines, setActiveLines] = useState({
    balance: true,
    income: true,
    expenses: true,
  });

  const toggleLine = (key) =>
    setActiveLines(prev => ({ ...prev, [key]: !prev[key] }));

  const lines = [
    { key: 'balance',  color: '#0c90e1', label: 'Balance' },
    { key: 'income',   color: '#10b981', label: 'Income'  },
    { key: 'expenses', color: '#ef4444', label: 'Expenses' },
  ];

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-semibold text-primary">Financial Overview</h3>
          <p className="text-xs text-muted mt-0.5">Monthly balance, income & expenses</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {lines.map(({ key, color, label }) => (
            <button
              key={key}
              onClick={() => toggleLine(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 border ${
                activeLines[key]
                  ? 'border-transparent text-white'
                  : 'border-themed bg-transparent text-secondary'
              }`}
              style={activeLines[key] ? { backgroundColor: color } : {}}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeLines[key] ? 'white' : color }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyChart />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              {lines.map(({ key, color }) => (
                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: textColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: textColor }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCompact}
            />
            <Tooltip content={<LineTooltip />} />
            {lines.map(({ key, color }) =>
              activeLines[key] ? (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2.5}
                  fill={`url(#grad-${key})`}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              ) : null
            )}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ── Pie Chart View ────────────────────────────────────────────────────────────
export function ExpensePieChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const colors = data.map(d => CATEGORY_COLORS[d.name] || '#94a3b8');

  return (
    <div className="card p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="font-semibold text-primary">Expense Breakdown</h3>
        <p className="text-xs text-muted mt-0.5">Spending by category</p>
      </div>

      {data.length === 0 ? (
        <EmptyChart />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={colors[i]}
                    opacity={activeIndex === null || activeIndex === i ? 1 : 0.5}
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Category list */}
          <div className="space-y-2 mt-2">
            {data.slice(0, 5).map((item, i) => {
              const total = data.reduce((s, d) => s + d.value, 0);
              const pct = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={item.name} className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i] }} />
                  <span className="text-xs text-secondary flex-1 truncate">{item.name}</span>
                  <span className="text-xs font-mono text-muted">{pct}%</span>
                  <span className="text-xs font-mono font-medium text-primary">{formatCompact(item.value)}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-48 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center mb-3">
        <span className="text-xl">📊</span>
      </div>
      <p className="text-sm text-muted">No data to display yet</p>
    </div>
  );
}
