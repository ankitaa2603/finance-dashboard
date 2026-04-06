import React, { useState } from 'react';
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb,
  Sun, Moon, Menu, X, RotateCcw, TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import RoleSwitcher from './RoleSwitcher';

const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'transactions',  label: 'Transactions',  icon: ArrowLeftRight   },
  { id: 'insights',      label: 'Insights',      icon: Lightbulb        },
];

export default function Sidebar() {
  const { darkMode, setDarkMode, activeTab, setActiveTab, resetData } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0c90e1, #36aaf5)' }}>
          <TrendingUp size={16} className="text-white" />
        </div>
        <div>
          <span className="font-bold text-primary tracking-tight">FinFlow</span>
          <span className="block text-xs text-muted leading-none">Finance Dashboard</span>
        </div>
      </div>

      <div className="px-3 mb-2">
        <p className="text-xs font-semibold text-muted uppercase tracking-widest px-2 mb-2">Navigation</p>
        <nav className="space-y-0.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setMobileOpen(false); }}
              className={`nav-item w-full ${activeTab === id ? 'active' : ''}`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-4 pb-5 space-y-3">
        {/* Role Switcher */}
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 px-1">Role</p>
          <RoleSwitcher />
        </div>

        {/* Dark Mode */}
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 px-1">Appearance</p>
          <button
            onClick={() => setDarkMode(d => !d)}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg border border-themed text-sm font-medium text-secondary hover:text-primary transition-all duration-200 hover:bg-primary"
          >
            {darkMode
              ? <Sun size={15} className="text-amber-400" />
              : <Moon size={15} className="text-brand-500" />
            }
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* Reset data */}
        <button
          onClick={() => { if (window.confirm('Reset to sample data?')) resetData(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-muted hover:text-secondary transition-colors duration-200"
        >
          <RotateCcw size={12} />
          Reset Sample Data
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 xl:w-60 flex-shrink-0 h-screen sticky top-0 border-r border-themed bg-card">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 border-b border-themed bg-card flex items-center px-4 py-3 gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0c90e1, #36aaf5)' }}>
          <TrendingUp size={14} className="text-white" />
        </div>
        <span className="font-bold text-primary tracking-tight">FinFlow</span>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setDarkMode(d => !d)} className="btn-ghost p-2">
            {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
          </button>
          <button onClick={() => setMobileOpen(p => !p)} className="btn-ghost p-2">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <aside
            className="absolute left-0 top-0 h-full w-64 flex flex-col bg-card border-r border-themed shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="pt-14">
              <NavContent />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
