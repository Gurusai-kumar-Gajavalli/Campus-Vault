import React from 'react';

export function EntryCardSkeleton() {
  return (
    <div className="pro-card p-6 space-y-3.5 shadow-subtle">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl skeleton-shimmer" />
          <div className="space-y-1.5">
            <div className="w-24 h-3.5 rounded-md skeleton-shimmer" />
            <div className="w-16 h-2.5 rounded-md skeleton-shimmer" />
          </div>
        </div>
        <div className="w-16 h-6 rounded-full skeleton-shimmer" />
      </div>
      <div className="w-3/4 h-5 rounded-md skeleton-shimmer mt-2" />
      <div className="space-y-2 pt-1">
        <div className="w-full h-3 rounded-md skeleton-shimmer" />
        <div className="w-5/6 h-3 rounded-md skeleton-shimmer" />
      </div>
      <div className="pt-3 flex items-center justify-between border-t border-slate-100">
        <div className="w-20 h-3 rounded-md skeleton-shimmer" />
        <div className="w-16 h-3 rounded-md skeleton-shimmer" />
      </div>
    </div>
  );
}

export function EntryListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <EntryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function VaultGridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="pro-card p-6 space-y-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl skeleton-shimmer" />
            <div className="w-20 h-5 rounded-full skeleton-shimmer" />
          </div>
          <div className="w-48 h-6 rounded-md skeleton-shimmer" />
          <div className="space-y-2 pt-1">
            <div className="w-full h-3.5 rounded-md skeleton-shimmer" />
            <div className="w-2/3 h-3.5 rounded-md skeleton-shimmer" />
          </div>
          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            <div className="w-24 h-3.5 rounded-md skeleton-shimmer" />
            <div className="w-4 h-4 rounded-md skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EntryDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="w-28 h-4 rounded-md skeleton-shimmer" />
      <div className="pro-card p-8 space-y-5 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl skeleton-shimmer" />
          <div className="w-36 h-4 rounded-md skeleton-shimmer" />
        </div>
        <div className="w-3/4 h-8 rounded-md skeleton-shimmer" />
        <div className="space-y-2.5 pt-2">
          <div className="w-full h-4 rounded-md skeleton-shimmer" />
          <div className="w-full h-4 rounded-md skeleton-shimmer" />
          <div className="w-5/6 h-4 rounded-md skeleton-shimmer" />
          <div className="w-2/3 h-4 rounded-md skeleton-shimmer" />
        </div>
        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <div className="w-32 h-10 rounded-xl skeleton-shimmer" />
          <div className="w-24 h-4 rounded-md skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
