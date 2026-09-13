import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { ToastProvider } from '@/components/Toast';
import { Github, Heart, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CampusVault — Don’t let student knowledge graduate',
  description:
    'A collaborative knowledge-preservation platform where students deposit interview debriefs, course notes, and capstone lessons so the next batch never starts from zero.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-parchment text-ink min-h-screen flex flex-col selection:bg-moss selection:text-parchment">
        <ToastProvider>
          <Navbar />
          <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 sm:py-10">
            {children}
          </main>
          <footer className="border-t border-stone-border bg-stone-50/50 mt-16 py-8">
            <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-subtle">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-ink text-sm">CampusVault</span>
                <span>—</span>
                <span>Built for GitHub Community SRM Recruitment 2026</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-moss" />
                  Option A: Mini Collaborative App
                </span>
                <span>•</span>
                <span>Next.js 14 + Express.js + Supabase</span>
              </div>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
