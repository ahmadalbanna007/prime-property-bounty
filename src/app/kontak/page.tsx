"use client";

import { type FormEvent, useState } from "react";

type Notifikasi = {
  type: "success" | "error";
  message: string;
};

export default function KontakPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [pesan, setPesan] = useState("");
  const [hpError, setHpError] = useState<string | null>(null);
  const [notifikasi, setNotifikasi] = useState<Notifikasi | null>(null);
  const [mengirim, setMengirim] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHpError(null);
    setNotifikasi(null);

    const digitHp = noHp.replace(/\D/g, "");
    if (digitHp.length < 10) {
      setHpError("Nomor HP minimal 10 digit.");
      return;
    }

    setMengirim(true);

    try {
      const res = await fetch("/api/kontak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: nama.trim(),
          email: email.trim(),
          no_hp: noHp.trim(),
          pesan: pesan.trim(),
        }),
      });

      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        setNotifikasi({
          type: "error",
          message:
            data.error ??
            (res.status === 429
              ? "Batas pengiriman tercapai. Coba lagi dalam 1 jam."
              : "Gagal mengirim pesan. Silakan coba lagi."),
        });
        return;
      }

      setNotifikasi({
        type: "success",
        message:
          data.message ??
          "Pesan terkirim, tim kami akan menghubungi Anda.",
      });
      setNama("");
      setEmail("");
      setNoHp("");
      setPesan("");
    } catch {
      setNotifikasi({
        type: "error",
        message: "Terjadi kesalahan jaringan. Silakan coba lagi.",
      });
    } finally {
      setMengirim(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-colors focus:border-[var(--color-prime-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-prime-gold)]";

  return (
    <div className="px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1
          className="text-3xl font-semibold sm:text-4xl"
          style={{ color: "var(--color-prime-black)" }}
        >
          Hubungi Kami
        </h1>
        <p className="mt-3 text-base text-[var(--color-prime-black)]/75">
          Isi formulir di bawah ini dan tim Prime Property akan segera
          menghubungi Anda.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-xl border border-white/10 p-6 shadow-xl sm:p-8"
          style={{ backgroundColor: "var(--color-prime-black)" }}
          noValidate
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="nama"
                className="block text-sm font-medium"
                style={{ color: "var(--color-prime-gold)" }}
              >
                Nama
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                required
                autoComplete="name"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama lengkap Anda"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium"
                style={{ color: "var(--color-prime-gold)" }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="no_hp"
                className="block text-sm font-medium"
                style={{ color: "var(--color-prime-gold)" }}
              >
                No HP
              </label>
              <input
                id="no_hp"
                name="no_hp"
                type="tel"
                required
                autoComplete="tel"
                value={noHp}
                onChange={(e) => {
                  setNoHp(e.target.value);
                  if (hpError) setHpError(null);
                }}
                placeholder="08xxxxxxxxxx"
                className={`${inputClass}${hpError ? " border-[var(--color-prime-red)] ring-1 ring-[var(--color-prime-red)]" : ""}`}
                aria-invalid={hpError ? true : undefined}
                aria-describedby={hpError ? "no_hp-error" : undefined}
              />
              {hpError && (
                <p
                  id="no_hp-error"
                  className="mt-1.5 text-sm"
                  style={{ color: "var(--color-prime-red)" }}
                >
                  {hpError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="pesan"
                className="block text-sm font-medium"
                style={{ color: "var(--color-prime-gold)" }}
              >
                Pesan
              </label>
              <textarea
                id="pesan"
                name="pesan"
                required
                rows={5}
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder="Tuliskan pertanyaan atau kebutuhan properti Anda..."
                className={`${inputClass} resize-y min-h-[120px]`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={mengirim}
            className="mt-8 w-full rounded-md px-6 py-3 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[200px]"
            style={{
              backgroundColor: "var(--color-prime-gold)",
              color: "var(--color-prime-black)",
            }}
          >
            {mengirim ? "Mengirim..." : "Kirim Pesan"}
          </button>

          {notifikasi && (
            <p
              role="alert"
              className={`mt-4 rounded-md border px-4 py-3 text-sm ${
                notifikasi.type === "success"
                  ? "border-green-600/30 bg-green-50 text-green-800"
                  : "border-[var(--color-prime-red)]/30 bg-red-50 text-[var(--color-prime-red)]"
              }`}
            >
              {notifikasi.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
