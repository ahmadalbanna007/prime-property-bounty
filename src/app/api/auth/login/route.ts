import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const WINDOW_MS = 30 * 60 * 1000; // 30 menit
const LOCK_MS = 15 * 60 * 1000; // 15 menit
const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.toString().trim().toLowerCase();
    const password = body.password?.toString();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi.' },
        { status: 400 }
      );
    }

    // Check lockout from login_attempts table
    const supabaseApi = await createClient();
    const { data: attempts } = await supabaseApi
      .from('login_attempts')
      .select('attempts, last_attempt')
      .eq('email', email)
      .maybeSingle();

    if (attempts) {
      const lastAttempt = new Date(attempts.last_attempt);
      const now = Date.now();

      // Reset jika sudah lewat 30 menit
      if (now - lastAttempt.getTime() > WINDOW_MS) {
        await supabaseApi.from('login_attempts').delete().eq('email', email);
      } else if (attempts.attempts >= MAX_ATTEMPTS) {
        // Cek apakah masih dalam periode lock
        const lockExpires = lastAttempt.getTime() + LOCK_MS;
        if (now < lockExpires) {
          return NextResponse.json(
            { error: 'Akun terkunci sementara selama 15 menit.' },
            { status: 429 }
          );
        }
        // Lock expired, reset
        await supabaseApi.from('login_attempts').delete().eq('email', email);
      }
    }

    // Attempt login
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Record failed attempt
      const { data: existing } = await supabaseApi
        .from('login_attempts')
        .select('attempts')
        .eq('email', email)
        .maybeSingle();

      if (existing) {
        await supabaseApi
          .from('login_attempts')
          .update({
            attempts: existing.attempts + 1,
            last_attempt: new Date().toISOString(),
          })
          .eq('email', email);
      } else {
        await supabaseApi.from('login_attempts').insert({
          email,
          attempts: 1,
          last_attempt: new Date().toISOString(),
        });
      }

      return NextResponse.json(
        { error: 'Email atau password salah.' },
        { status: 401 }
      );
    }

    // Clear attempts on success
    await supabaseApi.from('login_attempts').delete().eq('email', email);

    return NextResponse.json({ message: 'Login berhasil.' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
