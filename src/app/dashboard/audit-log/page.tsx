'use client';

import { useEffect, useState, useCallback } from 'react';

type AuditLog = {
  id: string;
  property_id: string;
  action: string;
  changed_at: string;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
};

const actionLabels: Record<string, { label: string; color: string }> = {
  CREATE: { label: 'Dibuat', color: 'bg-green-100 text-green-800 border-green-200' },
  UPDATE: { label: 'Diedit', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  DELETE: { label: 'Dihapus', color: 'bg-red-100 text-red-800 border-red-200' },
};

function diffFields(
  oldData: Record<string, unknown> | null,
  newData: Record<string, unknown> | null
): { field: string; oldVal: string; newVal: string }[] {
  const diffs: { field: string; oldVal: string; newVal: string }[] = [];
  const allKeys = new Set([
    ...Object.keys(oldData || {}),
    ...Object.keys(newData || {}),
  ]);

  for (const key of allKeys) {
    if (key === 'updated_at' || key === 'created_at' || key === 'created_by') continue;
    const oldVal = oldData?.[key];
    const newVal = newData?.[key];
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      diffs.push({
        field: key,
        oldVal: oldVal != null ? String(oldVal) : '(kosong)',
        newVal: newVal != null ? String(newVal) : '(kosong)',
      });
    }
  }
  return diffs;
}

const fieldLabels: Record<string, string> = {
  nama_property: 'Nama Properti',
  group_name: 'Group',
  lebar: 'Lebar (m)',
  panjang: 'Panjang (m)',
  hadap: 'Arah Hadap',
  tipe: 'Tipe',
  tingkat: 'Tingkat',
  price: 'Harga',
  carport: 'Carport',
  status: 'Status',
  siap: 'Kondisi Siap',
  maps_link: 'Link Maps',
  kawasan: 'Kawasan',
  unit: 'Unit',
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AuditLog | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/audit-logs');
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Gagal mengambil data.');
      }
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-prime-black)' }}>
          Audit Log
        </h1>
        <p className="mt-1 text-sm text-[var(--color-prime-black)]/70">
          Riwayat perubahan data properti ({logs.length} total)
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
          <div className="lg:col-span-2">
            {logs.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-sm text-gray-500">Belum ada aktivitas audit log.</p>
                <p className="mt-1 text-xs text-gray-400">
                  Perubahan data properti akan tercatat di sini.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => {
                  const action = actionLabels[log.action] || { label: log.action, color: 'bg-gray-100 text-gray-800 border-gray-200' };
                  return (
                    <button
                      key={log.id}
                      onClick={() => setSelected(log)}
                      className={`w-full text-left rounded-xl border p-4 transition-all ${
                        selected?.id === log.id
                          ? 'border-[var(--color-prime-gold)] bg-[var(--color-prime-gold)]/5 shadow-sm'
                          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${action.color}`}>
                            {action.label}
                          </span>
                          <span className="text-sm font-medium text-[var(--color-prime-black)]">
                            ID: {log.property_id?.slice(0, 8)}...
                          </span>
                        </div>
                        <span className="shrink-0 text-[10px] text-gray-400 whitespace-nowrap">
                          {formatDate(log.changed_at)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail */}
          <div className="lg:col-span-1">
            {selected ? (
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sticky top-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Aksi</p>
                  <span className={`mt-1 inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wide ${(actionLabels[selected.action] || actionLabels.CREATE).color}`}>
                    {(actionLabels[selected.action] || { label: selected.action }).label}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Waktu</p>
                  <p className="mt-1 text-sm text-gray-700">{formatDate(selected.changed_at)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Property ID</p>
                  <p className="mt-1 text-sm font-mono text-gray-700 break-all">{selected.property_id}</p>
                </div>

                {/* Diff */}
                {selected.action === 'UPDATE' && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Perubahan Data</p>
                    <div className="space-y-2">
                      {diffFields(selected.old_data, selected.new_data).map((d, i) => (
                        <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-xs">
                          <p className="font-semibold text-gray-700 mb-1">
                            {fieldLabels[d.field] || d.field}
                          </p>
                          <div className="flex items-start gap-2">
                            <span className="text-red-600 line-through">{d.oldVal}</span>
                            <span className="text-gray-300">→</span>
                            <span className="text-green-700">{d.newVal}</span>
                          </div>
                        </div>
                      ))}
                      {diffFields(selected.old_data, selected.new_data).length === 0 && (
                        <p className="text-xs text-gray-400 italic">Tidak ada perubahan signifikan</p>
                      )}
                    </div>
                  </div>
                )}

                {selected.action === 'CREATE' && selected.new_data && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Data Baru</p>
                    <pre className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 overflow-x-auto max-h-48">
                      {JSON.stringify(selected.new_data, null, 2)}
                    </pre>
                  </div>
                )}

                {selected.action === 'DELETE' && selected.old_data && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Data Sebelum Dihapus</p>
                    <pre className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 overflow-x-auto max-h-48">
                      {JSON.stringify(selected.old_data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-sm text-gray-400">Pilih log untuk melihat detail perubahan</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
