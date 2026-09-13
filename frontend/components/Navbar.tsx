'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Plus,
  LogOut,
  User,
  ChevronDown,
  Sparkles,
  Search,
  ShieldCheck
} from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';
import { useToast } from './Toast';

export function Navbar() {
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    name?: string;
    year?: string;
    branch?: string;
  } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { info } = useToast();

  useEffect(() => {
    async function checkAuth() {
      // 1. Check live Supabase
      const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref');

      if (!isPlaceholder) {
        try {
          const supabase = createClient();
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            setUser({
              id: authUser.id,
              email: authUser.email,
              name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Student',
              year: authUser.user_metadata?.year || '4th Year',
              branch: authUser.user_metadata?.branch || 'CSE',
            });
            return;
          }
        } catch (e) {
          console.warn('Supabase auth check:', e);
        }
      }

      // 2. Check demo user in localStorage
      const demoStr = localStorage.getItem('campusvault_demo_user');
      if (demoStr) {
        try {
          const demo = JSON.parse(demoStr);
          if (demo?.id) {
            setUser(demo);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }

      setUser(null);
    }

    checkAuth();
    const handleStorage = () => checkAuth();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [pathname]);

  async function handleSignOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem('campusvault_demo_user');
    setUser(null);
    setDropdownOpen(false);
    info('Signed out successfully.');
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 pro-glass">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-all border border-emerald-500/20 shrink-0 bg-slate-900">
            <img
              src="/logo.png"
              alt="CampusVault Brand Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                CampusVault
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SRM 2026
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-500 font-medium -mt-0.5">
              Don&rsquo;t let student knowledge graduate
            </p>
          </div>
        </Link>

        {/* Center / Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors hidden md:block ${
              pathname === '/'
                ? 'text-emerald-700 bg-emerald-50/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Vaults
          </Link>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/vault/placements/new"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:shadow-emerald-900/10 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Deposit Knowledge</span>
                <span className="sm:hidden">Deposit</span>
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-subtle"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden lg:block pr-1">
                    <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-medium text-emerald-700 leading-tight">
                      {user.year}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 pro-card py-2 z-50 animate-fade-in divide-y divide-slate-100 shadow-card-hover">
                    <div className="px-4 py-2.5">
                      <p className="text-[11px] font-medium text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {user.year} • {user.branch}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 hover:text-slate-950 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-subtle hover:shadow-card"
            >
              <User className="w-4 h-4 text-emerald-600" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
