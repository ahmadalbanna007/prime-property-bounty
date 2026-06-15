"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#1A1A1A]/95 backdrop-blur-lg shadow-lg shadow-black/10 border-b border-white/5"
          : "bg-[#1A1A1A] border-b border-white/5"
      }`}
    >
      <div className="mx-auto flex h-16 sm:h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <img
            src="/images/logo/logo2.jpg"
            alt="Prime Property"
            className="h-8 w-auto sm:h-9 transition-all duration-300 group-hover:brightness-110"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi utama">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive
                    ? "text-[var(--color-prime-gold)] bg-[var(--color-prime-gold)]/10"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-[var(--color-prime-gold)] to-amber-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/agent/login"
            className="group relative hidden sm:inline-flex items-center gap-2 overflow-hidden rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300 hover:shadow-lg"
            style={{
              borderColor: "var(--color-prime-gold)",
              color: "var(--color-prime-gold)",
            }}
          >
            <span className="absolute inset-0 bg-[var(--color-prime-gold)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <span className="relative group-hover:text-[#1A1A1A] transition-colors duration-300">
              Login Agent
            </span>
            <svg
              className="relative w-4 h-4 group-hover:text-[#1A1A1A] transition-colors duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden hover:bg-white/5 transition-colors"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="border-t border-white/5 bg-[#1A1A1A]/98 backdrop-blur-lg px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-[var(--color-prime-gold)] bg-[var(--color-prime-gold)]/10"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/agent/login"
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-[var(--color-prime-gold)] hover:bg-[var(--color-prime-gold)]/10 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Login Agent
          </Link>
        </nav>
      </div>
    </header>
  );
}
