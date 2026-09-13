'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  ExternalLink,
  Flame,
  Clock,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Briefcase,
  BookOpen,
  Code2,
  Compass,
  FileText
} from 'lucide-react';
import { api } from '@/lib/api';
import type { Vault, Entry } from '@/lib/types';
import { EntryListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { AuthorBadge } from '@/components/AuthorBadge';

export default function VaultPage({ params }: { params: { slug: string } }) {
  const [vault, setVault] = useState<Vault | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sort, setSort] = useState<'top' | 'newest'>('top');
  const [yearFilter, setYearFilter] = useState<'all' | 'seniors'>('all');

  async function loadVaultAndEntries() {
    setLoading(true);
    setError(null);
    try {
      const v = await api.getVault(params.slug);
      setVault(v);
      const e = await api.getEntries(v.id, {
        sort,
        year: yearFilter === 'seniors' ? 'seniors' : undefined,
      });
      setEntries(e);
    } catch (err: any) {
      setError(err.message || 'Failed to load vault details.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVaultAndEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug, sort, yearFilter]);

  const categoryMeta: Record<string, { icon: React.ReactNode; bg: string }> = {
    Placement: {
      icon: <Briefcase className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 text-emerald-700',
    },
    'Course Notes': {
      icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50 text-indigo-700',
    },
    Project: {
      icon: <Code2 className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 text-amber-700',
    },
    General: {
      icon: <Compass className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 text-purple-700',
    },
  };

  if (error && !vault) {
    return (
      <div className="pro-card p-10 text-center space-y-4 max-w-md mx-auto my-12 shadow-card">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <h2 className="font-display text-xl font-bold text-slate-900">Vault Not Found</h2>
        <p className="text-sm text-slate-500">{error}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-700 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vaults
        </Link>
      </div>
    );
  }

  const meta = vault ? (categoryMeta[vault.category] || { icon: <FileText className="w-5 h-5 text-slate-600" />, bg: 'bg-slate-50' }) : null;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Vaults
        </Link>

        <div className="pro-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2.5">
              {meta && (
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.bg}`}>
                  {meta.icon}
                </div>
              )}
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {vault?.category || 'Vault'}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'} deposited
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {vault?.name || 'Loading Vault…'}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {vault?.description}
            </p>
          </div>

          {vault && (
            <Link
              href={`/vault/${vault.slug}/new`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl px-5 py-3 text-sm font-bold transition-all shadow-md shadow-emerald-950/10 active:scale-95 shrink-0 self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              <span>Deposit Knowledge</span>
            </Link>
          )}
        </div>
      </div>

      {/* Sorting & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {/* Sort Tabs */}
        <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setSort('top')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              sort === 'top'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Top Upvoted
          </button>
          <button
            onClick={() => setSort('newest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              sort === 'newest'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            Newest First
          </button>
        </div>

        {/* Year Filter Pills */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setYearFilter('all')}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              yearFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            All Batches
          </button>
          <button
            onClick={() => setYearFilter('seniors')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              yearFilter === 'seniors'
                ? 'bg-amber-100/80 text-amber-900 border-amber-300 font-bold shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
            Seniors & Alumni Only
          </button>
        </div>
      </div>

      {/* Entries Feed */}
      {loading ? (
        <EntryListSkeleton count={4} />
      ) : entries.length === 0 ? (
        <EmptyState
          title={yearFilter === 'seniors' ? 'No Senior entries match this filter' : 'This vault is waiting for its first deposit'}
          description={
            yearFilter === 'seniors'
              ? 'No 4th Year or Alumni entries found. Switch back to "All Batches" or be the first senior to share your insights!'
              : 'Be the pioneer student to leave battle-tested interview questions, notes, or project advice in this vault.'
          }
          actionText="Deposit first entry"
          actionHref={vault ? `/vault/${vault.slug}/new` : undefined}
          icon="sparkles"
        />
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const wordCount = entry.content.split(/\s+/).length;
            const readTime = Math.max(1, Math.ceil(wordCount / 100));

            return (
              <Link
                key={entry.id}
                href={`/entry/${entry.id}`}
                className="block pro-card p-6 sm:p-7 group hover:border-emerald-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <AuthorBadge
                        name={entry.author_name || 'Student Contributor'}
                        year={entry.author_year || '3rd Year'}
                        branch={entry.author_branch || 'CSE'}
                        size="sm"
                      />
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {readTime} min read
                      </span>
                    </div>

                    <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {entry.title}
                    </h2>

                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-sans">
                      {entry.content}
                    </p>
                  </div>

                  {/* Upvotes Counter Box */}
                  <div className="shrink-0 sm:self-center flex sm:flex-col items-center justify-center gap-1 bg-slate-50 border border-slate-200 px-3.5 py-2 sm:py-2.5 rounded-xl group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all">
                    <ThumbsUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-extrabold text-slate-900">
                      {entry.vote_count}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
                      votes
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-3">
                    <span>
                      {new Date(entry.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    {entry.resource_url && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <ExternalLink className="w-3 h-3" />
                        Attached Resource
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold group-hover:text-emerald-700 transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{entry.comment_count ?? 0} comments</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
