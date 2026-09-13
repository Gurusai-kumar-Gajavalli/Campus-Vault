import { createClient } from './supabaseClient';
import type { Entry, Vault, Comment } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Attaches auth headers from Supabase session, or local demo user session
async function authHeaders(): Promise<Record<string, string>> {
  if (typeof window !== 'undefined') {
    // Check if live Supabase is configured
    const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref');

    if (!isPlaceholder) {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          return { Authorization: `Bearer ${session.access_token}` };
        }
      } catch (err) {
        console.warn('Failed to retrieve Supabase session:', err);
      }
    }

    // Fallback: check demo user in localStorage
    const savedDemoUser = localStorage.getItem('campusvault_demo_user');
    if (savedDemoUser) {
      try {
        const user = JSON.parse(savedDemoUser);
        if (user?.id) {
          const token = `demo_user_${user.id}:${encodeURIComponent(user.name || 'Student')}:${encodeURIComponent(user.year || '4th Year')}:${encodeURIComponent(user.branch || 'CSE')}`;
          return { Authorization: `Bearer ${token}` };
        }
      } catch (e) {
        console.error('Error parsing demo user:', e);
      }
    }
  }

  return {};
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await authHeaders();
  const url = `${API_URL}${path}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...options.headers,
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Server responded with status ${res.status}`);
    }

    return res.json();
  } catch (err: any) {
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      throw new Error('Unable to connect to CampusVault API server. Is the backend running on port 4000?');
    }
    throw err;
  }
}

export const api = {
  getHealth: () => request<{ status: string; mode: string }>('/api/health'),
  getVaults: (): Promise<Vault[]> => request('/api/vaults'),
  getVault: (slug: string): Promise<Vault> => request(`/api/vaults/${slug}`),
  getEntries: (vaultId: string, options?: { sort?: string; year?: string }): Promise<Entry[]> => {
    const params = new URLSearchParams({ vault_id: vaultId });
    if (options?.sort) params.set('sort', options.sort);
    if (options?.year) params.set('year', options.year);
    return request(`/api/entries?${params.toString()}`);
  },
  searchEntries: (q: string): Promise<Entry[]> =>
    request(`/api/entries/search?q=${encodeURIComponent(q)}`),
  getEntry: (id: string): Promise<Entry> => request(`/api/entries/${id}`),
  createEntry: (body: {
    vault_id: string;
    title: string;
    content: string;
    resource_url?: string;
  }): Promise<Entry> =>
    request('/api/entries', { method: 'POST', body: JSON.stringify(body) }),
  updateEntry: (id: string, body: {
    title: string;
    content: string;
    resource_url?: string;
  }): Promise<Entry> =>
    request(`/api/entries/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteEntry: (id: string): Promise<{ success: boolean }> =>
    request(`/api/entries/${id}`, { method: 'DELETE' }),
  toggleVote: (id: string): Promise<{ hasVoted: boolean; vote_count: number }> =>
    request(`/api/entries/${id}/vote`, { method: 'POST' }),
  getComments: (id: string): Promise<Comment[]> =>
    request(`/api/entries/${id}/comments`),
  postComment: (id: string, content: string): Promise<Comment> =>
    request(`/api/entries/${id}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),
  deleteComment: (entryId: string, commentId: string): Promise<{ success: boolean }> =>
    request(`/api/entries/${entryId}/comments/${commentId}`, { method: 'DELETE' }),
};
