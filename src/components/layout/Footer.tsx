import Link from "next/link";
import { FadeIn } from "@/components/ui/Animate";

const quickLinks = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto border-t border-white/10"
      style={{ backgroundColor: "var(--color-prime-black)" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <FadeIn from="up" delay={0}>
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block group">
                <img
                  src="/images/logo/logo2.jpg"
                  alt="Prime Property"
                  className="h-9 w-auto transition-all duration-300 group-hover:brightness-110"
                />
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-white/60 max-w-xs">
                Platform properti modern yang menyediakan Ruko dan Villa berkualitas premium di lokasi strategis Medan dan sekitarnya.
              </p>
              <div className="mt-5 flex gap-3">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 text-white/50 hover:bg-[var(--color-prime-gold)] hover:text-[#1A1A1A] transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
                <a
                  href="mailto:info@primeproperty.id"
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 text-white/50 hover:bg-[var(--color-prime-gold)] hover:text-[#1A1A1A] transition-all duration-300"
                  aria-label="Email"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </a>
              </div>
            </div>
          </FadeIn>

          {/* Quick Links */}
          <FadeIn from="up" delay={100}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                Navigasi
              </p>
              <nav className="flex flex-col gap-3" aria-label="Navigasi footer">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-white/70 transition-all duration-300 hover:text-[var(--color-prime-gold)] hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </FadeIn>

          {/* Contact */}
          <FadeIn from="up" delay={200}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                Kontak
              </p>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2 group">
                  <svg className="w-4 h-4 shrink-0 text-[var(--color-prime-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Medan, Sumatera Utara
                </li>
                <li className="flex items-center gap-2 group">
                  <svg className="w-4 h-4 shrink-0 text-[var(--color-prime-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <a href="mailto:info@primeproperty.id" className="hover:text-[var(--color-prime-gold)] transition-colors duration-300">
                    info@primeproperty.id
                  </a>
                </li>
                <li className="flex items-center gap-2 group">
                  <svg className="w-4 h-4 shrink-0 text-[var(--color-prime-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <a href="tel:+62612345678" className="hover:text-[var(--color-prime-gold)] transition-colors duration-300">
                    (061) 1234-5678
                  </a>
                </li>
              </ul>
            </div>
          </FadeIn>

          {/* Agent Link */}
          <FadeIn from="up" delay={300}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                Portal Agen
              </p>
              <p className="text-sm text-white/60 mb-4 leading-relaxed">
                Akses dashboard internal untuk agen properti terdaftar.
              </p>
              <Link
                href="/agent/login"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--color-prime-gold)",
                  color: "var(--color-prime-black)",
                }}
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative">Login Agent</span>
                <svg className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              &copy; {year} Prime Property. Hak cipta dilindungi.
            </p>
            <p className="text-xs text-white/30">
              Dibuat dengan <span className="text-[var(--color-prime-gold)]">♥</span> untuk properti Indonesia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
