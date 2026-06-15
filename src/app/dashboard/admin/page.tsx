'use client';

import { useEffect, useState, useCallback } from 'react';

type AdminUser = {
  id: string;
  email: string;
  created_at: string;
  role: string;
  disabled: boolean;
  last_sign_in_at: string | null;
};

type ToastState = { type: 'success' | 'error'; message: string } | null;

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>(null);

  // Form tambah admin
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset password
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [resetPw, setResetPw] = useState('');
  const [resetting, setResetting] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      if (!res.ok) throw new Error('Gagal mengambil data admin');
      setAdmins(await res.json());
    } catch {
      setToast({ type: 'error', message: 'Gagal memuat daftar admin.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  /* ---- Tambah admin ---- */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setToast({ type: 'success', message: body.message });
      setNewEmail('');
      setNewPassword('');
      setShowForm(false);
      fetchAdmins();
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Gagal membuat admin.' });
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- Enable / Disable ---- */
  const handleToggle = async (admin: AdminUser) => {
    const newDisabled = !admin.disabled;
    try {
      const res = await fetch(`/api/admin/${admin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ disabled: newDisabled }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setToast({ type: 'success', message: body.message });
      fetchAdmins();
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Gagal.' });
    }
  };

  /* ---- Reset password ---- */
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget) return;
    setResetting(true);
    try {
      const res = await fetch(`/api/admin/${resetTarget.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newPassword: resetPw }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setToast({ type: 'success', message: body.message });
      setResetTarget(null);
      setResetPw('');
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Gagal mereset password.' });
    } finally {
      setResetting(false);
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="mb-4 rounded-md border px-4 py-3 text-sm"
          style={{
            backgroundColor: toast.type === 'success' ? '#ecfdf5' : '#fef2f2',
            borderColor: toast.type === 'success' ? '#86efac' : '#fca5a5',
            color: toast.type === 'success' ? '#166534' : '#991b1b',
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-prime-black)' }}>
            Manajemen Admin
          </h1>
          <p className="mt-1 text-sm text-gray-600">Total: {admins.length} admin</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-prime-gold)', color: 'var(--color-prime-black)' }}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          + Tambah Admin
        </button>
      </div>

      {/* Form Tambah Admin */}
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-700">Tambah Admin Baru</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Email *</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-prime-gold)] focus:ring-1 focus:ring-[var(--color-prime-gold)]"
                placeholder="admin@contoh.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-prime-gold)] focus:ring-1 focus:ring-[var(--color-prime-gold)]"
                placeholder="Minimal 6 karakter"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#16a34a' }}
            >
              {submitting ? 'Membuat...' : 'Buat Akun'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Tabel Admin */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--color-prime-gold)] border-r-transparent"></div>
        </div>
      ) : admins.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-gray-500">Belum ada admin yang terdaftar.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Terdaftar</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Terakhir Login</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-medium text-[var(--color-prime-black)]">{admin.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${
                      admin.role === 'superadmin'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${
                      admin.disabled
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {admin.disabled ? 'Nonaktif' : 'Aktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(admin.created_at)}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(admin.last_sign_in_at)}</td>
                  <td className="px-4 py-3 text-right">
                    {admin.role !== 'superadmin' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(admin)}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            admin.disabled
                              ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {admin.disabled ? 'Aktifkan' : 'Nonaktifkan'}
                        </button>
                        <button
                          onClick={() => { setResetTarget(admin); setResetPw(''); }}
                          className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          Reset PW
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Reset Password */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setResetTarget(null)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-[var(--color-prime-black)] mb-1">Reset Password</h3>
            <p className="text-xs text-gray-500 mb-4">Reset password untuk <strong>{resetTarget.email}</strong></p>
            <form onSubmit={handleReset} className="space-y-3">
              <input
                type="password"
                required
                minLength={6}
                value={resetPw}
                onChange={(e) => setResetPw(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-prime-gold)] focus:ring-1 focus:ring-[var(--color-prime-gold)]"
                placeholder="Password baru (min. 6 karakter)"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={resetting}
                  className="rounded-md px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-prime-gold)', color: 'var(--color-prime-black)' }}
                >
                  {resetting ? 'Meriset...' : 'Reset'}
                </button>
                <button
                  type="button"
                  onClick={() => setResetTarget(null)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
