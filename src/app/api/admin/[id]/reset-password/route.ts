import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { requireSuperadmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

type RouteParams = {
  params: Promise<{ id: string }>;
};

/** Reset password admin */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireSuperadmin();

    const { newPassword } = await request.json();
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter.' },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.updateUserById(id, {
      password: newPassword,
    });

    if (error) {
      return NextResponse.json(
        { error: 'Gagal mereset password.', detail: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: 'Password berhasil direset.' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
