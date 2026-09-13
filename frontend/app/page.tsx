'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  RefreshCw,
  FolderLock,
  Compass,
  Code2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { api } from '@/lib/api';
import type { Vault, Entry } from '@/lib/types';
import { VaultGridSkeleton } from '@/components/Skeleton';
import { AuthorBadge } from '@/components/AuthorBadge';

export default function HomePage() {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Entry[]>([]);
  const [recentEntries, setRecentEntries] = useState<Entry[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const vaultsData = await api.getVaults();
      setVaults(vaultsData);

      if (vaultsData.length > 0) {
        const top = await api.getEntries(vaultsData[0].id, { sort: 'top' });
        setRecentEntries(top.slice(0, 3));
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    setSearching(true);
    const timeout = setTimeout(() => {
      api
        .searchEntries(query)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 280);
    return () => clearTimeout(timeout);
  }, [query]);

  const quickPills = [
    { label: '⚡ Amazon SDE OA', term: 'Amazon' },
    { label: '📚 Operating Systems', term: 'Operating Systems' },
    { label: '🚀 Capstone Lessons', term: 'Capstone' },
    { label: '💼 Product Management', term: 'Product' },
    { label: '🏛️ Campus Survival', term: 'Survival' },
  ];

  const vaultGradients: Record<string, { icon: React.ReactNode; bg: string; border: string }> = {
    Placement: {
      icon: <Briefcase className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 text-emerald-700',
      border: 'hover:border-emerald-300',
    },
    'Course Notes': {
      icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50 text-indigo-700',
      border: 'hover:border-indigo-300',
    },
    Project: {
      icon: <Code2 className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 text-amber-700',
      border: 'hover:border-amber-300',
    },
    General: {
      icon: <Compass className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 text-purple-700',
      border: 'hover:border-purple-300',
    },
  };

  return (
    <div className="space-y-14 sm:space-y-16 pb-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-5 pt-2 sm:pt-4">
        {/* Logo Emblem Header */}
        <div className="flex justify-center mb-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-xl shadow-emerald-950/20 border-2 border-emerald-500/30 bg-slate-900 p-1 hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="CampusVault"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>GitHub Community SRM Recruitment 2026 • Option A</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
          Don’t let student knowledge{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
            graduate.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The unwritten campus playbook: real interview debriefs, high-yield subject notes, and
          capstone retrospectives — deposited by seniors so the next batch never starts from scratch.
        </p>

        {/* Live System Pillars Bar */}
        <div className="pt-2 flex flex-wrap gap-4 sm:gap-6 justify-center text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-subtle">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            4 Topic Vaults
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-subtle">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
            Decoupled Express.js REST API
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Verified Senior & Alumni Badges
          </div>
        </div>
      </section>

      {/* Connection Warning */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Backend Disconnected</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Prominent Search Experience */}
      <section className="max-w-2xl mx-auto relative space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Amazon debriefs, Galvin OS notes, capstone architecture…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 shadow-card focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-sans"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              Clear
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
              Ctrl K
            </kbd>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Popular:
          </span>
          {quickPills.map((pill) => (
            <button
              key={pill.label}
              onClick={() => setQuery(pill.term)}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100/90 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-slate-600 border border-slate-200/80 transition-all cursor-pointer"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Live Search Results Dropdown */}
        {query.trim() !== '' && (
          <div className="mt-3 pro-card p-4 divide-y divide-slate-100 animate-fade-in shadow-card-hover z-30 relative">
            <div className="pb-2.5 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Results for &ldquo;{query}&rdquo;</span>
              {searching && <span className="animate-pulse">Searching repository…</span>}
            </div>

            {!searching && results.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500 space-y-1">
                <p className="font-semibold">No knowledge deposited yet matching &ldquo;{query}&rdquo;.</p>
                <p className="text-xs text-slate-400">
                  Be the first senior to deposit this insight for the next batch!
                </p>
              </div>
            ) : (
              <div className="pt-2 space-y-2">
                {results.map((r) => (
                  <Link
                    key={r.id}
                    href={`/entry/${r.id}`}
                    className="block p-3 rounded-xl hover:bg-slate-50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {r.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {r.content}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0">
                        <ThumbsUp className="w-3 h-3 text-emerald-600" />
                        {r.vote_count}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Vaults Grid Section */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Curated Knowledge Vaults
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select a stage of university life to explore or deposit shared wisdom.
            </p>
          </div>
        </div>

        {loading ? (
          <VaultGridSkeleton />
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {vaults.map((v) => {
              const meta = vaultGradients[v.category] || {
                icon: <FolderLock className="w-5 h-5 text-slate-600" />,
                bg: 'bg-slate-50 text-slate-700',
                border: 'hover:border-slate-300',
              };

              return (
                <Link
                  key={v.id}
                  href={`/vault/${v.slug}`}
                  className={`pro-card p-6 flex flex-col justify-between group ${meta.border}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.bg} shadow-xs`}>
                        {meta.icon}
                      </div>

                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {v.entry_count !== undefined ? `${v.entry_count} entries` : 'Explore'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {v.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                        {v.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                    <span>Enter Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Featured Community Wisdom Section */}
      {recentEntries.length > 0 && (
        <section className="space-y-5 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
                Top Senior Contributions
              </h2>
            </div>
            <Link
              href="/vault/placements"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <Link
                key={entry.id}
                href={`/entry/${entry.id}`}
                className="block pro-card p-5 group hover:border-emerald-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <AuthorBadge
                      name={entry.author_name || 'Senior Contributor'}
                      year={entry.author_year || '4th Year'}
                      branch={entry.author_branch || 'CSE'}
                      size="sm"
                    />
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {entry.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {entry.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 sm:self-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                      {entry.vote_count}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
