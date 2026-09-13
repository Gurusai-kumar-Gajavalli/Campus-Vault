'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import { useToast } from '@/components/Toast';
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  User,
  Zap,
  ArrowRight,
  AlertCircle,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni'] as const;

function LoginFormContent() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [year, setYear] = useState<string>(YEARS[3]); // Default to 4th Year for testing
  const [branch, setBranch] = useState('CSE');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';
  const { success, error: toastError } = useToast();

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref')
  );

  function activateDemoUser(userData: {
    id: string;
    email: string;
    name: string;
    year: string;
    branch: string;
  }) {
    localStorage.setItem('campusvault_demo_user', JSON.stringify(userData));
    window.dispatchEvent(new Event('storage'));
    success(`Signed in as ${userData.name} (${userData.year})!`);
    router.push(next);
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // If Supabase is configured with real credentials, use real Supabase Auth
    if (isSupabaseConfigured) {
      const supabase = createClient();
      try {
        if (mode === 'signup') {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name, year, branch },
            },
          });
          if (error) throw error;
          success('Account created successfully!');
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          success('Welcome back!');
        }
        router.push(next);
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'Authentication error.');
        toastError(err.message || 'Authentication failed.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // In Demo Mode: Instant seamless local session
    setTimeout(() => {
      const demoId = 'user_' + (email.split('@')[0] || 'demo_' + Date.now());
      activateDemoUser({
        id: demoId,
        email: email || 'student@srmist.edu.in',
        name: name || (email.split('@')[0] || 'Student Contributor'),
        year: year || '4th Year',
        branch: branch || 'CSE',
      });
      setLoading(false);
    }, 250);
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pt-4 pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg shadow-emerald-950/20 border-2 border-emerald-500/20 bg-slate-900 mx-auto p-1">
          <img
            src="/logo.png"
            alt="CampusVault Logo"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
          {mode === 'signin' ? 'Welcome Back' : 'Join CampusVault'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {mode === 'signin'
            ? 'Sign in to deposit wisdom, upvote peer contributions, and comment.'
            : 'Register your student batch to gain verified senior badges.'}
        </p>
      </div>

      {/* Quick Evaluator Personas Box */}
      <div className="pro-card p-4 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 border-amber-200 space-y-2.5 shadow-subtle">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          <span>Quick Evaluator Personas (1-Click Test)</span>
        </div>
        <p className="text-[11px] text-amber-800/80">
          Click either button below to test immediate login and author permissions:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() =>
              activateDemoUser({
                id: 'user_senior_1',
                name: 'Aarav Sharma',
                year: '4th Year',
                branch: 'CSE',
                email: 'aarav.sharma@srmist.edu.in',
              })
            }
            className="p-2.5 rounded-xl bg-white border border-amber-200/80 text-left hover:border-emerald-500 hover:bg-amber-50/50 transition-all cursor-pointer shadow-subtle"
          >
            <p className="font-bold text-slate-900">Aarav (4th Year)</p>
            <p className="text-[10px] text-slate-500">Author of Amazon debrief</p>
          </button>

          <button
            type="button"
            onClick={() =>
              activateDemoUser({
                id: 'user_junior_test',
                name: 'Tanvi Verma',
                year: '2nd Year',
                branch: 'IT',
                email: 'tanvi.verma@srmist.edu.in',
              })
            }
            className="p-2.5 rounded-xl bg-white border border-amber-200/80 text-left hover:border-emerald-500 hover:bg-amber-50/50 transition-all cursor-pointer shadow-subtle"
          >
            <p className="font-bold text-slate-900">Tanvi (2nd Year)</p>
            <p className="text-[10px] text-slate-500">Junior peer commenter</p>
          </button>
        </div>
      </div>

      {/* Main Auth Form Card */}
      <div className="pro-card p-6 sm:p-8 space-y-6 shadow-card">
        {/* Toggle Mode Segmented Control */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Student Batch
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Branch / Dept <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSE-AIML"
                    required
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Student Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="student@srmist.edu.in"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-950/10 active:scale-95 disabled:opacity-50 mt-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating…</span>
            ) : mode === 'signup' ? (
              <>
                <span>Create Verified Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Sign In to Vault</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-slate-400 text-sm">Loading login...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
