// types/property.ts

export type PropertyStatus = 'in_stock' | 'sold_out';
export type PropertyTipe = 'Ruko' | 'Villa';
export type PropertySiap = 'siap_huni' | 'siap_kosong' | 'siap_huni_renovasi';
export type PropertyHadap = 'Utara' | 'Selatan' | 'Timur' | 'Barat';

export interface Property {
  id: string;
  nama_property: string;
  group_name: string | null;
  lebar: number;
  panjang: number;
  hadap: PropertyHadap[];
  tipe: PropertyTipe;
  tingkat: number;
  price: number;
  carport: boolean;
  status: PropertyStatus;
  siap: PropertySiap;
  maps_link: string | null;
  kawasan: string[];
  unit: string | null;
  gambar_url?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PropertyFilter {
  search?: string;
  kawasan?: string[];
  hadap?: PropertyHadap[];
  tipe?: PropertyTipe;
  status?: PropertyStatus;
  siap?: PropertySiap[];
  carport?: boolean;
  lebar_min?: number;
  harga_max?: number;
  sort?: 'nama' | 'price' | 'created_at' | 'status';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: 25 | 50 | 100;
}
