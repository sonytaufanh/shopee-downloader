"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface VideoData {
  id: string;
  title: string;
  cover: string;
  duration: number;
  videoUrl: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "downloading" | "done" | "error">("idle");
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoData && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [videoData]);

  const handleExtract = useCallback(async (targetUrl: string) => {
    setError("");
    setVideoData(null);

    if (!targetUrl.trim()) {
      setError("Masukkan URL produk Shopee");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengekstrak video");
      }

      setVideoData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleExtract(url);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setUrl(text.trim());
        if (text.includes("shopee")) handleExtract(text.trim());
      }
    } catch {
      // Clipboard not available
    }
  };

  const handleDownload = async () => {
    if (!videoData || downloadStatus === "downloading") return;

    setDownloadStatus("downloading");
    try {
      const downloadUrl = `/api/download?url=${encodeURIComponent(videoData.videoUrl)}&id=${videoData.id}`;
      const res = await fetch(downloadUrl);

      if (!res.ok) throw new Error("Download gagal");

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `shopee_${videoData.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      setDownloadStatus("done");
      setTimeout(() => setDownloadStatus("idle"), 3000);
    } catch {
      setDownloadStatus("error");
      setTimeout(() => setDownloadStatus("idle"), 3000);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Download Video Shopee Tanpa Watermark
          </h1>
          <p className="text-lg sm:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Simpan video produk Shopee dalam kualitas HD. Gratis, cepat, dan tanpa perlu install aplikasi.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Tempel link produk Shopee di sini..."
              className="input-url flex-1 text-gray-900"
              disabled={loading}
            />
            <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap text-base sm:text-lg">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses...
                </span>
              ) : (
                "Download"
              )}
            </button>
          </form>

          {/* Paste Button */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handlePaste}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Paste Link
            </button>
          </div>

          {error && (
            <p className="mt-4 text-red-200 bg-red-900/30 inline-block px-4 py-2 rounded-lg">
              {error}
            </p>
          )}
        </div>
      </section>

      {/* Loading Skeleton */}
      {loading && (
        <section className="max-w-4xl mx-auto px-4 -mt-8">
          <div className="card animate-pulse">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="w-full sm:w-48 h-64 sm:h-auto flex-shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mb-2" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-4" />
                <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mt-8" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Result */}
      {videoData && (
        <section ref={resultRef} className="max-w-4xl mx-auto px-4 -mt-8">
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Thumbnail */}
              <div className="relative w-full sm:w-48 h-64 sm:h-auto flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                {videoData.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={videoData.cover} alt={videoData.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-orange-50">🛒</div>
                )}
                {videoData.duration > 0 && (
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(videoData.duration)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-3 dark:text-white">
                    {videoData.title || "Video Produk Shopee"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    🛒 Video Produk Shopee
                  </p>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={downloadStatus === "downloading"}
                  className={`btn-download w-full justify-center ${
                    downloadStatus === "done"
                      ? "bg-green-500 text-white"
                      : downloadStatus === "error"
                        ? "bg-red-500 text-white"
                        : downloadStatus === "downloading"
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white opacity-80 cursor-wait"
                          : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                  }`}
                >
                  {downloadStatus === "downloading" ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Mengunduh...
                    </span>
                  ) : downloadStatus === "done" ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Berhasil!
                    </span>
                  ) : downloadStatus === "error" ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Gagal, coba lagi
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Video
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 dark:text-white">
          Kenapa Memilih Shopee Downloader Kami?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="font-semibold text-lg mb-2 dark:text-white">Super Cepat</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Download video produk Shopee dalam hitungan detik.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-semibold text-lg mb-2 dark:text-white">Tanpa Watermark</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Video bersih tanpa watermark. Kualitas original dari Shopee.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="font-semibold text-lg mb-2 dark:text-white">Tanpa Aplikasi</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Langsung gunakan di browser. Tidak perlu install apa pun.
            </p>
          </div>
        </div>
      </section>

      {/* How To */}
      <section className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 dark:text-white">
            Cara Download Video Shopee
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2 dark:text-white">Salin Link Produk</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Buka Shopee, pilih produk yang ada video-nya, tap &quot;Bagikan&quot; lalu &quot;Salin Link&quot;.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2 dark:text-white">Tempel di Sini</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Paste link produk di kolom input di atas, lalu klik Download.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2 dark:text-white">Simpan Video</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Klik tombol download dan video langsung tersimpan di perangkat kamu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 dark:text-white">
          Pertanyaan yang Sering Diajukan
        </h2>
        <div className="space-y-4">
          <details className="card group">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center dark:text-white">
              Video Shopee apa saja yang bisa didownload?
              <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Semua video produk yang ditampilkan di halaman produk Shopee bisa didownload. Termasuk video review dan video deskripsi produk.
            </p>
          </details>
          <details className="card group">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center dark:text-white">
              Apakah gratis?
              <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Ya, 100% gratis tanpa batas download. Tidak perlu registrasi.
            </p>
          </details>
          <details className="card group">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center dark:text-white">
              Format link yang didukung?
              <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Kami mendukung link produk Shopee Indonesia (shopee.co.id) dalam berbagai format, baik link panjang maupun link pendek.
            </p>
          </details>
          <details className="card group">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center dark:text-white">
              Kenapa video tidak ditemukan?
              <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Tidak semua produk Shopee memiliki video. Pastikan produk yang kamu pilih memang ada video-nya di halaman produk.
            </p>
          </details>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Shopee Video Downloader",
            description: "Download video produk Shopee tanpa watermark secara gratis",
            url: process.env.NEXT_PUBLIC_SITE_URL || "https://shopeedownloader.id",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "All",
            offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
          }),
        }}
      />
    </main>
  );
}
