import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "top";
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 20);

  try {
    const news = await prisma.externalNews.findMany({
      where: { category },
      orderBy: { pub_date: "desc" },
      take: limit,
      select: {
        id: true,
        article_id: true,
        title: true,
        description: true,
        link: true,
        source_name: true,
        image_url: true,
        pub_date: true,
        category: true,
      },
    });

    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    console.error("[external-news] Error:", error);
    return NextResponse.json({ error: "Failed to fetch external news" }, { status: 500 });
  }
}
