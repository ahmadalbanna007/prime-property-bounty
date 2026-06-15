import { z } from 'zod';
import type { PropertyHadap, PropertySiap, PropertyStatus, PropertyTipe } from '@/types/property';

const hadapEnum = z.enum(['Utara', 'Selatan', 'Timur', 'Barat']);
const tipeEnum = z.enum(['Ruko', 'Villa']);
const statusEnum = z.enum(['in_stock', 'sold_out']);
const siapEnum = z.enum(['siap_huni', 'siap_kosong', 'siap_huni_renovasi']);

export const propertySchema = z.object({
  nama_property: z
    .string()
    .trim()
    .min(3, 'Nama properti minimal 3 karakter')
    .max(100, 'Nama properti maksimal 100 karakter'),
  group_name: z.string().trim().optional().nullable(),
  lebar: z
    .number()
    .positive('Lebar harus lebih dari 0'),
  panjang: z
    .number()
    .positive('Panjang harus lebih dari 0'),
  hadap: z
    .array(hadapEnum)
    .min(1, 'Pilih minimal 1 arah hadap'),
  tipe: tipeEnum,
  tingkat: z
    .number()
    .min(1, 'Tingkat minimal 1')
    .max(10, 'Tingkat maksimal 10'),
  price: z
    .number()
    .int('Harga harus bilangan bulat')
    .nonnegative('Harga tidak boleh negatif'),
  carport: z.boolean(),
  status: statusEnum,
  siap: siapEnum,
  maps_link: z
    .string()
    .trim()
    .url('Link Google Maps tidak valid')
    .refine(
      (val) => val.includes('google.com/maps'),
      'Link harus dari Google Maps'
    )
    .optional()
    .nullable()
    .or(z.literal('')),
  kawasan: z
    .array(z.string().trim())
    .min(1, 'Pilih minimal 1 kawasan'),
  unit: z.string().trim().optional().nullable(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const propertyFilterSchema = z.object({
  search: z.string().trim().optional(),
  kawasan: z.array(z.string()).optional(),
  hadap: z.array(hadapEnum).optional(),
  tipe: tipeEnum.optional(),
  status: statusEnum.optional(),
  siap: z.array(siapEnum).optional(),
  carport: z.boolean().optional(),
  lebar_min: z.number().positive().optional(),
  harga_max: z.number().positive().optional(),
  sort: z.enum(['nama', 'price', 'created_at', 'status']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.enum(['25', '50', '100']).optional(),
});

export type PropertyFilterData = z.infer<typeof propertyFilterSchema>;
