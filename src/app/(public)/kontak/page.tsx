"use client";

import { useState, type FormEvent } from "react";
import { FadeIn } from "@/components/ui/Animate";

type ToastState = { type: "success" | "error"; message: string } | null;

const contactInfo = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: "Alamat Kantor",
    value: "Jl. Setia Budi No. 123, Medan, Sumatera Utara 20123",
    href: "https://maps.google.com/?q=Medan+Setia+Budi",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    label: "Telepon",
    value: "(061) 1234-5678",
    href: "tel:+626112345678",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: "Email",
    value: "info@primeproperty.id",
    href: "mailto:info@primeproperty.id",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    label: "WhatsApp",
    value: "+62 812-3456-7890",
    href: "https://wa.me/6281234567890",
  },
];

export default function KontakPage() {
  const [toast, setToast] = useState<ToastState>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    no_hp: "",
    pesan: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nama.trim()) e.nama = "Nama wajib diisi.";
    if (!form.email.trim()) e.email = "Email wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email tidak valid.";
    if (!form.no_hp.trim()) e.no_hp = "Nomor HP wajib diisi.";
    else if (form.no_hp.replace(/\D/g, "").length < 10) e.no_hp = "Nomor HP minimal 10 digit.";
    if (!form.pesan.trim()) e.pesan = "Pesan wajib diisi.";
    return e;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setLoading(true);
    setToast(null);
    try {
      const res = await fetch("/api/kontak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Gagal mengirim pesan.");
      setToast({ type: "success", message: "Pesan berhasil dikirim! Kami akan menghubungi Anda segera." });
      setForm({ nama: "", email: "", no_hp: "", pesan: "" });
    } catch (err) {
      setToast({ type: "error", message: err instanceof Error ? err.message : "Terjadi kesalahan." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-lg border ${errors[field] ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[var(--color-prime-gold)]/20"} px-4 py-3 text-sm bg-white focus:border-[var(--color-prime-gold)] focus:ring-1 outline-none transition-all duration-200`;

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[35vh] flex items-center justify-center px-4 py-28 sm:py-32">
        <div className="absolute inset-0 bg-[#1A1A1A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,97,0.15),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(201,169,97,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,97,1) 1px, transparent 1px)", backgroundSize: "50px 50px" }}
        />
        <div className="relative z-10 text-center">
          <FadeIn from="up">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-prime-gold)] mb-4">
              Hubungi Kami
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Kami Siap{" "}
              <span className="bg-gradient-to-r from-[var(--color-prime-gold)] to-amber-300 bg-clip-text text-transparent">
                Membantu Anda
              </span>
            </h1>
            <p className="mt-4 text-gray-400 max-w-lg mx-auto">
              Punya pertanyaan atau ingin konsultasi? Tim Prime Property siap membantu Anda.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ===== TOAST ===== */}
      {toast && (
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-6 mb-8">
          <FadeIn from="up">
            <div
              role="alert"
              className={`flex items-center gap-3 rounded-xl border px-5 py-4 text-sm font-medium ${
                toast.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {toast.type === "success" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              {toast.message}
              <button onClick={() => setToast(null)} className="ml-auto p-1 hover:opacity-70 transition-opacity">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </FadeIn>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <section className="relative px-4 pb-24 sm:px-6 lg:px-8 -mt-8">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact Info Cards */}
            <div className="lg:col-span-2 space-y-6">
              {contactInfo.map((info, i) => (
                <FadeIn key={i} delay={i * 100} from="left">
                  <a
                    href={info.href}
                    target={info.href.startsWith("http") ? "_blank" : undefined}
                    rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-start gap-5 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:border-[var(--color-prime-gold)]/30 transition-all duration-500 hover:-translate-y-0.5"
                  >
                    <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-prime-gold)]/10 to-amber-100/50 text-[var(--color-prime-gold)] group-hover:from-[var(--color-prime-gold)] group-hover:to-amber-400 group-hover:text-white transition-all duration-500">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{info.label}</p>
                      <p className="mt-1 text-sm font-medium text-[var(--color-prime-black)] group-hover:text-[var(--color-prime-gold)] transition-colors duration-300">{info.value}</p>
                    </div>
                    <svg className="w-4 h-4 ml-auto mt-2 text-gray-300 group-hover:text-[var(--color-prime-gold)] group-hover:translate-x-0.5 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </FadeIn>
              ))}

              {/* Google Maps */}
              <FadeIn from="left" delay={400}>
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-64 group">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127482.61290053496!2d98.60489586486673!3d3.595196568545894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3031317ae0fecf53%3A0x3039d80a220dc20!2sMedan%2C%20Kota%20Medan%2C%20Sumatera%20Utara!5e0!3m2!1sid!2sid!4v1710000000000"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Peta Prime Property Medan"
                    className="filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </FadeIn>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <FadeIn from="right" delay={200}>
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-gray-100 bg-white p-8 sm:p-10 shadow-sm hover:shadow-xl transition-shadow duration-500 space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-prime-black)]">
                      Kirim Pesan
                    </h2>
                    <p className="mt-1.5 text-sm text-gray-400">
                      Isi form di bawah dan tim kami akan merespon dalam 1x24 jam.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nama Lengkap <span className="text-[var(--color-prime-red)]">*</span>
                      </label>
                      <input
                        id="nama"
                        value={form.nama}
                        onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                        className={inputClass("nama")}
                        placeholder="John Doe"
                      />
                      {errors.nama && <p className="mt-1 text-xs text-[var(--color-prime-red)]">{errors.nama}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email <span className="text-[var(--color-prime-red)]">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className={inputClass("email")}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="mt-1 text-xs text-[var(--color-prime-red)]">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="no_hp" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nomor HP <span className="text-[var(--color-prime-red)]">*</span>
                    </label>
                    <input
                      id="no_hp"
                      type="tel"
                      value={form.no_hp}
                      onChange={(e) => setForm((f) => ({ ...f, no_hp: e.target.value }))}
                      className={inputClass("no_hp")}
                      placeholder="0812-3456-7890"
                    />
                    {errors.no_hp && <p className="mt-1 text-xs text-[var(--color-prime-red)]">{errors.no_hp}</p>}
                  </div>

                  <div>
                    <label htmlFor="pesan" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Pesan <span className="text-[var(--color-prime-red)]">*</span>
                    </label>
                    <textarea
                      id="pesan"
                      rows={5}
                      value={form.pesan}
                      onChange={(e) => setForm((f) => ({ ...f, pesan: e.target.value }))}
                      className={inputClass("pesan") + " resize-none"}
                      placeholder="Tulis pesan Anda di sini..."
                    />
                    {errors.pesan && <p className="mt-1 text-xs text-[var(--color-prime-red)]">{errors.pesan}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-xl font-semibold py-3.5 px-6 text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "var(--color-prime-gold)", color: "var(--color-prime-black)" }}
                  >
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                    <span className="relative inline-flex items-center gap-2">
                      {loading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          Kirim Pesan
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12m0 0l-4-4m4 4l-4 4" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
