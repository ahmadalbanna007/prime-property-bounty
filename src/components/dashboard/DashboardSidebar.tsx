"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { href: "/dashboard", label: "Daftar Properti" },
  { href: "/dashboard/pesan", label: "Pesan Masuk" },
] as const;

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [keluar, setKeluar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setKeluar(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Gagal keluar. Silakan coba lagi.");
        setKeluar(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setKeluar(false);
    }
  }

  return (
    <aside
      className="flex w-64 shrink-0 flex-col border-r border-white/10"
      style={{ backgroundColor: "var(--color-prime-black)" }}
    >
      <div className="border-b border-white/10 px-5 py-6">
        <p
          className="text-lg font-semibold tracking-tight"
          style={{ color: "var(--color-prime-gold)" }}
        >
          Prime Property
        </p>
        <p className="mt-1 text-xs text-white/60">Portal Agen</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Menu dashboard">
        {menuItems.map((item) => {
          const aktif =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                aktif
                  ? "text-[var(--color-prime-black)]"
                  : "text-white/80 hover:bg-white/5 hover:text-[var(--color-prime-gold)]"
              }`}
              style={
                aktif
                  ? { backgroundColor: "var(--color-prime-gold)" }
                  : undefined
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={keluar}
          className="w-full rounded-md border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--color-prime-gold)]/10 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            borderColor: "var(--color-prime-gold)",
            color: "var(--color-prime-gold)",
          }}
        >
          {keluar ? "Keluar..." : "Keluar"}
        </button>
        {error && (
          <p
            className="mt-2 text-xs"
            style={{ color: "var(--color-prime-red)" }}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </aside>
  );
}
