import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes('your-project-ref')) {
    // In demo mode without configured Supabase, allow route pass-through
    return response;
  }

  try {
    const supabase = createServerClient(
      url,
      anonKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Refreshes the session if expired
    await supabase.auth.getUser();
  } catch (e) {
    // Ignore session refresh failures in edge middleware
  }

  return response;
}

export const config = {
  matcher: ['/vault/:slug/new'],
};
