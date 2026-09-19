This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

# Prime Property

Website landing page & dashboard admin untuk manajemen properti Prime Property — dibangun dengan Next.js dan Supabase.

**Demo:** [prime-property-bounty-nine.vercel.app](https://prime-property-bounty-nine.vercel.app)

## Fitur

- **Landing Page** — Hero section, Tentang Kami, Kontak, dan daftar Properti Unggulan
- **Autentikasi Agent/Admin** — Login dengan lockout otomatis (max 5 percobaan gagal / 15 menit)
- **Dashboard Admin**
  - Tabel properti (pagination, sorting, filter, debounce search)
  - Detail drawer properti (integrasi Google Maps)
  - CRUD properti (create, edit, soft delete)
  - Manajemen pesan masuk dari form kontak
  - Audit log aktivitas
- **Role-based Access Control** — `admin` & `superadmin`
- **Bahasa Indonesia** di seluruh antarmuka

## Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Backend / Auth / DB | [Supabase](https://supabase.com) (`@supabase/ssr`) |
| Form & Validasi | React Hook Form + Zod |
| Bahasa | TypeScript |

## Struktur Folder

```
src/
├── app/
│   ├── (public)/          # Landing page, about, kontak, login
│   ├── agent/login/        # Halaman login agent
│   ├── api/                 # Route handlers (auth, admin, properti, kontak, audit-logs)
│   └── dashboard/           # Dashboard admin (properti, pesan, audit log)
├── components/
│   ├── dashboard/            # Komponen khusus dashboard
│   ├── layout/                # Header, Footer
│   └── ui/                     # Komponen UI reusable (Button, Modal, Toast, dll.)
├── lib/                        # Auth helper, validasi (Zod schemas)
├── types/                      # Definisi tipe TypeScript
├── utils/supabase/            # Supabase client (browser, server, admin)
└── middleware.ts               # Proteksi route /dashboard
```

## Memulai (Development)

### Prasyarat

- Node.js 18+
- Project Supabase (URL, anon key, service role key)

### Instalasi

```bash
npm install
```

### Environment Variables

Buat file `.env.local` di root project:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` hanya digunakan di server (route admin) — jangan pernah expose ke client atau commit ke repo.

### Jalankan Server Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Script Lain

```bash
npm run build   # build untuk production
npm run start   # jalankan build production
npm run lint    # cek linting
```

## Akses Demo

Untuk keperluan review/testing dashboard admin, silakan hubungi pemilik repo untuk mendapatkan akun demo. Kredensial tidak dipublikasikan di sini demi keamanan sistem yang sedang live.

## Deployment

Project ini siap deploy ke [Vercel](https://vercel.com). Pastikan environment variables di atas sudah diset di dashboard Vercel sebelum deploy.

## Skema Data Properti

Entitas `Property` mencakup: nama, grup, ukuran (lebar/panjang), arah hadap, tipe (Ruko/Villa), tingkat, harga, carport, status (in stock/sold out), kesiapan unit, link Google Maps, kawasan, dan gambar — dengan soft delete (`deleted_at`).

## Lisensi

Private — hak cipta dilindungi.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
