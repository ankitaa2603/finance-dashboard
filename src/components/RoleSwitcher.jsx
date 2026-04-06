import React from 'react';
import { Shield, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function RoleSwitcher() {
  const { role, setRole } = useApp();

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg border border-themed bg-primary">
      <button
        onClick={() => setRole('viewer')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
          role === 'viewer'
            ? 'bg-card text-primary shadow-sm'
            : 'text-muted hover:text-secondary'
        }`}
      >
        <Eye size={12} />
        Viewer
      </button>
      <button
        onClick={() => setRole('admin')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
          role === 'admin'
            ? 'bg-card text-accent shadow-sm'
            : 'text-muted hover:text-secondary'
        }`}
      >
        <Shield size={12} />
        Admin
      </button>
    </div>
  );
}
