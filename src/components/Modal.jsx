import React, { useState, useEffect, useRef } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { useApp } from '../context/AppContext';

const EMPTY_FORM = {
  date: new Date().toISOString().split('T')[0],
  description: '',
  amount: '',
  type: 'expense',
  category: 'Food & Dining',
};

function validate(form) {
  const errors = {};
  if (!form.description.trim()) errors.description = 'Description is required';
  if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
    errors.amount = 'Enter a valid positive amount';
  if (!form.date) errors.date = 'Date is required';
  return errors;
}

export default function Modal({ isOpen, onClose, transaction = null }) {
  const { addTransaction, updateTransaction } = useApp();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);

  const isEdit = Boolean(transaction);

  useEffect(() => {
    if (isOpen) {
      setForm(transaction
        ? { ...transaction, amount: String(transaction.amount) }
        : EMPTY_FORM
      );
      setErrors({});
      setTimeout(() => firstInputRef.current?.focus(), 80);
    }
  }, [isOpen, transaction]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 300)); // simulate async
    const payload = { ...form, amount: Number(form.amount) };
    if (isEdit) updateTransaction(payload);
    else addTransaction(payload);
    setSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="card w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-themed">
          <div>
            <h2 className="font-semibold text-primary">{isEdit ? 'Edit Transaction' : 'New Transaction'}</h2>
            <p className="text-xs text-muted mt-0.5">{isEdit ? 'Update the details below' : 'Fill in the transaction details'}</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 -mr-1">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Type toggle */}
          <div>
            <label className="text-xs font-medium text-secondary block mb-2">Type</label>
            <div className="flex gap-2">
              {['income', 'expense'].map(t => (
                <button
                  key={t}
                  onClick={() => setForm(prev => ({ ...prev, type: t }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    form.type === t
                      ? t === 'income'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400'
                      : 'border-themed text-secondary'
                  }`}
                >
                  {t === 'income' ? '↑ Income' : '↓ Expense'}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-secondary block mb-1.5">Description</label>
            <input
              ref={firstInputRef}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Monthly Salary, Grocery run..."
              className={`input-field ${errors.description ? 'border-red-400 dark:border-red-700' : ''}`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={11} /> {errors.description}
              </p>
            )}
          </div>

          {/* Amount & Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-secondary block mb-1.5">Amount (₹)</label>
              <input
                name="amount"
                type="number"
                min="1"
                value={form.amount}
                onChange={handleChange}
                placeholder="0"
                className={`input-field ${errors.amount ? 'border-red-400 dark:border-red-700' : ''}`}
              />
              {errors.amount && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.amount}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-secondary block mb-1.5">Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className={`input-field ${errors.date ? 'border-red-400 dark:border-red-700' : ''}`}
              />
              {errors.date && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.date}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-secondary block mb-1.5">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input-field"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-themed">
          <button onClick={onClose} className="btn-ghost px-4 py-2">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary min-w-[120px] justify-center"
          >
            {submitting
              ? <span className="inline-flex gap-1"><span className="animate-bounce">·</span><span className="animate-bounce" style={{animationDelay:'0.1s'}}>·</span><span className="animate-bounce" style={{animationDelay:'0.2s'}}>·</span></span>
              : isEdit ? 'Save Changes' : 'Add Transaction'
            }
          </button>
        </div>
      </div>
    </div>
  );
}
