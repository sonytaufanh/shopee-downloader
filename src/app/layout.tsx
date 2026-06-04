import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#ea580c",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://shopeedownloader.id"
  ),
  title: {
    default: "Download Video Shopee Tanpa Watermark - Shopee Video Downloader Gratis",
    template: "%s | Shopee Downloader",
  },
  description:
    "Download video produk Shopee dan Shopee Video tanpa watermark secara gratis. Simpan video review produk dalam kualitas HD.",
  keywords: [
    "download video shopee",
    "shopee video downloader",
    "download shopee video tanpa watermark",
    "simpan video shopee",
    "shopee downloader",
    "download video produk shopee",
    "shopee video download gratis",
  ],
  openGraph: {
    title: "Download Video Shopee Tanpa Watermark",
    description: "Download video produk Shopee secara gratis. Kualitas HD, tanpa watermark.",
    type: "website",
    locale: "id_ID",
    siteName: "Shopee Downloader",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <footer className="bg-gray-900 dark:bg-black text-gray-400 py-8 mt-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="mb-2">
              &copy; {new Date().getFullYear()} Shopee Downloader. Semua hak dilindungi.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <a href="/cara-download" className="hover:text-white transition-colors">
                Cara Download
              </a>
              <a href="/tentang" className="hover:text-white transition-colors">
                Tentang
              </a>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Disclaimer: Kami tidak berafiliasi dengan Shopee. Tool ini hanya untuk penggunaan pribadi.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
