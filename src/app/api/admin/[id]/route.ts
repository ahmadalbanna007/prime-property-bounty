import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { requireSuperadmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

type RouteParams = {
  params: Promise<{ id: string }>;
};

/** Enable / disable admin */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireSuperadmin();

    if (id === user.id) {
      return NextResponse.json(
        { error: 'Anda tidak bisa menonaktifkan akun Anda sendiri.' },
        { status: 400 },
      );
    }

    const { disabled } = await request.json();

    const supabase = createAdminClient();

    // Ambil user dulu untuk cek role
    const { data: target } = await supabase.auth.admin.getUserById(id);
    if (!target.user) {
      return NextResponse.json(
        { error: 'Pengguna tidak ditemukan.' },
        { status: 404 },
      );
    }

    const meta = target.user.user_metadata || {};
    if (meta.role === 'superadmin') {
      return NextResponse.json(
        { error: 'Tidak bisa mengubah status Superadmin lain.' },
        { status: 403 },
      );
    }

    const { error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: {
        ...meta,
        disabled: disabled === true,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: 'Gagal mengubah status admin.', detail: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      id,
      disabled: disabled === true,
      message: disabled
        ? 'Admin berhasil dinonaktifkan.'
        : 'Admin berhasil diaktifkan kembali.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
