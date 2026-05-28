/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || "12")));
    const skip = (page - 1) * limit;

    let category = null;
    const internalWhere: any = { publish_status: "PUBLISHED" };

    if (slug) {
      category = await prisma.category.findUnique({
        where: { slug },
        select: { id: true, title: true, slug: true },
      });
      if (category) {
        internalWhere.categories = { some: { id: category.id } };
      } else {
        internalWhere.id = { in: [] };
      }
    }

    const [total, paginated] = await Promise.all([
      prisma.news.count({ where: internalWhere }),
      prisma.news.findMany({
        where: internalWhere,
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

    const hasMore = skip + paginated.length < total;

    return NextResponse.json({
      category,
      news: paginated.map((n) => ({
        id: n.id,
        title: n.title,
        description: n.description,
        highlight_text: n.highlight_text,
        image_url: n.featured_image,
        reporter_name: n.reporter_name,
        link: null,
        source: "internal",
        date: n.created_at,
      })),
      total,
      page,
      limit,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching news by category:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching news." },
      { status: 500 }
    );
  }
}
