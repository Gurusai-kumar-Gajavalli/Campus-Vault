import { createClient } from '@supabase/supabase-js';

const isPlaceholder = !process.env.SUPABASE_URL ||
  process.env.SUPABASE_URL.includes('your-project-ref') ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY.includes('your-service-role-key');

export const isDemoMode = isPlaceholder;

export let supabaseAdmin = null;

if (!isDemoMode) {
  try {
    supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    console.log('✅ Connected to live Supabase project:', process.env.SUPABASE_URL);
  } catch (err) {
    console.warn('⚠️ Failed to initialize Supabase client, falling back to Demo Mode:', err.message);
  }
} else {
  console.log('⚡ CampusVault Backend running in Demo Mode (in-memory persistent store with pre-seeded data).');
  console.log('💡 Set valid SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env to connect to live Supabase.');
}
