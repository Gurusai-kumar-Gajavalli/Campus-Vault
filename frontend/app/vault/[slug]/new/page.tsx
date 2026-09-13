'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Sparkles, BookOpen } from 'lucide-react';
import { api } from '@/lib/api';
import { createClient } from '@/lib/supabaseClient';
import type { Vault } from '@/lib/types';
import NewEntryForm from './NewEntryForm';
import { EntryDetailSkeleton } from '@/components/Skeleton';

export default function NewEntryPage({ params }: { params: { slug: string } }) {
  const [vault, setVault] = useState<Vault | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndVault() {
      try {
        const v = await api.getVault(params.slug);
        setVault(v);
      } catch (err) {
        console.error(err);
      }

      const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref');

      let currentUser = null;

      if (!isPlaceholder) {
        try {
          const supabase = createClient();
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) currentUser = authUser;
        } catch (e) {
          console.warn(e);
        }
      }

      if (!currentUser) {
        const demoStr = localStorage.getItem('campusvault_demo_user');
        if (demoStr) {
          try {
            currentUser = JSON.parse(demoStr);
          } catch (e) {
            console.error(e);
          }
        }
      }

      setUser(currentUser);
      setLoading(false);
    }

    checkAuthAndVault();
  }, [params.slug]);

  if (loading) {
    return <EntryDetailSkeleton />;
  }

  if (!user) {
    return (
      <div className="pro-card p-8 sm:p-10 text-center max-w-md mx-auto my-10 space-y-4 shadow-card">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Sign In Required</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Knowledge depositors must be verified with their student batch and department to preserve
          academic integrity.
        </p>
        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            href={`/login?next=/vault/${params.slug}/new`}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-950/10 active:scale-95"
          >
            Sign In or Create Account
          </Link>
          <Link
            href={`/vault/${params.slug}`}
            className="text-xs text-slate-400 hover:text-slate-700 font-medium py-1"
          >
            Back to vault
          </Link>
        </div>
      </div>
    );
  }

  if (!vault) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-500">Vault not found.</p>
        <Link href="/" className="text-sm text-emerald-700 font-bold underline">
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <Link
        href={`/vault/${vault.slug}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to {vault.name}
      </Link>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {vault.category}
          </span>
          <span className="text-xs font-medium text-slate-400">
            Depositing as <strong className="text-slate-700 font-bold">{user.name || user.email || 'Student'}</strong> ({user.user_metadata?.year || user.year || 'Senior'})
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Deposit Knowledge
        </h1>
        <p className="text-sm text-slate-500">
          Leave behind valuable lessons, interview debriefs, or project architectures in{' '}
          <strong className="text-slate-800">{vault.name}</strong>.
        </p>
      </div>

      <NewEntryForm vaultId={vault.id} vaultSlug={vault.slug} />
    </div>
  );
}
