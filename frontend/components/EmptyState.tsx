import React from 'react';
import { BookOpen, Sparkles, PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  icon?: 'book' | 'sparkles';
}

export function EmptyState({
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
  icon = 'book'
}: EmptyStateProps) {
  return (
    <div className="pro-card p-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto border-dashed border-2 border-slate-200 my-6 shadow-subtle">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 shadow-xs">
        {icon === 'sparkles' ? (
          <Sparkles className="w-7 h-7 text-emerald-600" />
        ) : (
          <BookOpen className="w-7 h-7 text-emerald-600" />
        )}
      </div>
      <h3 className="font-display text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-sm">
        {description}
      </p>
      {actionText && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl px-5 py-2.5 text-sm font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onActionClick}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl px-5 py-2.5 text-sm font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            {actionText}
          </button>
        )
      )}
    </div>
  );
}
