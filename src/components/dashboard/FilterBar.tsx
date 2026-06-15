'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { PropertyFilter, PropertyTipe, PropertyStatus } from '@/types/property';

interface FilterBarProps {
  onFilterChange: (filter: PropertyFilter) => void;
  initialFilter?: PropertyFilter;
}

const kawasanOptions = ['Krakatau', 'Pancing', 'Setia Budi', 'Medan Johor', 'Cemara Asri', 'Helvetia'];
const hadapOptions = ['Utara', 'Selatan', 'Timur', 'Barat'];
const siapOptions = ['siap_huni', 'siap_kosong', 'siap_huni_renovasi'];

export default function FilterBar({ onFilterChange, initialFilter }: FilterBarProps) {
  const [search, setSearch] = useState(initialFilter?.search || '');
  const [kawasan, setKawasan] = useState<string[]>(initialFilter?.kawasan || []);
  const [hadap, setHadap] = useState<string[]>(initialFilter?.hadap || []);
  const [tipe, setTipe] = useState<string>(initialFilter?.tipe || '');
  const [status, setStatus] = useState<string>(initialFilter?.status || '');
  const [siap, setSiap] = useState<string[]>(initialFilter?.siap || []);
  const [carport, setCarport] = useState<boolean | null>(initialFilter?.carport ?? null);
  const [lebarMin, setLebarMin] = useState<string>(initialFilter?.lebar_min?.toString() || '');
  const [hargaMax, setHargaMax] = useState<string>(initialFilter?.harga_max?.toString() || '');
  const [sort, setSort] = useState<string>(initialFilter?.sort || 'created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>(initialFilter?.order || 'desc');

  // Prevent initial run
  const firstRender = useRef(true);

  const buildFilter = useCallback((): PropertyFilter => {
    const filter: PropertyFilter = {};
    
    if (search.trim()) filter.search = search.trim();
    if (kawasan.length > 0) filter.kawasan = kawasan;
    if (hadap.length > 0) filter.hadap = hadap as any[];
    if (tipe) filter.tipe = tipe as any;
    if (status) filter.status = status as any;
    if (siap.length > 0) filter.siap = siap as any[];
    if (carport !== null) filter.carport = carport;
    if (lebarMin) filter.lebar_min = parseFloat(lebarMin);
    if (hargaMax) filter.harga_max = parseFloat(hargaMax);
    if (sort) filter.sort = sort as any;
    if (order) filter.order = order;
    
    return filter;
  }, [search, kawasan, hadap, tipe, status, siap, carport, lebarMin, hargaMax, sort, order]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onFilterChange(buildFilter());
    }, 300);
    
    return () => clearTimeout(timer);
  }, [buildFilter, onFilterChange]);

  // Sync with initialFilter changes (e.g. from Chips remove)
  useEffect(() => {
    if (initialFilter) {
      setSearch(initialFilter.search || '');
      setKawasan(initialFilter.kawasan || []);
      setHadap(initialFilter.hadap || []);
      setTipe(initialFilter.tipe || '');
      setStatus(initialFilter.status || '');
      setSiap(initialFilter.siap || []);
      setCarport(initialFilter.carport ?? null);
      setLebarMin(initialFilter.lebar_min?.toString() || '');
      setHargaMax(initialFilter.harga_max?.toString() || '');
      setSort(initialFilter.sort || 'created_at');
      setOrder(initialFilter.order || 'desc');
    }
  }, [initialFilter]);

  const handleReset = () => {
    setSearch('');
    setKawasan([]);
    setHadap([]);
    setTipe('');
    setStatus('');
    setSiap([]);
    setCarport(null);
    setLebarMin('');
    setHargaMax('');
    setSort('created_at');
    setOrder('desc');
  };

  const toggleMultiSelect = (value: string, current: string[], setter: (val: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter((v) => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Filter & Pencarian</h3>
        <button
          onClick={handleReset}
          className="text-xs text-[var(--color-prime-gold)] font-medium hover:underline"
        >
          Reset Filter
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-xs font-semibold text-gray-700 mb-2">
            Pencarian Cepat
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nama, group, kawasan..."
              className="w-full rounded-md border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-[var(--color-prime-gold)] focus:ring-[var(--color-prime-gold)]"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Lebar Min */}
        <div>
          <label htmlFor="lebar_min" className="block text-xs font-semibold text-gray-700 mb-2">
            Lebar Minimal (m)
          </label>
          <input
            id="lebar_min"
            type="number"
            value={lebarMin}
            onChange={(e) => setLebarMin(e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            className="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-prime-gold)] focus:ring-[var(--color-prime-gold)]"
          />
        </div>

        {/* Harga Max */}
        <div>
          <label htmlFor="harga_max" className="block text-xs font-semibold text-gray-700 mb-2">
            Harga Maksimal (Rp)
          </label>
          <input
            id="harga_max"
            type="number"
            value={hargaMax}
            onChange={(e) => setHargaMax(e.target.value)}
            placeholder="0"
            min="0"
            className="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-prime-gold)] focus:ring-[var(--color-prime-gold)]"
          />
        </div>

        {/* Carport */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Carport</label>
          <div className="flex rounded-md border border-gray-300 p-0.5">
            {[
              { label: 'Semua', value: null },
              { label: 'Ya', value: true },
              { label: 'Tidak', value: false },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setCarport(opt.value)}
                className={`flex-1 rounded py-1.5 text-xs font-medium transition-colors ${
                  carport === opt.value
                    ? 'bg-[var(--color-prime-gold)] text-[var(--color-prime-black)]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Tipe Radio */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-3">Tipe Properti</label>
          <div className="flex gap-4">
            {[
              { label: 'Semua', value: '' },
              { label: 'Ruko', value: 'Ruko' },
              { label: 'Villa', value: 'Villa' },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipe"
                  checked={tipe === opt.value}
                  onChange={() => setTipe(opt.value)}
                  className="h-4 w-4 text-[var(--color-prime-gold)] focus:ring-[var(--color-prime-gold)] border-gray-300"
                />
                <span className="text-xs text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Radio */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-3">Status Listing</label>
          <div className="flex gap-4">
            {[
              { label: 'Semua', value: '' },
              { label: 'In Stock', value: 'in_stock' },
              { label: 'Sold Out', value: 'sold_out' },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === opt.value}
                  onChange={() => setStatus(opt.value)}
                  className="h-4 w-4 text-[var(--color-prime-gold)] focus:ring-[var(--color-prime-gold)] border-gray-300"
                />
                <span className="text-xs text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="sort" className="block text-xs font-semibold text-gray-700 mb-2">
              Urutkan Berdasarkan
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-prime-gold)] focus:ring-[var(--color-prime-gold)]"
            >
              <option value="created_at">Tanggal Dibuat</option>
              <option value="nama">Nama Properti</option>
              <option value="price">Harga</option>
              <option value="status">Status</option>
            </select>
          </div>
          <div>
            <label htmlFor="order" className="block text-xs font-semibold text-gray-700 mb-2">
              Arah Urutan
            </label>
            <select
              id="order"
              value={order}
              onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
              className="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-prime-gold)] focus:ring-[var(--color-prime-gold)]"
            >
              <option value="desc">Terbaru / Tertinggi</option>
              <option value="asc">Terlama / Terendah</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kawasan Multi */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-3">Kawasan</p>
          <div className="flex flex-wrap gap-2">
            {kawasanOptions.map((option) => (
              <button
                key={option}
                onClick={() => toggleMultiSelect(option, kawasan, setKawasan)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold rounded-md border transition-all ${
                  kawasan.includes(option)
                    ? 'bg-[var(--color-prime-gold)] text-[var(--color-prime-black)] border-[var(--color-prime-gold)] shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--color-prime-gold)]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Hadap Multi */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-3">Arah Hadap</p>
          <div className="flex flex-wrap gap-2">
            {hadapOptions.map((option) => (
              <button
                key={option}
                onClick={() => toggleMultiSelect(option, hadap, setHadap)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold rounded-md border transition-all ${
                  hadap.includes(option)
                    ? 'bg-[var(--color-prime-gold)] text-[var(--color-prime-black)] border-[var(--color-prime-gold)] shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--color-prime-gold)]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Siap Multi */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-3">Kondisi Siap</p>
          <div className="flex flex-wrap gap-2">
            {siapOptions.map((option) => (
              <button
                key={option}
                onClick={() => toggleMultiSelect(option, siap, setSiap)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold rounded-md border transition-all ${
                  siap.includes(option)
                    ? 'bg-[var(--color-prime-gold)] text-[var(--color-prime-black)] border-[var(--color-prime-gold)] shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--color-prime-gold)]'
                }`}
              >
                {option.replace('siap_', '').replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
