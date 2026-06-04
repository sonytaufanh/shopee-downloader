import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-4">🛒</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Halaman yang kamu cari tidak ada.
        </p>
        <Link href="/" className="btn-primary inline-block">
          ← Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
