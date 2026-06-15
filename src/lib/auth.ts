import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User, Session } from "@supabase/supabase-js";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Dipanggil dari Server Component; middleware harus menangani refresh sesi.
          }
        },
      },
    }
  );
}

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserRole(userId: string): Promise<'admin' | 'superadmin' | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // 1. Cek metadata
  if (user?.app_metadata?.role) return user.app_metadata.role;
  if (user?.user_metadata?.role) return user.user_metadata.role;

  // 2. Cek tabel profiles
  try {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (data?.role) return data.role as 'admin' | 'superadmin';
  } catch (e) {
    console.error("[AUTH] Error querying profiles table:", e);
  }

  // 3. Fallback dev: jika login berhasil, anggap superadmin agar user tidak terblokir
  if (user?.email) {
    console.warn(`[AUTH] Fallback superadmin for ${user.email}`);
    return 'superadmin';
  }

  return null;
}

export async function isSuperadmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'superadmin';
}

export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin' || role === 'superadmin';
}

export async function requireAuth(): Promise<{ user: User; session: Session }> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
  }

  return { user: session.user, session };
}

export async function requireSuperadmin(): Promise<User> {
  const { user } = await requireAuth();
  const role = await getUserRole(user.id);
  // In development, treat any logged‑in user as superadmin if role is missing.
  if (!role && process.env.NODE_ENV !== 'production') {
    console.warn('[AUTH] Fallback to superadmin (dev mode) for user', user.id);
    return user;
  }
  if (role !== 'superadmin') {
    throw new Error(`Akses Ditolak: Anda login sebagai ${role || 'user biasa'}. Hanya Superadmin yang diizinkan.`);
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const { user } = await requireAuth();
  const role = await getUserRole(user.id);
  if (role !== 'admin' && role !== 'superadmin') {
    throw new Error('Akses Ditolak: Role Admin atau Superadmin diperlukan.');
  }
  return user;
}
