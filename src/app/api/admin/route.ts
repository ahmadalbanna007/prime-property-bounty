import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { requireSuperadmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireSuperadmin();
    console.log('[ADMIN] Listing users by:', user.id);

    const supabase = createAdminClient();

    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      return NextResponse.json(
        { error: 'Gagal mengambil daftar pengguna.', detail: error.message },
        { status: 500 },
      );
    }

    const admins = data.users
      .filter((u) => {
        const meta = u.user_metadata || {};
        return meta.role === 'admin' || meta.role === 'superadmin';
      })
      .map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        role: u.user_metadata?.role || 'admin',
        disabled: u.user_metadata?.disabled === true,
        last_sign_in_at: u.last_sign_in_at,
        phone: u.phone,
      }));

    return NextResponse.json(admins);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
