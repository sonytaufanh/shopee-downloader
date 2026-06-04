import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cara Download Video Shopee Tanpa Watermark 2025",
  description: "Panduan lengkap cara download video produk Shopee tanpa watermark. Langkah mudah simpan video Shopee di HP dan komputer.",
  alternates: { canonical: "/cara-download" },
};

export default function CaraDownloadPage() {
  return (
    <main className="min-h-screen py-12">
      <article className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Cara Download Video Shopee Tanpa Watermark 2025
        </h1>

        <div className="prose prose-lg text-gray-600 dark:text-gray-300 space-y-6">
          <p>
            Ingin menyimpan video produk dari Shopee? Banyak seller menampilkan video
            detail produk yang berguna untuk referensi. Dengan tool kami, Anda bisa
            download video tersebut dengan mudah.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Langkah-Langkah Download
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
            1. Salin Link Produk
          </h3>
          <p>
            Buka aplikasi Shopee atau website Shopee. Cari produk yang memiliki video.
            Tap tombol &quot;Bagikan&quot; (ikon share) lalu pilih &quot;Salin Link&quot;.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
            2. Paste di Shopee Downloader
          </h3>
          <p>
            Kunjungi halaman utama Shopee Downloader. Tempelkan link produk di kolom
            input. Bisa juga tap tombol &quot;Paste Link&quot; untuk paste otomatis dari clipboard.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
            3. Download Video
          </h3>
          <p>
            Klik tombol Download. Sistem akan mengekstrak video dari halaman produk.
            Setelah muncul preview, klik &quot;Download Video&quot; untuk menyimpan ke perangkat.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Format Link yang Didukung
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-400">
            <li>https://shopee.co.id/nama-produk-i.123456.789012</li>
            <li>https://shopee.co.id/product/123456/789012</li>
            <li>Link pendek dari tombol Share di app Shopee</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Tips
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
            <li>Pastikan produk memang memiliki video (tidak semua produk ada video)</li>
            <li>Link harus dari Shopee Indonesia (shopee.co.id)</li>
            <li>Jika gagal, coba refresh dan paste ulang link-nya</li>
          </ul>

          <div className="mt-8 p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
            <p className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-3">
              Siap download video Shopee?
            </p>
            <Link href="/" className="btn-primary inline-block no-underline">
              Mulai Download →
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
