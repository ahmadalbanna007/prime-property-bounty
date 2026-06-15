import { NextResponse } from 'next/server';
import { createApiClient } from '@/utils/supabase/server';
import { requireSuperadmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = createApiClient();

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Properti tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = createApiClient();

    // Hanya Superadmin yang boleh mengupdate properti
    await requireSuperadmin();

    // Get existing data
    const { data: existing } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Properti tidak ditemukan.' },
        { status: 404 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('properties')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Gagal mengupdate properti.', detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = createApiClient();

    // Hanya Superadmin yang boleh menghapus properti
    await requireSuperadmin();

    // Get existing data
    const { data: existing } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Properti tidak ditemukan.' },
        { status: 404 }
      );
    }

    // Soft delete
    const { error } = await supabase
      .from('properties')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Gagal menghapus properti.', detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Properti berhasil dihapus.' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
