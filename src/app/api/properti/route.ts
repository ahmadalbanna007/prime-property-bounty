import { NextResponse } from 'next/server';
import { createApiClient } from '@/utils/supabase/server';
import { requireSuperadmin } from '@/lib/auth';
import type { PropertyFilter } from '@/types/property';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const propertyFilterSchema = z.object({
  search: z.string().optional(),
  kawasan: z.array(z.string()).optional(),
  hadap: z.array(z.enum(['Utara', 'Selatan', 'Timur', 'Barat'])).optional(),
  tipe: z.enum(['Ruko', 'Villa']).optional(),
  status: z.enum(['in_stock', 'sold_out']).optional(),
  siap: z.array(z.enum(['siap_huni', 'siap_kosong', 'siap_huni_renovasi'])).optional(),
  carport: z.boolean().optional(),
  lebar_min: z.number().positive().optional(),
  harga_max: z.number().positive().optional(),
  sort: z.enum(['nama', 'price', 'created_at', 'status']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.enum(['6', '25', '50', '100']).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = {
      search: searchParams.get('search'),        kawasan: searchParams.getAll('kawasan'),
      hadap: searchParams.getAll('hadap'),
      tipe: searchParams.get('tipe'),
      status: searchParams.get('status'),
      siap: searchParams.getAll('siap'),
      carport: searchParams.get('carport'),
      lebar_min: searchParams.get('lebar_min'),
      harga_max: searchParams.get('harga_max'),
      sort: searchParams.get('sort'),
      order: searchParams.get('order'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    };

    const params = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, v === null ? undefined : v])
    ) as Record<string, unknown>;

    if (typeof params.carport === 'string') {
      params.carport = params.carport === 'true' ? true : params.carport === 'false' ? false : undefined;
    }
    if (typeof params.lebar_min === 'string') params.lebar_min = parseFloat(params.lebar_min as string) || undefined;
    if (typeof params.harga_max === 'string') params.harga_max = parseFloat(params.harga_max as string) || undefined;
    if (typeof params.page === 'string') params.page = parseInt(params.page as string) || undefined;

    const validated = propertyFilterSchema.parse(params);
    const supabase = createApiClient();
    let query = supabase.from('properties').select('*', { count: 'exact' }).is('deleted_at', null);

    if (validated.search) {
      const searchTerm = `%${validated.search}%`;
      query = query.or(`nama_property.ilike.${searchTerm},group_name.ilike.${searchTerm},kawasan.ilike.${searchTerm}`);
    }
    if (validated.kawasan && validated.kawasan.length > 0) query = query.contains('kawasan', validated.kawasan);
    if (validated.hadap && validated.hadap.length > 0) query = query.contains('hadap', validated.hadap);
    if (validated.tipe) query = query.eq('tipe', validated.tipe);
    if (validated.status) query = query.eq('status', validated.status);
    if (validated.siap && validated.siap.length > 0) query = query.in('siap', validated.siap);
    if (validated.carport !== undefined) query = query.eq('carport', validated.carport);
    if (validated.lebar_min) query = query.gte('lebar', validated.lebar_min);
    if (validated.harga_max) query = query.lte('price', validated.harga_max);

    const sortField = validated.sort === 'nama' ? 'nama_property' : (validated.sort || 'created_at');
    query = query.order(sortField, { ascending: validated.order === 'asc' });

    const page = validated.page ?? 1;
    const limit = validated.limit ? parseInt(validated.limit) : 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);
    if (error) return NextResponse.json({ error: 'Gagal mengambil data properti.', detail: error.message }, { status: 500 });

    return NextResponse.json(data, {
      headers: {
        'X-Total-Count': String(count ?? 0),
        'X-Total-Pages': String(Math.ceil((count ?? 0) / limit)),
        'X-Page': String(page),
        'X-Limit': String(limit),
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid filters.', details: err.issues }, { status: 400 });
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createApiClient();
    const user = await requireSuperadmin();

    const body = await request.json();
    body.created_by = user.id;

    const { data, error } = await supabase.from('properties').insert(body).select().single();
    if (error) {
      return NextResponse.json({ error: 'Gagal menambahkan properti.', detail: error.message }, { status: 500 });
    }

    // Catat ke audit_logs
    await supabase.from('audit_logs').insert({
      property_id: data.id,
      action: 'CREATE',
      changed_by: user.id,
      old_data: null,
      new_data: data,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
