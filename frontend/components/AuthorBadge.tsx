import React from 'react';
import { Award, GraduationCap, Sparkles } from 'lucide-react';
import type { StudentYear } from '@/lib/types';

interface AuthorBadgeProps {
  name: string;
  year?: StudentYear | string;
  branch?: string;
  size?: 'sm' | 'md';
}

export function AuthorBadge({
  name,
  year = '3rd Year',
  branch,
  size = 'md'
}: AuthorBadgeProps) {
  const isSenior = year === '4th Year';
  const isAlumni = year === 'Alumni';

  return (
    <div className="inline-flex items-center flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <div
          className={`rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-xs ${
            isAlumni
              ? 'bg-gradient-to-tr from-purple-600 to-indigo-600'
              : isSenior
              ? 'bg-gradient-to-tr from-amber-600 to-emerald-600'
              : 'bg-gradient-to-tr from-slate-600 to-slate-700'
          } ${size === 'sm' ? 'w-6 h-6 text-[11px] rounded-lg' : 'w-8 h-8 text-xs'}`}
        >
          {name.charAt(0).toUpperCase()}
        </div>
        <span
          className={`font-bold text-slate-900 tracking-tight ${
            size === 'sm' ? 'text-xs' : 'text-sm'
          }`}
        >
          {name}
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {isAlumni ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200 shadow-xs">
            <Award className="w-3 h-3 text-purple-600" />
            Alumni Mentor
          </span>
        ) : isSenior ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 shadow-xs">
            <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
            Verified Senior (4th Year)
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            {year}
          </span>
        )}

        {branch && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200/80">
            {branch}
          </span>
        )}
      </div>
    </div>
  );
}
