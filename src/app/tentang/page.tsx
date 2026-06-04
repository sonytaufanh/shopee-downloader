import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang Shopee Video Downloader",
  description: "Shopee Video Downloader adalah tool gratis untuk download video produk Shopee tanpa watermark.",
  alternates: { canonical: "/tentang" },
};

export default function TentangPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Tentang Shopee Video Downloader
        </h1>

        <div className="prose prose-lg text-gray-600 dark:text-gray-300 space-y-4">
          <p>
            Shopee Video Downloader adalah layanan online gratis yang membantu Anda
            menyimpan video produk dari Shopee tanpa watermark. Cocok untuk seller
            yang ingin melihat video kompetitor, atau pembeli yang ingin menyimpan
            video review produk.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Fitur Utama</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Download video produk Shopee tanpa watermark</li>
            <li>Gratis tanpa batas download</li>
            <li>Tidak perlu registrasi atau login</li>
            <li>Tidak perlu install aplikasi</li>
            <li>Kompatibel dengan semua perangkat</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Disclaimer</h2>
          <p>
            Shopee Video Downloader tidak berafiliasi dengan Shopee atau Sea Limited.
            Tool ini hanya untuk penggunaan pribadi. Pengguna bertanggung jawab atas
            penggunaan konten yang didownload.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="btn-primary inline-block">
            Mulai Download →
          </Link>
        </div>
      </div>
    </main>
  );
}
