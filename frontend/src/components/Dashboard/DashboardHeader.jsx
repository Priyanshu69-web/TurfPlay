import React from 'react';
import { Sparkles } from 'lucide-react';

const DashboardHeader = ({ title, subtitle }) => {
  return (
    <div className="surface-card-strong hero-grid relative overflow-hidden p-6 text-[var(--app-text)]">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10" />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">
            <Sparkles size={14} />
            Workspace
          </div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{subtitle}</p> : null}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
