# Prime Property — AC Compliance & Improvement Plan

## Current Status: Most AC criteria are MET, with 10 gaps

### ✅ ALREADY COMPLIANT
- **AC-1** Branding & Design System (colors, typography, logo, layout)
- **AC-2.1** Hero Section (black bg, gold CTA, secondary button)
- **AC-2.3** Header Navigation (sticky, correct order, Login Agent button)
- **AC-3** About Us (visi, misi, komitmen, 2-column layout)
- **AC-4.2** Contact Form (validation, toast, rate limit 3/IP/hr)
- **AC-5** Auth (login, lockout, roles, logout, backend auth check)
- **AC-6** Property Schema (all fields defined)
- **AC-7.1** Dashboard Table (11 columns, pagination, sorting, badges)
- **AC-7.2** Filters (all filters, 300ms debounce, URL sync, chips, reset)
- **AC-7.3** Detail Drawer (2-column, Maps button, Edit/Hapus RBAC)
- **AC-8** CRUD (create, edit, soft delete, confirmation modal)
- **AC-9.3** Bahasa Indonesia throughout

### ❌ MISSING / NEEDS FIXING
1. **AC-2.2** — "Mengapa Prime Property" section with 3-4 value propositions + icons (MISSING)
2. **AC-2.2** — "Properti Unggulan" limited to max 6 highlight properties (currently shows all)
3. **AC-4.1** — Contact info (address, phone, email, WhatsApp link) displayed above form (MISSING)
4. **AC-8.4** — Validation gaps: maps_link must contain google.com/maps, tingkat max 1 desimal, price must be integer, nama max 100 chars
5. **Dashboard/Pesan** — Placeholder page, needs real data from kontak table
6. **Dashboard/Audit Log** — Placeholder page, needs real table with data

### 🎨 VISUAL UPGRADES
- Landing page needs the "Mengapa Prime Property" section with modern icons
- Smoother animations & transitions
- Dashboard table row hover with gold accent
- Better loading states with proper skeletons
- Contact page needs address/location card + Google Maps embed
