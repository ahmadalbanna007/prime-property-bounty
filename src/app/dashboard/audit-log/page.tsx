import { requireSuperadmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AuditLogPage() {
  try {
    await requireSuperadmin();
  } catch {
    redirect('/dashboard');
  }

  return (
    <div>
      <h1
        className="text-2xl font-semibold"
        style={{ color: 'var(--color-prime-black)' }}
      >
        Audit Log
      </h1>
      <p className="mt-2 text-sm text-[var(--color-prime-black)]/70">
        Riwayat perubahan data properti (hanya untuk Superadmin)
      </p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">
          Fitur audit log akan menampilkan semua perubahan data properti
          termasuk CREATE, UPDATE, dan DELETE dengan detail perubahan dan waktu.
        </p>
        <p className="mt-4 text-xs text-gray-500">
          Coming soon: Tabel audit log dengan filter dan pagination.
        </p>
      </div>
    </div>
  );
}
