import { NextResponse } from 'next/server';
import { createClient, getUserRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ role: null }, { status: 200 });
    }

    const role = await getUserRole(user.id);
    return NextResponse.json({ role, user: { id: user.id, email: user.email } });
  } catch (err) {
    return NextResponse.json({ role: null }, { status: 200 });
  }
}
