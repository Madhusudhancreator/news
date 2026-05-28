import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || "12")));
    const skip = (page - 1) * limit;

    if (!q) {
      return NextResponse.json({ news: [], total: 0, hasMore: false });
    }

    const where = {
      publish_status: "PUBLISHED" as const,
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
        { highlight_text: { contains: q, mode: "insensitive" as const } },
        { tag: { contains: q, mode: "insensitive" as const } },
      ],
    };

    const [total, news] = await Promise.all([
      prisma.news.count({ where }),
      prisma.news.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          highlight_text: true,
          featured_image: true,
          reporter_name: true,
          created_at: true,
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      news: news.map((n) => ({ ...n, created_at: n.created_at.toISOString() })),
      total,
      page,
      limit,
      hasMore: skip + news.length < total,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
