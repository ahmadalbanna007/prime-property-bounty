'use client';

import { useEffect, useState, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { z } from 'zod';

interface FilterChipsProps {
  filter: {
    search?: string;
    kawasan?: string[];
    hadap?: string[];
    tipe?: string;
    status?: string;
    siap?: string[];
    carport?: boolean | null;
    lebar_min?: number;
    harga_max?: number;
  };
  onRemove: (key: string, value: string | boolean) => void;
  onReset: () => void;
}

const chipColors: Record<string, string> = {
  search: 'bg-blue-100 text-blue-800',
  kawasan: 'bg-green-100 text-green-800',
  hadap: 'bg-purple-100 text-purple-800',
  tipe: 'bg-yellow-100 text-yellow-800',
  status: 'bg-red-100 text-[var(--color-prime-red)]',
  siap: 'bg-indigo-100 text-indigo-800',
  carport: 'bg-pink-100 text-pink-800',
  lebar_min: 'bg-orange-100 text-orange-800',
  harga_max: 'bg-orange-100 text-orange-800',
};

const chipLabels: Record<string, string> = {
  search: 'Pencarian',
  kawasan: 'Kawasan',
  hadap: 'Arah Hadap',
  tipe: 'Tipe',
  status: 'Status',
  siap: 'Kondisi',
  carport: 'Carport',
  lebar_min: 'Lebar Minimal',
  harga_max: 'Harga Maksimal',
};

export default function FilterChips({
  filter,
  onRemove,
  onReset,
}: FilterChipsProps) {
  const [chips, setChips] = useState<Array<{
    key: string;
    value: string | boolean;
    label: string;
    color: string;
  }>>([]);

  useEffect(() => {
    const newChips: Array<{
      key: string;
      value: string | boolean;
      label: string;
      color: string;
    }> = [];

    if (filter.search) {
      newChips.push({
        key: 'search',
        value: filter.search,
        label: chipLabels.search,
        color: chipColors.search,
      });
    }

    if (filter.kawasan && filter.kawasan.length > 0) {
      filter.kawasan.forEach((item) => {
        newChips.push({
          key: 'kawasan',
          value: item,
          label: `${chipLabels.kawasan}: ${item}`,
          color: chipColors.kawasan,
        });
      });
    }

    if (filter.hadap && filter.hadap.length > 0) {
      filter.hadap.forEach((item) => {
        newChips.push({
          key: 'hadap',
          value: item,
          label: `${chipLabels.hadap}: ${item}`,
          color: chipColors.hadap,
        });
      });
    }

    if (filter.tipe) {
      newChips.push({
        key: 'tipe',
        value: filter.tipe,
        label: `${chipLabels.tipe}: ${filter.tipe}`,
        color: chipColors.tipe,
      });
    }

    if (filter.status) {
      newChips.push({
        key: 'status',
        value: filter.status,
        label: `${chipLabels.status}: ${filter.status}`,
        color: chipColors.status,
      });
    }

    if (filter.siap && filter.siap.length > 0) {
      filter.siap.forEach((item) => {
        newChips.push({
          key: 'siap',
          value: item,
          label: `${chipLabels.siap}: ${item}`,
          color: chipColors.siap,
        });
      });
    }

    if (filter.carport !== null && filter.carport !== undefined) {
      newChips.push({
        key: 'carport',
        value: filter.carport,
        label: `${chipLabels.carport}: ${filter.carport ? 'Ya' : 'Tidak'}`,
        color: chipColors.carport,
      });
    }

    if (filter.lebar_min) {
      newChips.push({
        key: 'lebar_min',
        value: filter.lebar_min,
        label: `${chipLabels.lebar_min}: ${filter.lebar_min} m`,
        color: chipColors.lebar_min,
      });
    }

    if (filter.harga_max) {
      newChips.push({
        key: 'harga_max',
        value: filter.harga_max,
        label: `${chipLabels.harga_max}: Rp ${filter.harga_max.toLocaleString('id-ID')}`,
        color: chipColors.harga_max,
      });
    }

    setChips(newChips);
  }, [filter]);

  const handleRemove = useCallback(
    (key: string, value: string | boolean) => {
      onRemove(key, value);
    },
    [onRemove]
  );

  const handleReset = useCallback(() => {
    onReset();
  }, [onReset]);

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {chips.map((chip, index) => (
        <div key={`${chip.key}-${chip.value}-${index}`} className="flex items-center gap-1">
          <span
            className={`px-2.5 py-0.5 rounded text-xs font-medium ${chip.color}`}
          >
            {chip.label}
          </span>
          <button
            onClick={() => handleRemove(chip.key, chip.value)}
            className="p-0.5 rounded hover:bg-gray-200 transition-colors"
            aria-label={`Hapus filter ${chip.label}`}
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ))}

      {chips.length > 0 && (
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleReset();
          }}
          className="mt-2 text-xs text-[var(--color-prime-gold)] hover:underline"
        >
          Reset Filter
        </Link>
      )}
    </div>
  );
}
