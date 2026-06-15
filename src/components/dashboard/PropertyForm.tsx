'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Property } from '@/types/property';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';

interface PropertyFormProps {
  property?: Property | null;
  onCancel?: () => void;
}

const kawasanOptions = ['Krakatau', 'Pancing', 'Setia Budi', 'Medan Johor'];
const hadapOptions = ['Utara', 'Selatan', 'Timur', 'Barat'];

export default function PropertyForm({ property, onCancel }: PropertyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    nama_property: property?.nama_property || '',
    group_name: property?.group_name || '',
    lebar: property?.lebar || 0,
    panjang: property?.panjang || 0,
    hadap: property?.hadap || [],
    tipe: property?.tipe || 'Ruko',
    tingkat: property?.tingkat || 1,
    price: property?.price || 0,
    carport: property?.carport || false,
    status: property?.status || 'in_stock',
    siap: property?.siap || 'siap_huni',
    maps_link: property?.maps_link || '',
    kawasan: property?.kawasan || [],
    unit: property?.unit || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const toggleMultiSelect = (field: 'hadap' | 'kawasan', value: string) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nama_property || formData.nama_property.length < 3) {
      newErrors.nama_property = 'Nama properti minimal 3 karakter';
    }
    if (formData.lebar <= 0) newErrors.lebar = 'Lebar harus lebih dari 0';
    if (formData.panjang <= 0) newErrors.panjang = 'Panjang harus lebih dari 0';
    if (formData.hadap.length === 0) newErrors.hadap = 'Pilih minimal 1 arah hadap';
    if (formData.price < 0) newErrors.price = 'Harga tidak boleh negatif';
    if (formData.kawasan.length === 0) newErrors.kawasan = 'Pilih minimal 1 kawasan';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setToast(null);

    try {
      const endpoint = property ? `/api/properti/${property.id}` : '/api/properti';
      const method = property ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Gagal menyimpan data');

      setToast({
        type: 'success',
        message: property ? 'Properti berhasil diupdate!' : 'Properti berhasil ditambahkan!',
      });

      if (!property) {
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Terjadi kesalahan',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded border ${errors[field] ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm focus:border-[var(--color-prime-gold)] focus:ring-[var(--color-prime-gold)]`;

  return (
    <div className="max-w-4xl">
      {toast && (
        <div className="mb-6">
          <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--color-prime-black)' }}>
          {property ? 'Edit Properti' : 'Tambah Properti Baru'}
        </h2>
        {onCancel && <Button variant="outline" onClick={onCancel}>Batal</Button>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Properti *</label>
            <input name="nama_property" value={formData.nama_property} onChange={handleChange} className={inputClass('nama_property')} placeholder="Ruko Grand Prime Blok A1" />
            {errors.nama_property && <p className="mt-1 text-xs text-[var(--color-prime-red)]">{errors.nama_property}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
            <input name="group_name" value={formData.group_name} onChange={handleChange} className={inputClass('group_name')} placeholder="Grand Prime" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lebar (m) *</label>
            <input name="lebar" type="number" value={formData.lebar} onChange={handleChange} className={inputClass('lebar')} min="0" step="0.01" />
            {errors.lebar && <p className="mt-1 text-xs text-[var(--color-prime-red)]">{errors.lebar}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Panjang (m) *</label>
            <input name="panjang" type="number" value={formData.panjang} onChange={handleChange} className={inputClass('panjang')} min="0" step="0.01" />
            {errors.panjang && <p className="mt-1 text-xs text-[var(--color-prime-red)]">{errors.panjang}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Arah Hadap *</label>
          <div className="flex flex-wrap gap-2">
            {hadapOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" checked={formData.hadap.includes(opt)} onChange={() => toggleMultiSelect('hadap', opt)} />
                {opt}
              </label>
            ))}
          </div>
          {errors.hadap && <p className="mt-1 text-xs text-[var(--color-prime-red)]">{errors.hadap}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe *</label>
            <select name="tipe" value={formData.tipe} onChange={handleChange} className={inputClass('tipe')}>
              <option value="Ruko">Ruko</option>
              <option value="Villa">Villa</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat *</label>
            <input name="tingkat" type="number" value={formData.tingkat} onChange={handleChange} className={inputClass('tingkat')} min="1" max="10" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp) *</label>
          <input name="price" type="number" value={formData.price} onChange={handleChange} className={inputClass('price')} min="0" />
          {errors.price && <p className="mt-1 text-xs text-[var(--color-prime-red)]">{errors.price}</p>}
        </div>

        <label className="flex items-center gap-3">
          <input type="checkbox" name="carport" checked={formData.carport} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-[var(--color-prime-gold)] focus:ring-[var(--color-prime-gold)]" />
          <span className="text-sm font-medium text-gray-700">Memiliki Carport</span>
        </label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select name="status" value={formData.status} onChange={handleChange} className={inputClass('status')}>
              <option value="in_stock">In Stock</option>
              <option value="sold_out">Sold Out</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi Siap *</label>
            <select name="siap" value={formData.siap} onChange={handleChange} className={inputClass('siap')}>
              <option value="siap_huni">Siap Huni</option>
              <option value="siap_kosong">Siap Kosong</option>
              <option value="siap_huni_renovasi">Siap Huni Renovasi</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link Google Maps</label>
          <input name="maps_link" type="url" value={formData.maps_link} onChange={handleChange} className={inputClass('maps_link')} placeholder="https://google.com/maps/..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kawasan *</label>
          <div className="flex flex-wrap gap-2">
            {kawasanOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" checked={formData.kawasan.includes(opt)} onChange={() => toggleMultiSelect('kawasan', opt)} />
                {opt}
              </label>
            ))}
          </div>
          {errors.kawasan && <p className="mt-1 text-xs text-[var(--color-prime-red)]">{errors.kawasan}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <input name="unit" value={formData.unit} onChange={handleChange} className={inputClass('unit')} placeholder="A-01" />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" loading={isSubmitting}>
            {property ? 'Update Properti' : 'Simpan Properti'}
          </Button>
        </div>
      </form>
    </div>
  );
}
