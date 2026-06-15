'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Property } from '@/types/property';
import Badge from '@/components/ui/Badge';

interface PropertyDrawerProps {
  open: boolean;
  onClose: () => void;
  property: Property | null;
  isSuperadmin?: boolean;
  onDeleted?: (id: string) => void;
}

export default function PropertyDrawer({
  open,
  onClose,
  property,
  isSuperadmin = false,
  onDeleted,
}: PropertyDrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || !property) return null;

  const statusVariant =
    property.status === 'in_stock' ? 'success' : 'danger';
  const siapVariant =
    property.siap === 'siap_huni'
      ? 'gold'
      : property.siap === 'siap_kosong'
      ? 'purple'
      : 'info';

  const statusLabel = property.status === 'in_stock' ? 'In Stock' : 'Sold Out';
  const siapLabel =
    property.siap === 'siap_huni'
      ? 'Siap Huni'
      : property.siap === 'siap_kosong'
      ? 'Siap Kosong'
      : 'Siap Huni Renovasi';

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/properti/${property.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus properti');
      onDeleted?.(property.id);
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Detail Properti"
    >
      <div className="w-full max-w-2xl rounded-t-xl sm:rounded-xl border border-white/10 bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-prime-black)]">
            {property.nama_property}
          </h2>
          <div className="flex items-center gap-2">
            {isSuperadmin && (
              <>
                <Link
                  href={`/dashboard/properti/${property.id}/edit`}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={deleting}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: 'var(--color-prime-red)' }}
                >
                  {deleting ? 'Menghapus...' : 'Hapus'}
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Tutup"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showConfirm && (
          <div className="border-b border-red-100 bg-red-50 px-6 py-4">
            <p className="text-sm font-medium text-[var(--color-prime-red)]">
              Yakin hapus properti &quot;{property.nama_property}&quot;? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-md px-4 py-1.5 text-xs font-medium text-white"
                style={{ backgroundColor: 'var(--color-prime-red)' }}
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-md border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Detail Content */}
        <div className="px-6 py-6 space-y-4">
          <div className="flex gap-2">
            <Badge variant={statusVariant}>{statusLabel}</Badge>
            <Badge variant={siapVariant}>{siapLabel}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Group</p>
              <p className="font-medium text-gray-900">
                {property.group_name || '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Tipe</p>
              <p className="font-medium text-gray-900">{property.tipe}</p>
            </div>
            <div>
              <p className="text-gray-500">Lebar × Panjang</p>
              <p className="font-medium text-gray-900">
                {property.lebar} × {property.panjang} m
              </p>
            </div>
            <div>
              <p className="text-gray-500">Tingkat</p>
              <p className="font-medium text-gray-900">{property.tingkat}</p>
            </div>
            <div>
              <p className="text-gray-500">Arah Hadap</p>
              <p className="font-medium text-gray-900">
                {property.hadap.join(', ')}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Carport</p>
              <p className="font-medium text-gray-900">
                {property.carport ? 'Ya' : 'Tidak'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500">Kawasan</p>
              <p className="font-medium text-gray-900">
                {property.kawasan.join(', ')}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Unit</p>
              <p className="font-medium text-gray-900">
                {property.unit || '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Harga</p>
              <p
                className="font-semibold text-lg"
                style={{ color: 'var(--color-prime-gold)' }}
              >
                Rp {property.price.toLocaleString('id-ID')}
              </p>
            </div>
            {property.maps_link && (
              <div className="col-span-2">
                <p className="text-gray-500 mb-1">Lokasi</p>
                <a
                  href={property.maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Buka di Google Maps
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
