import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

/**
 * Format a number as Indian Rupees
 */
export function formatCurrency(amount) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number compactly
 */
export function formatCompact(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

/**
 * Format a date string to human-readable
 */
export function formatDate(dateStr) {
  return format(parseISO(dateStr), 'dd MMM yyyy');
}

/**
 * Format date for display in table
 */
export function formatDateShort(dateStr) {
  return format(parseISO(dateStr), 'dd MMM');
}

/**
 * Get transactions for a specific month
 */
export function getTransactionsForMonth(transactions, year, month) {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));
  return transactions.filter(tx => {
    const date = parseISO(tx.date);
    return isWithinInterval(date, { start, end });
  });
}

/**
 * Compute summary: total income, expenses, balance
 */
export function computeSummary(transactions) {
  const income = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const expenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
  return {
    income,
    expenses,
    balance: income - expenses,
  };
}

/**
 * Build monthly data for line chart
 */
export function buildMonthlyChartData(transactions) {
  const monthMap = {};

  transactions.forEach(tx => {
    const key = format(parseISO(tx.date), 'MMM yy');
    if (!monthMap[key]) {
      monthMap[key] = { month: key, income: 0, expenses: 0, balance: 0, date: tx.date };
    }
    if (tx.type === 'income') {
      monthMap[key].income += tx.amount;
    } else {
      monthMap[key].expenses += tx.amount;
    }
  });

  return Object.values(monthMap)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(m => ({ ...m, balance: m.income - m.expenses }));
}

/**
 * Build category breakdown for pie chart
 */
export function buildCategoryData(transactions) {
  const catMap = {};
  transactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      catMap[tx.category] = (catMap[tx.category] || 0) + tx.amount;
    });

  return Object.entries(catMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Compute percent change between two values
 */
export function percentChange(prev, curr) {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return ((curr - prev) / prev) * 100;
}

/**
 * Generate a unique ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/**
 * Sort transactions by field and direction
 */
export function sortTransactions(transactions, field, direction) {
  return [...transactions].sort((a, b) => {
    let valA = a[field];
    let valB = b[field];
    if (field === 'date') {
      valA = new Date(valA);
      valB = new Date(valB);
    }
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Filter transactions by search, type, category
 */
export function filterTransactions(transactions, { search, type, category }) {
  return transactions.filter(tx => {
    const matchSearch =
      !search ||
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());
    const matchType = !type || type === 'all' || tx.type === type;
    const matchCat = !category || category === 'all' || tx.category === category;
    return matchSearch && matchType && matchCat;
  });
}

/**
 * Get insights from transactions
 */
export function getInsights(transactions) {
  if (!transactions.length) return [];

  const insights = [];

  // Highest spending category
  const catData = buildCategoryData(transactions);
  if (catData.length > 0) {
    const top = catData[0];
    insights.push({
      id: 'top-category',
      type: 'warning',
      title: 'Top Spending Category',
      value: top.name,
      detail: `${formatCurrency(top.value)} spent`,
    });
  }

  // Most recent large expense (> 10,000)
  const largeExpenses = transactions
    .filter(tx => tx.type === 'expense' && tx.amount >= 10000)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  if (largeExpenses.length > 0) {
    const le = largeExpenses[0];
    insights.push({
      id: 'large-expense',
      type: 'danger',
      title: 'Largest Recent Expense',
      value: formatCurrency(le.amount),
      detail: `${le.description} on ${formatDate(le.date)}`,
    });
  }

  // Month-over-month comparison (last two months with data)
  const monthlyData = buildMonthlyChartData(transactions);
  if (monthlyData.length >= 2) {
    const curr = monthlyData[monthlyData.length - 1];
    const prev = monthlyData[monthlyData.length - 2];
    const change = percentChange(prev.expenses, curr.expenses);
    insights.push({
      id: 'mom-change',
      type: change > 0 ? 'danger' : 'success',
      title: 'Expenses vs Last Month',
      value: `${change > 0 ? '+' : ''}${change.toFixed(1)}%`,
      detail: change > 0
        ? `Spending up from ${formatCompact(prev.expenses)}`
        : `Spending down from ${formatCompact(prev.expenses)}`,
    });
  }

  // Savings rate
  const summary = computeSummary(transactions);
  if (summary.income > 0) {
    const rate = ((summary.income - summary.expenses) / summary.income) * 100;
    insights.push({
      id: 'savings-rate',
      type: rate >= 20 ? 'success' : rate >= 10 ? 'warning' : 'danger',
      title: 'Overall Savings Rate',
      value: `${Math.max(0, rate).toFixed(1)}%`,
      detail: rate >= 20 ? 'Great savings habit!' : rate >= 10 ? 'Room to improve' : 'Consider cutting expenses',
    });
  }

  return insights;
}
