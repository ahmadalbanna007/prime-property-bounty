import { createClient } from '@supabase/supabase-js';

function getAdminEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Variabel lingkungan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diset.',
    );
  }

  return { url, serviceRoleKey };
}

/** Klien Supabase dengan Service Role Key — hanya untuk server-side. */
export function createAdminClient() {
  const { url, serviceRoleKey } = getAdminEnv();
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
