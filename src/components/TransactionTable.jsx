import React, { useState, useMemo } from 'react';
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown,
  Edit2, Trash2, Plus, Filter, SlidersHorizontal,
} from 'lucide-react';
import { CATEGORIES, CATEGORY_COLORS } from '../data/mockData';
import { formatCurrency, formatDate, filterTransactions, sortTransactions } from '../utils/helpers';
import { useApp } from '../context/AppContext';
import Modal from './Modal';

function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] || '#94a3b8';
  return (
    <span
      className="badge text-white"
      style={{ backgroundColor: color + 'cc' }}
    >
      {category}
    </span>
  );
}

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) return <ChevronsUpDown size={13} className="text-muted" />;
  return sortDir === 'asc'
    ? <ChevronUp size={13} className="text-accent" />
    : <ChevronDown size={13} className="text-accent" />;
}

function ConfirmDelete({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="card p-6 max-w-sm w-full animate-scale-in text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-red-500" />
        </div>
        <h3 className="font-semibold text-primary mb-1">Delete Transaction?</h3>
        <p className="text-sm text-secondary mb-5">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="btn-ghost flex-1 justify-center border border-themed py-2">Cancel</button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TransactionTable() {
  const { transactions, deleteTransaction, isAdmin, filters, setFilters } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const { search, type, category, sortField, sortDir } = filters;

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortField: field,
      sortDir: prev.sortField === field && prev.sortDir === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filtered = useMemo(() => {
    const f = filterTransactions(transactions, { search, type, category });
    return sortTransactions(f, sortField, sortDir);
  }, [transactions, search, type, category, sortField, sortDir]);

  const handleEdit = (tx) => {
    setEditingTx(tx);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTx(null);
    setModalOpen(true);
  };

  const handleDelete = (id) => setDeletingId(id);
  const confirmDelete = () => {
    deleteTransaction(deletingId);
    setDeletingId(null);
  };

  const clearFilters = () => {
    setFilters(prev => ({ ...prev, search: '', type: 'all', category: 'all' }));
  };

  const hasActiveFilters = search || type !== 'all' || category !== 'all';

  return (
    <>
      <div className="card overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-themed flex flex-col sm:flex-row sm:items-center gap-3">
          <div>
            <h3 className="font-semibold text-primary">Transactions</h3>
            <p className="text-xs text-muted mt-0.5">{filtered.length} of {transactions.length} entries</p>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <button
              onClick={() => setShowFilters(p => !p)}
              className={`btn-ghost border border-themed py-2 px-3 ${showFilters ? 'text-accent bg-accent-light' : ''}`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent ml-1" />
              )}
            </button>
            {isAdmin && (
              <button onClick={handleAdd} className="btn-primary py-2">
                <Plus size={14} />
                <span className="hidden sm:inline">Add</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Filters */}
        <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-40' : 'max-h-0'}`}>
          <div className="px-6 py-3 border-b border-themed bg-primary flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                className="input-field pl-9 py-2"
              />
            </div>
            <select
              value={type}
              onChange={e => setFilters(p => ({ ...p, type: e.target.value }))}
              className="input-field py-2 sm:w-32"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              value={category}
              onChange={e => setFilters(p => ({ ...p, category: e.target.value }))}
              className="input-field py-2 sm:w-44"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-ghost text-xs border border-themed py-2 px-3 whitespace-nowrap">
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState hasFilters={hasActiveFilters} onClear={clearFilters} />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-themed">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wide">
                    <button
                      onClick={() => handleSort('date')}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Date <SortIcon field="date" sortField={sortField} sortDir={sortDir} />
                    </button>
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wide">Description</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wide hidden md:table-cell">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wide hidden sm:table-cell">Type</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wide">
                    <button
                      onClick={() => handleSort('amount')}
                      className="flex items-center gap-1 ml-auto hover:text-primary transition-colors"
                    >
                      Amount <SortIcon field="amount" sortField={sortField} sortDir={sortDir} />
                    </button>
                  </th>
                  {isAdmin && (
                    <th className="text-right px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wide">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, i) => (
                  <tr
                    key={tx.id}
                    className="border-b border-subtle hover:bg-primary transition-colors duration-150 group animate-fade-in"
                    style={{ animationDelay: `${Math.min(i * 30, 200)}ms` }}
                  >
                    <td className="px-6 py-3.5 text-secondary text-xs font-mono whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-medium text-primary">{tx.description}</span>
                    </td>
                    <td className="px-6 py-3.5 hidden md:table-cell">
                      <CategoryBadge category={tx.category} />
                    </td>
                    <td className="px-6 py-3.5 hidden sm:table-cell">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        tx.type === 'income'
                          ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30'
                          : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30'
                      }`}>
                        {tx.type === 'income' ? '↑ Income' : '↓ Expense'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className={`font-mono font-semibold ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button
                            onClick={() => handleEdit(tx)}
                            className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/30 text-muted hover:text-blue-500 transition-colors duration-150"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-muted hover:text-red-500 transition-colors duration-150"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTx(null); }}
        transaction={editingTx}
      />

      {deletingId && (
        <ConfirmDelete
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </>
  );
}

function EmptyState({ hasFilters, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center mb-4">
        <Search size={24} className="text-accent opacity-60" />
      </div>
      <h4 className="font-semibold text-primary mb-1">
        {hasFilters ? 'No results found' : 'No transactions yet'}
      </h4>
      <p className="text-sm text-muted max-w-xs">
        {hasFilters
          ? 'Try adjusting your search or filter criteria'
          : 'Add your first transaction to get started'
        }
      </p>
      {hasFilters && (
        <button onClick={onClear} className="mt-4 btn-ghost border border-themed px-4 py-2 text-sm">
          Clear filters
        </button>
      )}
    </div>
  );
}
