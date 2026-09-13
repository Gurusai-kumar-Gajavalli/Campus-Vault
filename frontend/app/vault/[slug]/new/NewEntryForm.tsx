'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from '@/components/Toast';
import { Send, AlertCircle, Link as LinkIcon, Sparkles, HelpCircle } from 'lucide-react';

export default function NewEntryForm({
  vaultId,
  vaultSlug,
}: {
  vaultId: string;
  vaultSlug: string;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { success, error: toastError } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters long.');
      return;
    }
    if (content.trim().length < 15) {
      setError('Please provide at least 15 characters of actionable knowledge.');
      return;
    }
    if (resourceUrl.trim() && !resourceUrl.startsWith('http://') && !resourceUrl.startsWith('https://')) {
      setError('Resource link must begin with http:// or https://');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const entry = await api.createEntry({
        vault_id: vaultId,
        title: title.trim(),
        content: content.trim(),
        resource_url: resourceUrl.trim() || undefined,
      });

      success('Knowledge deposited successfully!');
      router.push(`/entry/${entry.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to post entry to vault.');
      toastError(err.message || 'Failed to post entry.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pro-card p-6 sm:p-10 space-y-6 shadow-card">
      {/* Guidance Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200/80 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950 leading-relaxed space-y-1">
          <p className="font-bold">Pro-Tip for High-Impact Deposits</p>
          <p className="text-emerald-800">
            Specificity is what helps juniors the most. Mention exact rounds, coding problems,
            professor expectations, or GitHub repositories that made a difference.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Everything I wish I knew before my Amazon SDE interview"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-sans"
        />
        <p className="text-[11px] text-slate-400">
          Make it easy to discover through search.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Detailed Wisdom & Lessons <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] font-semibold text-slate-400">
            {content.length} characters
          </span>
        </div>
        <textarea
          placeholder="Break down interview rounds, high-yield exam chapters, capstone architectural mistakes, or tips for cracking internships..."
          required
          rows={9}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-sans leading-relaxed"
        />
      </div>

      {/* Resource Link */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
          Attached Resource Link <span className="text-slate-400 font-normal lowercase">(optional)</span>
        </label>
        <input
          type="url"
          placeholder="https://github.com/... or Google Drive link"
          value={resourceUrl}
          onChange={(e) => setResourceUrl(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-sans"
        />
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push(`/vault/${vaultSlug}`)}
          className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl px-6 py-2.5 text-sm font-bold transition-all shadow-md shadow-emerald-950/10 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          {saving ? 'Depositing to Vault…' : 'Deposit to Vault'}
        </button>
      </div>
    </form>
  );
}
