'use client';

import PropertyForm from '@/components/dashboard/PropertyForm';
import { useRouter } from 'next/navigation';

export default function NewPropertyPage() {
  const router = useRouter();

  return (
    <PropertyForm onCancel={() => router.push('/dashboard')} />
  );
}
