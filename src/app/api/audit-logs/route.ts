import { NextResponse } from 'next/server';
import { createApiClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createApiClient();

    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        id,
        property_id,
        action,
        changed_at,
        old_data,
        new_data
      `)
      .order('changed_at', { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json(
        { error: 'Gagal mengambil audit log.', detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
