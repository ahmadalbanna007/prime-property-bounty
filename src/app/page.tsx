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

export default function Home() {
  const [properti, setProperti] = useState<Properti[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selesai, setSelesai] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15_000);

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
          const pesan =
            typeof body === "object" &&
            body !== null &&
            "error" in body &&
            typeof body.error === "string"
              ? body.error
              : "Gagal memuat data properti.";
          throw new Error(pesan);
        }

        setProperti(Array.isArray(body) ? body : []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setError("Waktu permintaan habis. Muat ulang halaman atau coba lagi.");
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan saat memuat data.",
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
      <h1 className="text-3xl font-semibold text-[var(--color-prime-black)] sm:text-4xl">
        Selamat Datang di Prime Property
      </h1>
      <p className="mt-4 max-w-2xl text-base text-[var(--color-prime-black)]/80">
        Temukan hunian ruko dan villa terbaik Anda.
      </p>

      <section className="mt-10">
        {loading && (
          <p className="text-sm text-[var(--color-prime-black)]/70">
            Memuat data...
          </p>
        )}

        {error && !loading && (
          <p className="text-sm text-[var(--color-prime-red)]">{error}</p>
        )}

        {selesai && !loading && !error && (
          <div
            className="overflow-x-auto rounded-lg border border-white/10 shadow-lg"
            style={{ backgroundColor: "var(--color-prime-black)" }}
          >
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th
                    className="px-4 py-3 font-semibold"
                    style={{ color: "var(--color-prime-gold)" }}
                  >
                    Nama Properti
                  </th>
                  <th
                    className="px-4 py-3 font-semibold"
                    style={{ color: "var(--color-prime-gold)" }}
                  >
                    Tipe
                  </th>
                  <th
                    className="px-4 py-3 font-semibold"
                    style={{ color: "var(--color-prime-gold)" }}
                  >
                    Kawasan
                  </th>
                  <th
                    className="px-4 py-3 font-semibold"
                    style={{ color: "var(--color-prime-gold)" }}
                  >
                    Harga
                  </th>
                </tr>
              </thead>
              <tbody>
                {properti.length === 0 ? (
                  <tr className="border-t border-white/10">
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-[var(--color-prime-gray)]"
                    >
                      Belum ada properti tersedia.
                    </td>
                  </tr>
                ) : (
                  properti.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-t border-white/10 last:border-b-0${index % 2 === 1 ? " bg-white/[0.04]" : ""}`}
                    >
                      <td className="px-4 py-3 font-medium text-[var(--color-prime-gray)]">
                        {getNamaProperti(item)}
                      </td>
                      <td className="px-4 py-3 text-white/75">
                        {item.tipe ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-white/75">
                        {formatKawasan(item.kawasan)}
                      </td>
                      <td
                        className="px-4 py-3 font-medium"
                        style={{ color: "var(--color-prime-gold)" }}
                      >
                        {getHarga(item)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
