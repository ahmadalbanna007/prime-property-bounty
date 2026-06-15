import { NextResponse } from 'next/server';
import { createApiClient } from '@/utils/supabase/server';
import { requireSuperadmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await requireSuperadmin();
    const supabase = createApiClient();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('kontak')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      return NextResponse.json(
        { error: 'Gagal mengambil data pesan.', detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        'X-Total-Count': String(count ?? 0),
        'X-Total-Pages': String(Math.ceil((count ?? 0) / limit)),
        'X-Page': String(page),
        'X-Limit': String(limit),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
