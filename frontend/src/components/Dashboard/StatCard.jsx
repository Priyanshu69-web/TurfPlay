import React from 'react';

const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-sky-500/10 text-sky-500',
    green: 'bg-emerald-500/10 text-emerald-500',
    purple: 'bg-violet-500/10 text-violet-500',
    red: 'bg-rose-500/10 text-rose-500',
  };

  return (
    <div className="surface-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm text-muted">{label}</p>
          <p className="text-3xl font-semibold text-[var(--app-text)]">{value}</p>
        </div>
        <div className={`rounded-2xl p-4 ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
