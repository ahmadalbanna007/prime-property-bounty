import { NextResponse } from "next/server";
import { createApiClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000;

type KontakBody = {
  nama?: string;
  email?: string;
  no_hp?: string;
  pesan?: string;
};

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return "127.0.0.1";
}

function validateBody(body: KontakBody): string | null {
  const nama = body.nama?.trim();
  const email = body.email?.trim();
  const noHp = body.no_hp?.trim();
  const pesan = body.pesan?.trim();

  if (!nama || !email || !noHp || !pesan) {
    return "Nama, email, nomor HP, dan pesan wajib diisi.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Format email tidak valid.";
  }

  const digitHp = noHp.replace(/\D/g, "");
  if (digitHp.length < 10) {
    return "Nomor HP minimal 10 digit.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    let body: KontakBody;

    try {
      body = (await request.json()) as KontakBody;
    } catch {
      return NextResponse.json(
        { error: "Body request tidak valid." },
        { status: 400 },
      );
    }

    const validationError = validateBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const nama = body.nama!.trim();
    const email = body.email!.trim();
    const no_hp = body.no_hp!.trim();
    const pesan = body.pesan!.trim();
    const ip = getClientIp(request);

    const supabase = createApiClient();
    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();

    const { count, error: countError } = await supabase
      .from("kontak")
      .select("id", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("created_at", since);

    if (countError) {
      return NextResponse.json(
        { error: "Gagal memeriksa batas pengiriman.", detail: countError.message },
        { status: 500 },
      );
    }

    if ((count ?? 0) >= RATE_LIMIT) {
      return NextResponse.json(
        { error: "Batas pengiriman tercapai. Coba lagi dalam 1 jam." },
        { status: 429 },
      );
    }

    const { error: insertError } = await supabase.from("kontak").insert({
      nama,
      email,
      no_hp,
      pesan,
      ip_address: ip,
    });

    if (insertError) {
      return NextResponse.json(
        { error: "Gagal menyimpan pesan.", detail: insertError.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Pesan berhasil dikirim." },
      { status: 200 },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Terjadi kesalahan pada server.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
