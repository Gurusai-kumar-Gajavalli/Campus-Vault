'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ThumbsUp,
  MessageSquare,
  ExternalLink,
  Share2,
  Trash2,
  Edit3,
  ArrowLeft,
  Send,
  Sparkles,
  AlertCircle,
  Calendar,
  Check,
  CornerDownRight,
  Clock,
  BookOpen,
  Link2
} from 'lucide-react';
import { api } from '@/lib/api';
import { createClient } from '@/lib/supabaseClient';
import type { Entry, Comment } from '@/lib/types';
import { EntryDetailSkeleton } from '@/components/Skeleton';
import { AuthorBadge } from '@/components/AuthorBadge';
import { useToast } from '@/components/Toast';

export default function EntryPage({ params }: { params: { id: string } }) {
  const [entry, setEntry] = useState<(Entry & { hasVoted?: boolean; isOwner?: boolean }) | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [voting, setVoting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editResourceUrl, setEditResourceUrl] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { success, error: toastError, info } = useToast();

  async function loadData() {
    setError(null);
    try {
      // 1. Check auth
      const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref');

      let user = null;
      if (!isPlaceholder) {
        try {
          const supabase = createClient();
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) user = authUser;
        } catch (e) {
          console.warn(e);
        }
      }

      if (!user) {
        const demoStr = localStorage.getItem('campusvault_demo_user');
        if (demoStr) {
          try {
            user = JSON.parse(demoStr);
          } catch (e) {
            console.error(e);
          }
        }
      }
      setCurrentUser(user);

      // 2. Fetch entry & comments
      const [entryData, commentsData] = await Promise.all([
        api.getEntry(params.id),
        api.getComments(params.id),
      ]);

      setEntry(entryData);
      setEditTitle(entryData.title);
      setEditContent(entryData.content);
      setEditResourceUrl(entryData.resource_url || '');
      setComments(commentsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load knowledge entry.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Optimistic Toggle Upvote
  async function handleToggleVote() {
    if (!currentUser) {
      window.location.href = `/login?next=/entry/${params.id}`;
      return;
    }
    if (!entry || voting) return;

    const previousHasVoted = entry.hasVoted ?? false;
    const previousVoteCount = entry.vote_count;
    const newHasVoted = !previousHasVoted;
    const newVoteCount = newHasVoted ? previousVoteCount + 1 : Math.max(0, previousVoteCount - 1);

    setEntry({
      ...entry,
      hasVoted: newHasVoted,
      vote_count: newVoteCount,
    });
    setVoting(true);

    try {
      const result = await api.toggleVote(params.id);
      setEntry((prev) => (prev ? { ...prev, hasVoted: result.hasVoted, vote_count: result.vote_count } : prev));
      if (result.hasVoted) {
        success('Upvote recorded!');
      } else {
        info('Upvote removed.');
      }
    } catch (err: any) {
      setEntry((prev) => (prev ? { ...prev, hasVoted: previousHasVoted, vote_count: previousVoteCount } : prev));
      toastError(err.message || 'Failed to update vote.');
    } finally {
      setVoting(false);
    }
  }

  // Submit Comment
  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) {
      window.location.href = `/login?next=/entry/${params.id}`;
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const comment = await api.postComment(params.id, newComment.trim());
      setComments((prev) => [...prev, comment]);
      setNewComment('');
      success('Comment posted!');
    } catch (err: any) {
      toastError(err.message || 'Failed to post comment.');
    } finally {
      setSubmittingComment(false);
    }
  }

  // Delete Comment
  async function handleDeleteComment(commentId: string) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.deleteComment(params.id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      success('Comment deleted.');
    } catch (err: any) {
      toastError(err.message || 'Failed to delete comment.');
    }
  }

  // Save Edit Entry
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) return;

    setSavingEdit(true);
    try {
      const updated = await api.updateEntry(params.id, {
        title: editTitle.trim(),
        content: editContent.trim(),
        resource_url: editResourceUrl.trim() || undefined,
      });

      setEntry((prev) => (prev ? { ...prev, ...updated } : updated));
      setIsEditing(false);
      success('Entry updated successfully!');
    } catch (err: any) {
      toastError(err.message || 'Failed to update entry.');
    } finally {
      setSavingEdit(false);
    }
  }

  // Delete Entry
  async function handleDeleteEntry() {
    if (!confirm('Are you sure you want to delete this knowledge entry? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteEntry(params.id);
      success('Entry deleted.');
      router.push('/');
      router.refresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete entry.');
    }
  }

  // Copy Link
  function handleCopyLink() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  }

  if (loading) {
    return <EntryDetailSkeleton />;
  }

  if (error || !entry) {
    return (
      <div className="pro-card p-10 text-center space-y-4 max-w-md mx-auto my-12 shadow-card">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <h2 className="font-display text-xl font-bold text-slate-900">Entry Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'This knowledge entry might have been removed.'}</p>
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

  const wordCount = entry.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 100));

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Back Button & Actions Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <div className="flex items-center gap-2">
          {entry.isOwner && !isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer shadow-subtle"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                Edit
              </button>
              <button
                onClick={handleDeleteEntry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all cursor-pointer shadow-subtle"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                Delete
              </button>
            </>
          )}

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-subtle cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            {copied ? 'Copied' : 'Share'}
          </button>
        </div>
      </div>

      {/* Main Entry Card */}
      <article className="pro-card p-6 sm:p-10 space-y-6">
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display text-xl font-bold text-slate-900">Edit Knowledge Entry</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Author Mode
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Title
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Detailed Wisdom & Content
              </label>
              <textarea
                required
                rows={10}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-sans leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Attached Resource Link (optional)
              </label>
              <input
                type="url"
                value={editResourceUrl}
                onChange={(e) => setEditResourceUrl(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={savingEdit}
                className="bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {savingEdit ? 'Saving changes…' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold px-3 py-2 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Author Header */}
            <div className="space-y-3.5 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <AuthorBadge
                  name={entry.author_name || 'Senior Contributor'}
                  year={entry.author_year || '4th Year'}
                  branch={entry.author_branch || 'CSE'}
                />

                <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(entry.created_at).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {readTime} min read
                  </span>
                  {entry.updated_at && entry.updated_at !== entry.created_at && (
                    <span className="italic text-slate-400">(edited)</span>
                  )}
                </div>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight pt-1">
                {entry.title}
              </h1>
            </div>

            {/* Content Body */}
            <div className="pt-2 text-slate-700 leading-relaxed sm:text-base text-sm whitespace-pre-wrap font-sans space-y-4">
              {entry.content}
            </div>

            {/* Attached Resource Card */}
            {entry.resource_url && (
              <div className="pt-4">
                <a
                  href={entry.resource_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-xs group-hover:scale-105 transition-transform">
                      <Link2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        Attached Resource or Repository
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-sm sm:max-w-md font-mono">
                        {entry.resource_url}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors shrink-0" />
                </a>
              </div>
            )}

            {/* Action Bar (Upvotes & Interactions) */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleToggleVote}
                className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer shadow-subtle ${
                  entry.hasVoted
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-transparent shadow-md shadow-emerald-950/15 animate-pop'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${entry.hasVoted ? 'fill-current text-white' : 'text-emerald-600'}`} />
                <span>{entry.hasVoted ? 'Upvoted' : 'Upvote Wisdom'}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                    entry.hasVoted ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {entry.vote_count}
                </span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>{comments.length} Discussion Comments</span>
              </div>
            </div>
          </>
        )}
      </article>

      {/* Peer Discussion Section */}
      <section className="space-y-6 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
              Peer Discussion ({comments.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Ask follow-ups or verify details with the author
          </span>
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="pro-card p-5 sm:p-6 space-y-3 shadow-card">
          <textarea
            placeholder={
              currentUser
                ? 'Ask a follow-up question or share your experience with this topic…'
                : 'Sign in to join the conversation and ask questions…'
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            required
            className="w-full border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-sans"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-semibold text-slate-400">
              {currentUser ? `Posting as ${currentUser.name || 'Student'}` : 'Sign in required to reply'}
            </span>

            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {submittingComment ? 'Posting…' : 'Post Comment'}
            </button>
          </div>
        </form>

        {/* Comments Thread */}
        <div className="space-y-3.5">
          {comments.length === 0 ? (
            <div className="p-8 text-center text-xs sm:text-sm text-slate-400 pro-card border-dashed">
              No comments yet. Be the first to ask a question or add your perspective!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="pro-card p-5 space-y-3 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <AuthorBadge
                    name={comment.author_name || 'Student'}
                    year={comment.author_year || '2nd Year'}
                    branch={comment.author_branch || 'CSE'}
                    size="sm"
                  />

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-400">
                      {new Date(comment.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>

                    {comment.isOwner && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-8">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
