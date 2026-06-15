// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { FadeIn, StaggerGrid } from "@/components/ui/Animate";

type Properti = {
  id: string;
  nama_property?: string;
  nama_properti?: string;
  tipe: string;
  kawasan: string | string[] | null;
  price?: number;
  harga?: number;
  gambar_url?: string | null;
  status: string;
};

const valueProps = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: "Profesional & Berpengalaman",
    desc: "Tim kami terdiri dari para profesional properti dengan pengalaman bertahun-tahun di pasar properti Medan dan sekitarnya.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Transparan & Terpercaya",
    desc: "Setiap informasi properti disajikan secara lengkap dan transparan. Tidak ada biaya tersembunyi, hanya kepercayaan yang kami jaga.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Harga Kompetitif",
    desc: "Kami menawarkan properti dengan harga terbaik yang sesuai dengan kualitas premium. Investasi cerdas untuk masa depan Anda.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: "Lokasi Strategis",
    desc: "Properti unggulan kami berada di lokasi-lokasi strategis di area Medan dengan akses mudah ke pusat bisnis, pendidikan, dan fasilitas umum.",
  },
];

function formatRupiah(value: number): string {
  return `Rp ${Math.round(value).toLocaleString("id-ID")}`;
}

function getNamaProperti(item: Properti): string {
  return item.nama_property ?? item.nama_properti ?? "-";
}

function getHarga(item: Properti): string {
  const nilai = item.price ?? item.harga;
  if (nilai == null) return "-";
  return formatRupiah(nilai);
}

function formatKawasan(kawasan: Properti["kawasan"]): string {
  if (kawasan == null) return "-";
  if (Array.isArray(kawasan)) {
    const items = kawasan.map(String).filter(Boolean);
    return items.length > 0 ? items.join(", ") : "-";
  }
  const teks = String(kawasan).trim();
  return teks || "-";
}

export default function Home() {
  const [properti, setProperti] = useState<Properti[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selesai, setSelesai] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 30_000);

    async function fetchProperti() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/properti?limit=6", {
          signal: controller.signal,
          cache: "no-store",
        });
        const body = (await res.json()) as Properti[] | { error?: string };
        if (!res.ok) throw new Error("Gagal memuat data properti.");
        setProperti(Array.isArray(body) ? body : []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Waktu permintaan habis, memuat ulang...");
          setTimeout(() => window.location.reload(), 2000);
        } else {
          setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data.");
        }
      } finally {
        window.clearTimeout(timeoutId);
        setLoading(false);
        setSelesai(true);
      }
    }
    fetchProperti();
    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 py-28 sm:px-6 sm:py-32">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[#1A1A1A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,97,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,169,97,0.08),transparent_60%)]" />

        {/* Animated decorative circles */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-br from-[var(--color-prime-gold)]/5 to-transparent blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-tl from-[var(--color-prime-gold)]/8 to-transparent blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,169,97,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,97,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <FadeIn delay={100} from="up">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-prime-gold)]/30 bg-[var(--color-prime-gold)]/10 px-4 py-1.5 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--color-prime-gold)] animate-pulse" />
              <span className="text-xs font-medium text-[var(--color-prime-gold)] tracking-wider uppercase">
                Platform Properti Premium #1 di Medan
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={300} from="up">
            <h1 className="text-5xl font-bold sm:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight">
              Temukan{" "}
              <span className="bg-gradient-to-r from-[var(--color-prime-gold)] to-amber-300 bg-clip-text text-transparent">
                Properti Impian
              </span>{" "}
              Anda
            </h1>
          </FadeIn>

          <FadeIn delay={500} from="up">
            <p className="mt-6 max-w-2xl text-lg text-gray-400 leading-relaxed">
              Platform properti modern yang menghadirkan Ruko dan Villa berkualitas
              premium dengan standar tertinggi. Investasi cerdas untuk masa depan Anda.
            </p>
          </FadeIn>

          <FadeIn delay={700} from="up">
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <a
                href="#listing"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-3.5 font-semibold transition-all duration-300"
                style={{ backgroundColor: "var(--color-prime-gold)", color: "var(--color-prime-black)" }}
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative">Lihat Properti</span>
                <svg className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="/kontak"
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-white/5 hover:border-white/40"
              >
                Hubungi Kami
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </FadeIn>

          {/* Stats row */}
          <FadeIn delay={900} from="up">
            <div className="mt-16 grid grid-cols-3 gap-8 sm:gap-16 border-t border-white/10 pt-8 w-full max-w-lg">
              {[
                { value: "50+", label: "Properti" },
                { value: "100%", label: "Terpercaya" },
                { value: "24/7", label: "Dukungan" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== MENGAPA PRIME PROPERTY ===== */}
      <section className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        {/* Background soft gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <FadeIn from="up">
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-prime-gold)] mb-3">
                Mengapa Prime Property
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-prime-black)]">
                Keunggulan{" "}
                <span className="bg-gradient-to-r from-[var(--color-prime-gold)] to-amber-400 bg-clip-text text-transparent">
                  Bersama Kami
                </span>
              </h2>
              <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
                Kami berkomitmen memberikan layanan properti terbaik untuk Anda
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((vp, i) => (
              <FadeIn key={i} delay={i * 150} from="up">
                <div className="group relative bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  {/* Hover gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-prime-gold)] to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[var(--color-prime-gold)]/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                  <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-prime-gold)]/10 to-amber-100/50 text-[var(--color-prime-gold)] mb-5 group-hover:from-[var(--color-prime-gold)] group-hover:to-amber-400 group-hover:text-white transition-all duration-500">
                    {vp.icon}
                  </div>
                  <h3 className="relative text-lg font-bold text-[var(--color-prime-black)] mb-2 transition-colors duration-300 group-hover:text-[var(--color-prime-gold)]">
                    {vp.title}
                  </h3>
                  <p className="relative text-sm text-gray-500 leading-relaxed">
                    {vp.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROPERTI UNGGULAN ===== */}
      <section id="listing" className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeIn from="up">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-prime-gold)] mb-3">
                  Pilihan Terbaik
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-prime-black)]">
                  Properti{" "}
                  <span className="bg-gradient-to-r from-[var(--color-prime-gold)] to-amber-400 bg-clip-text text-transparent">
                    Unggulan
                  </span>
                </h2>
                <p className="mt-2 text-gray-500">
                  Koleksi properti pilihan terbaru dari Prime Property
                </p>
              </div>
              {selesai && !loading && (
                <a
                  href="/#listing"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--color-prime-gold)] text-[var(--color-prime-gold)] text-sm font-semibold hover:bg-[var(--color-prime-gold)] hover:text-[var(--color-prime-black)] transition-all duration-300 shrink-0"
                >
                  Lihat Semua
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              )}
            </div>
          </FadeIn>

          {loading && (
            <div className="flex flex-col items-center py-20">
              <div className="w-12 h-12 border-4 border-[var(--color-prime-gold)] border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-500">Memuat data properti...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-center">
              <p className="text-[var(--color-prime-red)] font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-sm font-semibold text-red-700 hover:underline"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {selesai && !loading && !error && (
            <div className="space-y-6">
              {properti.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 text-lg">Belum ada properti yang tersedia saat ini.</p>
                </div>
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {properti.map((item, i) => (
                    <FadeIn key={item.id} delay={i * 120} from="up">
                      <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-[var(--color-prime-gold)]/20">
                        {/* Gold bar accent */}
                        <div className="h-1.5 bg-gradient-to-r from-[var(--color-prime-gold)] to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="h-7" />
                        <div className="p-6 pt-0">
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                              {item.tipe}
                            </span>
                            <span
                              className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                                item.status === "in_stock"
                                  ? "bg-green-50 text-green-700 border border-green-100"
                                  : "bg-red-50 text-red-700 border border-red-100"
                              }`}
                            >
                              {item.status === "in_stock" ? "Ready" : "Sold"}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-[var(--color-prime-black)] line-clamp-1 group-hover:text-[var(--color-prime-gold)] transition-colors duration-300">
                            {getNamaProperti(item)}
                          </h3>
                          <p className="mt-2 text-sm text-gray-500 flex items-center gap-1.5">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {formatKawasan(item.kawasan)}
                          </p>
                          <div className="mt-6 flex items-center justify-between gap-4 border-t border-gray-50 pt-4">
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Harga</span>
                              <span className="text-xl font-extrabold bg-gradient-to-r from-[var(--color-prime-gold)] to-amber-400 bg-clip-text text-transparent">
                                {getHarga(item)}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400 group-hover:text-[var(--color-prime-gold)] transition-colors duration-300 flex items-center gap-1">
                              Detail
                              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="relative px-4 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[#1A1A1A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,97,0.12),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(201,169,97,1) 1px, transparent 0)", backgroundSize: "40px 40px" }} />

        <FadeIn from="up">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Siap Menemukan{" "}
              <span className="bg-gradient-to-r from-[var(--color-prime-gold)] to-amber-300 bg-clip-text text-transparent">
                Properti Impian
              </span>{" "}
              Anda?
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              Hubungi tim Prime Property sekarang dan dapatkan konsultasi gratis
              tentang properti yang sesuai dengan kebutuhan Anda.
            </p>
            <div className="mt-8">
              <a
                href="/kontak"
                className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold transition-all duration-300 hover:brightness-110 shadow-lg shadow-[var(--color-prime-gold)]/25"
                style={{ backgroundColor: "var(--color-prime-gold)", color: "var(--color-prime-black)" }}
              >
                Konsultasi Sekarang
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
