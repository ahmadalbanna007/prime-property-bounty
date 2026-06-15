export default function AboutPage() {
  return (
    <div className="px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1
          className="text-3xl font-semibold sm:text-4xl"
          style={{ color: 'var(--color-prime-black)' }}
        >
          Tentang Kami
        </h1>
        <p className="mt-4 text-base text-[var(--color-prime-black)]/75">
          Prime Property adalah platform properti terpercaya yang menyediakan
          hunian ruko dan villa berkualitas tinggi.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <h2
              className="text-xl font-semibold"
              style={{ color: 'var(--color-prime-gold)' }}
            >
              Visi Kami
            </h2>
            <p className="mt-3 text-base text-[var(--color-prime-black)]/75">
              Menjadi platform properti terdepan yang menghubungkan pemilik
              properti dengan calon pembeli melalui layanan yang transparan,
              profesional, dan terpercaya.
            </p>
          </div>

          <div>
            <h2
              className="text-xl font-semibold"
              style={{ color: 'var(--color-prime-gold)' }}
            >
              Misi Kami
            </h2>
            <p className="mt-3 text-base text-[var(--color-prime-black)]/75">
              Memberikan pengalaman pencarian properti yang mudah, cepat, dan
              aman dengan dukungan tim profesional yang berpengalaman di bidang
              properti.
            </p>
          </div>

          <div>
            <h2
              className="text-xl font-semibold"
              style={{ color: 'var(--color-prime-gold)' }}
            >
              Komitmen Kami
            </h2>
            <p className="mt-3 text-base text-[var(--color-prime-black)]/75">
              Kami berkomitmen untuk menyediakan properti berkualitas dengan
              harga yang kompetitif, proses transaksi yang transparan, dan
              layanan purna jual yang memuaskan.
            </p>
          </div>

          <div>
            <h2
              className="text-xl font-semibold"
              style={{ color: 'var(--color-prime-gold)' }}
            >
              Keunggulan Kami
            </h2>
            <ul className="mt-3 space-y-2 text-base text-[var(--color-prime-black)]/75">
              <li>✓ Properti tersertifikasi dan legal</li>
              <li>✓ Harga kompetitif dan transparan</li>
              <li>✓ Tim profesional berpengalaman</li>
              <li>✓ Proses cepat dan mudah</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
