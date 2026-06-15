import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { requireSuperadmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const user = await requireSuperadmin();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi.' },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter.' },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        disabled: false,
        created_by: user.id,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: 'Gagal membuat akun admin.', detail: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        id: data.user.id,
        email: data.user.email,
        message: 'Akun admin berhasil dibuat.',
      },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
