"use client";

import { FadeIn, StaggerGrid } from "@/components/ui/Animate";

const stats = [
  { value: "10+", label: "Tahun Pengalaman" },
  { value: "500+", label: "Properti Terjual" },
  { value: "300+", label: "Klien Puas" },
  { value: "100%", label: "Legalitas Aman" },
];

const values = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Inovatif",
    desc: "Menghadirkan solusi properti berbasis teknologi modern untuk pengalaman transaksi yang mudah dan efisien.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Terpercaya",
    desc: "Setiap properti telah melalui proses verifikasi legalitas yang ketat. Kepercayaan Anda adalah aset terbesar kami.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: "Profesional",
    desc: "Tim berpengalaman yang memahami kebutuhan Anda dan siap membantu menemukan properti terbaik.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Kompetitif",
    desc: "Harga properti kami dirancang untuk memberikan nilai terbaik — investasi yang menguntungkan di masa depan.",
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[40vh] flex items-center justify-center px-4 py-28 sm:py-32">
        <div className="absolute inset-0 bg-[#1A1A1A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,97,0.18),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(201,169,97,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,97,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="relative z-10 text-center">
          <FadeIn from="up">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-prime-gold)] mb-4">
              Tentang Kami
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Mitra Properti{" "}
              <span className="bg-gradient-to-r from-[var(--color-prime-gold)] to-amber-300 bg-clip-text text-transparent">
                Terpercaya
              </span>
            </h1>
            <p className="mt-4 text-gray-400 max-w-lg mx-auto">
              Membantu Anda menemukan hunian dan investasi properti terbaik di Medan
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ===== PROFIL + QUOTE (2 kolom) ===== */}
      <section className="relative px-4 py-20 sm:py-28 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Kolom Kiri — Teks */}
            <FadeIn from="left">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-prime-gold)] mb-3">
                  Profil Perusahaan
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-prime-black)] leading-snug">
                  Prime Property adalah platform properti terpercaya yang menyediakan hunian ruko dan villa berkualitas tinggi.
                </h2>
                <p className="mt-6 text-gray-500 leading-relaxed">
                  Didirikan pada tahun 2015, Prime Property telah menjadi pilihan utama
                  bagi ribuan keluarga dan investor properti di Medan. Kami berkomitmen
                  menghadirkan transaksi yang aman, transparan, dan menguntungkan bagi
                  seluruh pelanggan kami.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="/kontak"
                    className="group inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all duration-300 hover:brightness-110 shadow-md shadow-[var(--color-prime-gold)]/20"
                    style={{ backgroundColor: "var(--color-prime-gold)", color: "var(--color-prime-black)" }}
                  >
                    Hubungi Kami
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 font-semibold text-[var(--color-prime-black)] transition-all duration-300 hover:border-gray-300 hover:bg-gray-50"
                  >
                    Lihat Properti
                  </a>
                </div>
              </div>
            </FadeIn>

            {/* Kolom Kanan — Visual Quote */}
            <FadeIn from="right" delay={200}>
              <div className="relative">
                {/* Background card */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-zinc-800 rounded-3xl rotate-3 shadow-2xl" />
                <div className="relative bg-gradient-to-br from-[#1A1A1A] to-zinc-800 rounded-3xl p-10 sm:p-12 shadow-2xl">
                  {/* Quote icon */}
                  <svg className="w-12 h-12 text-[var(--color-prime-gold)]/30 mb-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
                  </svg>
                  <blockquote className="text-white/90 text-lg sm:text-xl font-medium leading-relaxed italic">
                    &ldquo;Kami tidak hanya menjual properti, kami membantu Anda menemukan rumah yang tepat
                    untuk masa depan keluarga.&rdquo;
                  </blockquote>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-prime-gold)] to-amber-400 flex items-center justify-center text-[#1A1A1A] font-bold text-lg">
                      PP
                    </div>
                    <div>
                      <p className="text-white font-semibold">Prime Property</p>
                      <p className="text-gray-400 text-sm">Tim Manajemen</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===== STATISTIK ===== */}
      <section className="relative px-4 py-16 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <FadeIn from="up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-gradient-to-br from-[#1A1A1A] to-zinc-800 rounded-3xl px-8 py-12 shadow-xl">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                    {s.value}
                  </p>
                  <p className="mt-2 text-xs text-gray-400 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== NILAI-NILAI KAMI ===== */}
      <section className="relative px-4 py-20 sm:py-28 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <FadeIn from="up">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-prime-gold)] mb-3">
                Nilai-Nilai Kami
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-prime-black)]">
                Prinsip Yang{" "}
                <span className="bg-gradient-to-r from-[var(--color-prime-gold)] to-amber-400 bg-clip-text text-transparent">
                  Kami Junjung
                </span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <FadeIn key={i} delay={i * 120} from="up">
                <div className="group relative bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden text-center">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-prime-gold)] to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-prime-gold)]/10 to-amber-100/50 text-[var(--color-prime-gold)] mb-5 group-hover:from-[var(--color-prime-gold)] group-hover:to-amber-400 group-hover:text-white transition-all duration-500">
                    {v.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-prime-black)] mb-2 group-hover:text-[var(--color-prime-gold)] transition-colors duration-300">
                    {v.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VISI & MISI ===== */}
      <section className="relative px-4 py-20 sm:py-28 lg:px-8">
        <div className="absolute inset-0 bg-[#1A1A1A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,169,97,0.12),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(201,169,97,1) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Visi */}
            <FadeIn from="left">
              <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur rounded-3xl p-10 border border-white/5 shadow-xl">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-prime-gold)]/15 text-[var(--color-prime-gold)] mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Visi Kami</h3>
                <p className="text-gray-400 leading-relaxed">
                  Menjadi platform properti terdepan yang menghubungkan pemilik properti
                  dengan calon pembeli melalui layanan yang transparan, profesional, dan
                  terpercaya di kota Medan dan seluruh Indonesia.
                </p>
              </div>
            </FadeIn>

            {/* Misi */}
            <FadeIn from="right" delay={150}>
              <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur rounded-3xl p-10 border border-white/5 shadow-xl">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-prime-gold)]/15 text-[var(--color-prime-gold)] mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Misi Kami</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-prime-gold)] shrink-0" />
                    Memberikan pengalaman pencarian properti yang mudah, cepat, dan aman.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-prime-gold)] shrink-0" />
                    Didukung oleh tim profesional yang berpengalaman di bidang properti.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-prime-gold)] shrink-0" />
                    Menyediakan data properti yang transparan dan akurat.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-prime-gold)] shrink-0" />
                    Membangun hubungan jangka panjang berdasarkan kepercayaan.
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
