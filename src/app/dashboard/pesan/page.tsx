'use client';

import { useEffect, useState, useCallback } from 'react';

type Pesan = {
  id: string;
  nama: string;
  email: string;
  no_hp: string;
  pesan: string;
  ip_address: string | null;
  created_at: string;
};

export default function PesanMasukPage() {
  const [pesan, setPesan] = useState<Pesan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<Pesan | null>(null);
  const limit = 25;

  const fetchPesan = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/kontak?page=${p}&limit=${limit}`);
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Gagal mengambil data.');
      }
      const data = await res.json();
      setPesan(data);
      setTotal(parseInt(res.headers.get('X-Total-Count') || '0'));
      setTotalPages(parseInt(res.headers.get('X-Total-Pages') || '1'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPesan(page);
  }, [page, fetchPesan]);

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-prime-black)' }}>
          Pesan Masuk
        </h1>
        <p className="mt-1 text-sm text-[var(--color-prime-black)]/70">
          Daftar pesan dari formulir kontak website
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--color-prime-gold)] border-r-transparent"></div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-3">
            {pesan.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-sm text-gray-500">Belum ada pesan masuk.</p>
              </div>
            ) : (
              pesan.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    selected?.id === item.id
                      ? 'border-[var(--color-prime-gold)] bg-[var(--color-prime-gold)]/5 shadow-sm'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[var(--color-prime-black)] truncate">
                        {item.nama}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.email}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-gray-400 whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.pesan}</p>
                </button>
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-gray-400">
                  {(page - 1) * limit + 1}–{Math.min(page * limit, total)} dari {total}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Sebelumnya
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Berikutnya →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Detail */}
          <div className="lg:col-span-1">
            {selected ? (
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sticky top-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nama</p>
                  <p className="mt-1 text-sm font-medium text-[var(--color-prime-black)]">{selected.nama}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</p>
                  <a href={`mailto:${selected.email}`} className="mt-1 text-sm text-[var(--color-prime-gold)] hover:underline block">
                    {selected.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">No. HP</p>
                  <a href={`https://wa.me/${selected.no_hp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="mt-1 text-sm text-[var(--color-prime-gold)] hover:underline block">
                    {selected.no_hp}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pesan</p>
                  <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{selected.pesan}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Dikirim</p>
                  <p className="mt-1 text-sm text-gray-600">{formatDate(selected.created_at)}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-sm text-gray-400">Pilih pesan untuk melihat detail</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
