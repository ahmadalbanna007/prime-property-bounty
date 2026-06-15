'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Property } from '@/types/property';
import PropertyForm from '@/components/dashboard/PropertyForm';

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properti/${params.id}`);
        if (!res.ok) throw new Error('Properti tidak ditemukan');
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [params.id]);

  if (loading) return <p className="text-sm text-gray-600">Memuat...</p>;
  if (error) return <p className="text-sm text-[var(--color-prime-red)]">{error}</p>;
  if (!property) return <p className="text-sm text-gray-600">Properti tidak ditemukan.</p>;

  return (
    <PropertyForm
      property={property}
      onCancel={() => router.push('/dashboard')}
    />
  );
}
