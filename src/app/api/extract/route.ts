import { NextRequest, NextResponse } from "next/server";
import { extractShopeeVideo, isValidShopeeUrl } from "@/lib/shopee";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL produk Shopee diperlukan" },
        { status: 400 }
      );
    }

    if (!isValidShopeeUrl(url)) {
      return NextResponse.json(
        { error: "URL tidak valid. Pastikan URL berasal dari Shopee Indonesia (shopee.co.id)." },
        { status: 400 }
      );
    }

    const videoData = await extractShopeeVideo(url);

    return NextResponse.json(videoData);
  } catch (error) {
    console.error("Extract error:", error);
    const message =
      error instanceof Error ? error.message : "Gagal mengekstrak video";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
