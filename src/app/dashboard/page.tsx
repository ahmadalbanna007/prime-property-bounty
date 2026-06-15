'use client';

import { Suspense } from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import type { Property, PropertyFilter } from '@/types/property';
import PropertyTable from '@/components/dashboard/PropertyTable';
import FilterBar from '@/components/dashboard/FilterBar';
import FilterChips from '@/components/dashboard/FilterChips';
import PropertyDrawer from '@/components/dashboard/PropertyDrawer';

/** Fallback loading untuk Suspense */
function DashboardSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
      <div className="h-48 animate-pulse rounded-lg bg-gray-100" />
    </div>
  );
}

export default function DashboardPageWrapper() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardPage />
    </Suspense>
  );
}

function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Role state
  const [role, setRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(() => {
    const p = searchParams.get('page');
    return p ? parseInt(p) : 1;
  });
  const [limit, setLimit] = useState<25 | 50 | 100>(() => {
    const l = searchParams.get('limit');
    return (l === '25' || l === '100') ? parseInt(l) as 25 | 100 : 50;
  });
  const [total, setTotal] = useState(0);

  // Filter state from URL
  const [filter, setFilter] = useState<PropertyFilter>(() => {
    const f: PropertyFilter = {};
    const s = searchParams.get('search');
    if (s) f.search = s;
    const k = searchParams.getAll('kawasan');
    if (k.length > 0) f.kawasan = k;
    const h = searchParams.getAll('hadap');
    if (h.length > 0) f.hadap = h as any[];
    const t = searchParams.get('tipe');
    if (t) f.tipe = t as any;
    const st = searchParams.get('status');
    if (st) f.status = st as any;
    const si = searchParams.getAll('siap');
    if (si.length > 0) f.siap = si as any[];
    const c = searchParams.get('carport');
    if (c === 'true') f.carport = true;
    else if (c === 'false') f.carport = false;
    const lm = searchParams.get('lebar_min');
    if (lm) f.lebar_min = parseFloat(lm);
    const hm = searchParams.get('harga_max');
    if (hm) f.harga_max = parseFloat(hm);
    const sort = searchParams.get('sort');
    if (sort) f.sort = sort as any;
    const order = searchParams.get('order');
    if (order) f.order = order as any;
    return f;
  });

  // Sync URL with filter state
  const syncUrl = useCallback((newFilter: PropertyFilter, newPage: number, newLimit: 25 | 50 | 100) => {
    const params = new URLSearchParams();

    if (newFilter.search) params.set('search', newFilter.search);
    newFilter.kawasan?.forEach(k => params.append('kawasan', k));
    newFilter.hadap?.forEach(h => params.append('hadap', h));
    if (newFilter.tipe) params.set('tipe', newFilter.tipe);
    if (newFilter.status) params.set('status', newFilter.status);
    newFilter.siap?.forEach(s => params.append('siap', s));
    if (newFilter.carport !== undefined) params.set('carport', String(newFilter.carport));
    if (newFilter.lebar_min) params.set('lebar_min', String(newFilter.lebar_min));
    if (newFilter.harga_max) params.set('harga_max', String(newFilter.harga_max));
    if (newFilter.sort) params.set('sort', newFilter.sort);
    if (newFilter.order) params.set('order', newFilter.order);
    if (newPage > 1) params.set('page', String(newPage));
    if (newLimit !== 50) params.set('limit', String(newLimit));

    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [router, pathname]);

  // Fetch properties
  const fetchProperties = useCallback(async (f: PropertyFilter, p: number, l: 25 | 50 | 100) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (f.search) params.set('search', f.search);
      f.kawasan?.forEach(k => params.append('kawasan', k));
      f.hadap?.forEach(h => params.append('hadap', h));
      if (f.tipe) params.set('tipe', f.tipe);
      if (f.status) params.set('status', f.status);
      f.siap?.forEach(s => params.append('siap', s));
      if (f.carport !== undefined) params.set('carport', String(f.carport));
      if (f.lebar_min) params.set('lebar_min', String(f.lebar_min));
      if (f.harga_max) params.set('harga_max', String(f.harga_max));
      if (f.sort) params.set('sort', f.sort);
      if (f.order) params.set('order', f.order);
      params.set('page', String(p));
      params.set('limit', String(l));

      const res = await fetch(`/api/properti?${params.toString()}`);
      if (!res.ok) throw new Error('Gagal memuat data properti');

      const totalCount = parseInt(res.headers.get('X-Total-Count') || '0');
      setTotal(totalCount);

      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch role on mount
  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setRole(data.role);
      } catch {
        setRole(null);
      } finally {
        setRoleLoading(false);
      }
    }
    fetchRole();
  }, []);

  // Fetch properties when filter/page/limit changes
  useEffect(() => {
    fetchProperties(filter, page, limit);
  }, [filter, page, limit, fetchProperties]);

  // Filter change handler
  const handleFilterChange = useCallback((newFilter: PropertyFilter) => {
    setFilter(newFilter);
    setPage(1);
    syncUrl(newFilter, 1, limit);
  }, [limit, syncUrl]);

  // Remove individual chip
  const handleRemoveChip = useCallback((key: string, value: string | boolean) => {
    const updated = { ...filter };

    if (key === 'search') delete updated.search;
    else if (key === 'kawasan') {
      updated.kawasan = filter.kawasan?.filter(k => k !== value) || [];
      if (updated.kawasan.length === 0) delete updated.kawasan;
    } else if (key === 'hadap') {
      updated.hadap = filter.hadap?.filter(h => h !== value) as any[] || [];
      if (updated.hadap.length === 0) delete updated.hadap;
    } else if (key === 'tipe') delete updated.tipe;
    else if (key === 'status') delete updated.status;
    else if (key === 'siap') {
      updated.siap = filter.siap?.filter(s => s !== value) as any[] || [];
      if (updated.siap.length === 0) delete updated.siap;
    } else if (key === 'carport') delete updated.carport;
    else if (key === 'lebar_min') delete updated.lebar_min;
    else if (key === 'harga_max') delete updated.harga_max;

    setFilter(updated);
    setPage(1);
    syncUrl(updated, 1, limit);
  }, [filter, limit, syncUrl]);

  // Reset all filters
  const handleResetFilter = useCallback(() => {
    const empty: PropertyFilter = {};
    setFilter(empty);
    setPage(1);
    syncUrl(empty, 1, limit);
  }, [limit, syncUrl]);

  // Pagination
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    syncUrl(filter, newPage, limit);
  }, [filter, limit, syncUrl]);

  const handleLimitChange = useCallback((newLimit: number) => {
    const l = newLimit as 25 | 50 | 100;
    setLimit(l);
    setPage(1);
    syncUrl(filter, 1, l);
  }, [filter, syncUrl]);

  // Row click
  const handleRowClick = useCallback((property: Property) => {
    setSelectedProperty(property);
    setDrawerOpen(true);
  }, []);

  // Handle deleted
  const handleDeleted = useCallback((id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    setTotal(prev => Math.max(0, prev - 1));
  }, []);

  const isSuper = role === 'superadmin';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: 'var(--color-prime-black)' }}
          >
            Daftar Properti
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Total: {total} properti
          </p>
        </div>

        {!roleLoading && isSuper && (
          <Link
            href="/dashboard/properti/new"
            className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-prime-gold)',
              color: 'var(--color-prime-black)',
            }}
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            + Tambah Properti
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <FilterBar
        onFilterChange={handleFilterChange}
      />

      {/* Filter Chips */}
      <FilterChips
        filter={filter}
        onRemove={handleRemoveChip}
        onReset={handleResetFilter}
      />

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-[var(--color-prime-red)]">{error}</p>
        </div>
      )}

      {/* Property Table */}
      <div className="mt-4">
        <PropertyTable
          properties={properties}
          loading={loading}
          onRowClick={handleRowClick}
          page={page}
          limit={limit}
          total={total}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>

      {/* Detail Drawer */}
      <PropertyDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        property={selectedProperty}
        isSuperadmin={isSuper}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
