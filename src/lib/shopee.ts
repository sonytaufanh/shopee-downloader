export interface ShopeeVideoData {
  id: string;
  title: string;
  cover: string;
  duration: number;
  videoUrl: string;
  shopId?: string;
  itemId?: string;
}

// Resolve short URLs (id.shp.ee, s.shopee.co.id) to full product URL
async function resolveShortUrl(url: string): Promise<string> {
  const shortPatterns = [
    /^https?:\/\/id\.shp\.ee\//,
    /^https?:\/\/s\.shopee\.co\.id\//,
    /^https?:\/\/shp\.ee\//,
  ];

  const isShort = shortPatterns.some((p) => p.test(url));
  if (!isShort) return url;

  // Follow redirects to get the final URL
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    // The final URL after redirects
    const finalUrl = response.url;
    if (finalUrl && finalUrl.includes("shopee.co.id")) {
      return finalUrl;
    }

    // If HEAD doesn't give us the redirect, try GET
    if (!finalUrl || finalUrl === url) {
      const getResponse = await fetch(url, {
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      if (getResponse.url && getResponse.url.includes("shopee.co.id")) {
        return getResponse.url;
      }
    }

    return finalUrl || url;
  } catch {
    throw new Error(
      "Gagal resolve link pendek Shopee. Coba gunakan link lengkap dari halaman produk."
    );
  }
}

// Extract Shopee item ID and shop ID from URL
function parseShopeeUrl(url: string): { shopId: string; itemId: string } | null {
  // Format: https://shopee.co.id/product-name-i.SHOP_ID.ITEM_ID
  const pattern1 = /shopee\.co\.id\/.*-i\.(\d+)\.(\d+)/;
  // Format: https://shopee.co.id/product/SHOP_ID/ITEM_ID
  const pattern2 = /shopee\.co\.id\/product\/(\d+)\/(\d+)/;
  // Format with query params: ?itemid=XXX&shopid=XXX
  const pattern3 = /shopee\.co\.id\/.*[?&]itemid=(\d+).*[?&]shopid=(\d+)/i;
  const pattern3b = /shopee\.co\.id\/.*[?&]shopid=(\d+).*[?&]itemid=(\d+)/i;
  // Format: i.SHOP_ID.ITEM_ID anywhere in URL
  const pattern4 = /i\.(\d+)\.(\d+)/;

  let match = url.match(pattern1);
  if (match) return { shopId: match[1], itemId: match[2] };

  match = url.match(pattern2);
  if (match) return { shopId: match[1], itemId: match[2] };

  match = url.match(pattern3);
  if (match) return { shopId: match[2], itemId: match[1] };

  match = url.match(pattern3b);
  if (match) return { shopId: match[1], itemId: match[2] };

  match = url.match(pattern4);
  if (match) return { shopId: match[1], itemId: match[2] };

  return null;
}

export async function extractShopeeVideo(url: string): Promise<ShopeeVideoData> {
  // Step 1: Resolve short URLs
  const resolvedUrl = await resolveShortUrl(url);

  // Step 2: Parse the resolved URL
  const parsed = parseShopeeUrl(resolvedUrl);

  if (!parsed) {
    throw new Error(
      "Tidak bisa menemukan info produk dari URL ini. Pastikan link mengarah ke halaman produk Shopee yang memiliki video."
    );
  }

  // Step 3: Fetch product data from Shopee API
  const apiUrl = `https://shopee.co.id/api/v4/item/get?shopid=${parsed.shopId}&itemid=${parsed.itemId}`;

  const response = await fetch(apiUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://shopee.co.id/",
      "af-ac-enc-dat": "null",
      "x-api-source": "pc",
      "x-shopee-language": "id",
    },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data produk. Silakan coba lagi.");
  }

  const json = await response.json();

  if (!json.data) {
    throw new Error("Produk tidak ditemukan. Pastikan link valid dan produk masih tersedia.");
  }

  const item = json.data;

  // Check if product has video
  if (!item.video_info_list || item.video_info_list.length === 0) {
    throw new Error(
      "Produk ini tidak memiliki video. Coba link produk lain yang ada video-nya."
    );
  }

  const video = item.video_info_list[0];

  // Try multiple video URL sources
  let videoUrl = "";
  if (video.default_format && video.default_format.url) {
    videoUrl = video.default_format.url;
  } else if (video.formats && video.formats.length > 0) {
    // Get highest quality format
    const sorted = video.formats.sort(
      (a: { width?: number }, b: { width?: number }) =>
        (b.width || 0) - (a.width || 0)
    );
    videoUrl = sorted[0].url;
  } else if (video.video_url) {
    videoUrl = video.video_url;
  } else if (video.url) {
    videoUrl = video.url;
  }

  if (!videoUrl) {
    throw new Error("Video tidak bisa diakses saat ini. Coba lagi nanti.");
  }

  return {
    id: `${parsed.shopId}_${parsed.itemId}`,
    title: item.name || "Video Produk Shopee",
    cover: item.image
      ? `https://down-id.img.susercontent.com/${item.image}`
      : "",
    duration: Math.round((video.duration || 0) / 1000),
    videoUrl: videoUrl,
    shopId: parsed.shopId,
    itemId: parsed.itemId,
  };
}

export function isValidShopeeUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?shopee\.co\.id\//,
    /^https?:\/\/s\.shopee\.co\.id\//,
    /^https?:\/\/id\.shp\.ee\//,
    /^https?:\/\/shp\.ee\//,
  ];
  return patterns.some((p) => p.test(url));
}
