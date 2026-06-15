'use client';

import { useState } from 'react';
import type { Property } from '@/types/property';
import Badge from '@/components/ui/Badge';

interface PropertyTableProps {
  properties: Property[];
  loading: boolean;
  onRowClick: (property: Property) => void;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function PropertyTable({
  properties,
  loading,
  onRowClick,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: PropertyTableProps) {
  const totalPages = Math.ceil(total / limit);

  const formatRupiah = (value: number): string => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const getStatusVariant = (status: string) => {
    return status === 'in_stock' ? 'success' : 'danger';
  };

  const getStatusLabel = (status: string) => {
    return status === 'in_stock' ? 'In Stock' : 'Sold Out';
  };

  const getSiapVariant = (siap: string) => {
    if (siap === 'siap_huni') return 'gold';
    if (siap === 'siap_kosong') return 'purple';
    return 'info';
  };

  const getSiapLabel = (siap: string) => {
    if (siap === 'siap_huni') return 'Siap Huni';
    if (siap === 'siap_kosong') return 'Siap Kosong';
    return 'Siap Huni Renovasi';
  };

  const handlePrevPage = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--color-prime-gold)] border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Tidak ada properti
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Belum ada properti yang sesuai dengan filter Anda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Nama</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Group</th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Lebar × Panjang
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Hadap</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Tipe</th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Tingkat
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Harga</th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Carport
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Siap</th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Kawasan
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {properties.map((property) => (
              <tr
                key={property.id}
                onClick={() => onRowClick(property)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {property.nama_property}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {property.group_name || '-'}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {property.lebar} × {property.panjang} m
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {property.hadap.join(', ')}
                </td>
                <td className="px-4 py-3 text-gray-600">{property.tipe}</td>
                <td className="px-4 py-3 text-gray-600">{property.tingkat}</td>
                <td
                  className="px-4 py-3 font-semibold"
                  style={{ color: 'var(--color-prime-gold)' }}
                >
                  {formatRupiah(property.price)}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {property.carport ? '✓' : '-'}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={getStatusVariant(property.status)}>
                    {getStatusLabel(property.status)}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={getSiapVariant(property.siap)}>
                    {getSiapLabel(property.siap)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {property.kawasan.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          <label
            htmlFor="limit"
            className="text-sm font-medium text-gray-700"
          >
            Tampilkan:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value))}
            className="rounded border-gray-300 px-3 py-1.5 text-sm focus:border-[var(--color-prime-gold)] focus:ring-[var(--color-prime-gold)]"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-sm text-gray-700">
            {(page - 1) * limit + 1}-
            {Math.min(page * limit, total)} dari {total}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={page <= 1}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← Sebelumnya
          </button>
          <span className="text-sm font-medium text-gray-700">
            Halaman {page} dari {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Berikutnya →
          </button>
        </div>
      </div>
    </div>
  );
}
