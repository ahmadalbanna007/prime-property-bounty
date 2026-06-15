"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const menuItems = [
  { href: "/dashboard", label: "Daftar Properti", icon: "list" },
  { href: "/dashboard/pesan", label: "Pesan Masuk", icon: "mail" },
] as const;

// Items khusus superadmin
const superadminItems = [
  { href: "/dashboard/audit-log", label: "Audit Log", icon: "shield" },
] as const;

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [keluar, setKeluar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setRole(data.role))
      .catch(() => setRole(null));
  }, []);

  const isSuper = role === "superadmin";

  const allItems = isSuper
    ? [...menuItems, ...superadminItems]
    : menuItems;

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

      router.push("/agent/login");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setKeluar(false);
    }
  }

  const renderIcon = (icon: string) => {
    const cls = "h-4 w-4 shrink-0";
    switch (icon) {
      case "list":
        return (
          <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        );
      case "mail":
        return (
          <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "shield":
        return (
          <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
    }
  };

  return (
    <aside
      className="flex w-64 shrink-0 flex-col border-r border-white/10"
      style={{ backgroundColor: "var(--color-prime-black)" }}
    >
      {/* Logo & Brand */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <img
          src="/images/logo/logo-icon.svg"
          alt="Prime Property"
          className="h-9 w-9"
        />
        <div>
          <p
            className="text-sm font-semibold leading-tight tracking-tight"
            style={{ color: "var(--color-prime-gold)" }}
          >
            Prime Property
          </p>
          <p className="text-[10px] leading-tight text-white/50">Portal Agen</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 p-3" aria-label="Menu dashboard">
        {allItems.map((item) => {
          const aktif =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                aktif
                  ? "text-[var(--color-prime-black)]"
                  : "text-white/70 hover:bg-white/5 hover:text-[var(--color-prime-gold)]"
              }`}
              style={
                aktif
                  ? { backgroundColor: "var(--color-prime-gold)" }
                  : undefined
              }
            >
              {renderIcon(item.icon)}
              {item.label}
            </Link>
          );
        })}

        {isSuper && (
          <div className="mt-6 mb-2 px-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
              Superadmin
            </p>
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={keluar}
          className="flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--color-prime-gold)]/10 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            borderColor: "rgba(201, 169, 97, 0.3)",
            color: "var(--color-prime-gold)",
          }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
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
