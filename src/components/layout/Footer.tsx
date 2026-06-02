import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto border-t border-white/10"
      style={{ backgroundColor: "var(--color-prime-black)" }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p
            className="text-lg font-semibold"
            style={{ color: "var(--color-prime-gold)" }}
          >
            Prime Property
          </p>
          <p className="mt-1 text-sm text-white/70">
            Solusi properti terpercaya untuk Anda.
          </p>
        </div>

        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80"
          aria-label="Navigasi footer"
        >
          <Link
            href="/"
            className="transition-colors hover:text-[var(--color-prime-gold)]"
          >
            Beranda
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-[var(--color-prime-gold)]"
          >
            Tentang Kami
          </Link>
          <Link
            href="/kontak"
            className="transition-colors hover:text-[var(--color-prime-gold)]"
          >
            Kontak
          </Link>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-white/50 sm:px-6 lg:px-8">
          © {year} Prime Property. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
