import React from 'react';

/**
 * Reusable skeleton block — pulse animation, theme-aware
 * Usage: <Skeleton className="h-6 w-32" /> or <Skeleton.Card />
 */
function Skeleton({ className = '', style }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/10 dark:bg-white/8 ${className}`}
      style={style}
    />
  );
}

/** Pre-built skeleton for a turf card row */
Skeleton.TurfCard = function TurfCardSkeleton() {
  return (
    <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-white/5 p-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-7 w-24 rounded-2xl" />
      </div>
    </div>
  );
};

/** Pre-built skeleton for a slot chip */
Skeleton.Slot = function SlotSkeleton() {
  return (
    <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-white/5 p-4 space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
};

/** Pre-built skeleton for a data table row */
Skeleton.TableRow = function TableRowSkeleton({ cols = 4 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
};

/** Pre-built skeleton for a stat card */
Skeleton.StatCard = function StatCardSkeleton() {
  return (
    <div className="rounded-[1.5rem] border border-[var(--app-border)] bg-white/6 p-5 space-y-3">
      <Skeleton className="h-9 w-9 rounded-2xl" />
      <Skeleton className="h-3 w-24 mt-4" />
      <Skeleton className="h-7 w-16 rounded-xl" />
    </div>
  );
};

export default Skeleton;
