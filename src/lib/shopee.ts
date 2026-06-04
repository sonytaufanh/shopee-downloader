export interface ShopeeVideoData {
  id: string;
  title: string;
  cover: string;
  duration: number;
  videoUrl: string;
  shopId?: string;
  itemId?: string;
}

export interface ShopeeExtractResult {
  success: boolean;
  data?: ShopeeVideoData;
  error?: string;
}

// Extract Shopee item ID and shop ID from URL
function parseShopeeUrl(url: string): { shopId: string; itemId: string } | null {
  // Format: https://shopee.co.id/product-name-i.SHOP_ID.ITEM_ID
  const pattern1 = /shopee\.co\.id\/.*-i\.(\d+)\.(\d+)/;
  // Format: https://shopee.co.id/product/SHOP_ID/ITEM_ID
  const pattern2 = /shopee\.co\.id\/product\/(\d+)\/(\d+)/;
  // Short link format
  const pattern3 = /shopee\.co\.id\/.*\?.*itemid=(\d+).*shopid=(\d+)/i;

  let match = url.match(pattern1);
  if (match) return { shopId: match[1], itemId: match[2] };

  match = url.match(pattern2);
  if (match) return { shopId: match[1], itemId: match[2] };

  match = url.match(pattern3);
  if (match) return { shopId: match[2], itemId: match[1] };

  return null;
}

// Check if it's a Shopee Video URL
function isShopeeVideoUrl(url: string): boolean {
  return /shopee\.co\.id\/video/.test(url);
}

export async function extractShopeeVideo(url: string): Promise<ShopeeVideoData> {
  const parsed = parseShopeeUrl(url);

  if (!parsed && !isShopeeVideoUrl(url)) {
    throw new Error("URL tidak valid. Pastikan URL berasal dari Shopee.");
  }

  if (parsed) {
    // Product video - fetch from Shopee API
    const apiUrl = `https://shopee.co.id/api/v4/item/get?shopid=${parsed.shopId}&itemid=${parsed.itemId}`;

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://shopee.co.id/",
        "af-ac-enc-dat": "null",
        "x-api-source": "pc",
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data produk. Silakan coba lagi.");
    }

    const json = await response.json();

    if (!json.data) {
      throw new Error("Produk tidak ditemukan. Pastikan link valid.");
    }

    const item = json.data;

    // Check if product has video
    if (!item.video_info_list || item.video_info_list.length === 0) {
      throw new Error("Produk ini tidak memiliki video. Coba link produk lain yang ada video-nya.");
    }

    const video = item.video_info_list[0];
    const videoUrl = video.default_format?.url || video.video_url || "";

    if (!videoUrl) {
      throw new Error("Video tidak bisa diakses. Coba lagi nanti.");
    }

    return {
      id: `${parsed.shopId}_${parsed.itemId}`,
      title: item.name || "Video Produk Shopee",
      cover: item.image ? `https://down-id.img.susercontent.com/${item.image}` : "",
      duration: Math.round((video.duration || 0) / 1000),
      videoUrl: videoUrl,
      shopId: parsed.shopId,
      itemId: parsed.itemId,
    };
  }

  // Shopee Video (short video) - different extraction
  throw new Error("Format Shopee Video belum didukung. Gunakan link produk Shopee.");
}

export function isValidShopeeUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?shopee\.co\.id\//,
    /^https?:\/\/s\.shopee\.co\.id\//,
  ];
  return patterns.some((p) => p.test(url));
}
