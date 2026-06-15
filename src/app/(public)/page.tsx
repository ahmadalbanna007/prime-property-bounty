// app/page.tsx

"use client";

import { useEffect, useState } from "react";

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

// Helper to get a placeholder image URL based on property type
function getPlaceholderImage(tipe: string): string {
  const base = "https://placehold.co/400x250";
  const color = tipe === "Ruko" ? "1A1A1A" : "C9A961"; // Primary Black or Gold
  const text = encodeURIComponent(tipe === "Ruko" ? "RUKO" : "VILLA");
  return `${base}/${color}/ffffff/${text}.png`;
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
        const res = await fetch("/api/properti", {
          signal: controller.signal,
          cache: "no-store",
        });

        const body = (await res.json()) as Properti[] | { error?: string };

        if (!res.ok) {
          throw new Error("Gagal memuat data properti.");
        }

        setProperti(Array.isArray(body) ? body : []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Waktu permintaan habis, memuat ulang...");
          setTimeout(() => window.location.reload(), 2000);
        } else {
          setError(
            err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data."
          );
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
    <div className="px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-8">
      {/* Hero Section - Matching AC-2.1 */}
      <section className="w-full bg-black text-white py-16 px-6 flex flex-col items-center rounded-3xl mb-12 shadow-xl">
        <h1 className="text-4xl font-bold sm:text-5xl text-center" style={{ color: '#FFFFFF' }}>
          Prime Property
        </h1>
        <p className="mt-6 max-w-2xl text-center text-lg" style={{ color: '#D9D9D9' }}>
          Platform Properti Modern. Temukan Ruko dan Villa impian Anda dengan standar kualitas tertinggi.
        </p>
        <div className="mt-10 flex gap-4">
          <a 
            href="#listing" 
            className="px-8 py-3 rounded-full bg-[var(--color-prime-gold)] text-black font-semibold hover:bg-[#B39354] transition shadow-lg"
          >
            Lihat Properti
          </a>
          <a 
            href="/kontak" 
            className="px-8 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition"
          >
            Hubungi Kami
          </a>
        </div>
      </section>

      {/* Listing Section */}
      <section id="listing" className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-[var(--color-prime-black)]">
            Daftar Properti
          </h2>
          {selesai && (
            <span className="text-sm text-gray-500 font-medium">
              {properti.length} Properti ditemukan
            </span>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center py-20">
            <div className="w-12 h-12 border-4 border-[var(--color-prime-gold)] border-t-transparent rounded-full animate-spin"></div>
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
                {properti.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Image Area removed per acceptance criteria (no upload/display) */}
                    <div className="h-8"></div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[var(--color-prime-black)] line-clamp-1 group-hover:text-[var(--color-prime-gold)] transition-colors">
                        {getNamaProperti(item)}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {formatKawasan(item.kawasan)}
                      </p>

                      <div className="mt-6 flex items-center justify-between gap-4 border-t border-gray-50 pt-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Harga</span>
                          <span className="text-xl font-extrabold text-[var(--color-prime-gold)]">
                            {getHarga(item)}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest ${
                            item.status === "in_stock"
                              ? "bg-green-50 text-green-700 border border-green-100"
                              : "bg-red-50 text-red-700 border border-red-100"
                          }`}
                        >
                          {item.status === "in_stock" ? "Ready" : "Sold"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
