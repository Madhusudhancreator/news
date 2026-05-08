/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

export const dynamic = "force-dynamic";

// Maps internal category slugs to external news category strings
const EXTERNAL_CATEGORY_MAP: Record<string, string> = {
  national: "top",
  politics: "politics",
  economy: "business",
  international: "world",
  sports: "sports",
  entertainment: "entertainment",
  health: "health",
  technology: "technology",
  tourism: "tourism",
  treatment: "health",
  science: "science",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || "12")));
    const skip = (page - 1) * limit;

    // --- Resolve internal category ---
    let category = null;
    const internalWhere: any = { publish_status: "PUBLISHED" };

    if (slug) {
      category = await prisma.category.findUnique({
        where: { slug },
        select: { id: true, title: true, slug: true },
      });
      // If category exists in DB, filter internal news by it
      // If not found, internal news will just be empty — external news still loads
      if (category) {
        internalWhere.categories = { some: { id: category.id } };
      } else {
        // No matching DB category — skip internal news entirely
        internalWhere.id = { in: [] };
      }
    }

    // --- Fetch all internal news for this category ---
    const internalNews = await prisma.news.findMany({
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
    });

    // --- Fetch external news ---
    const externalCategory = slug ? EXTERNAL_CATEGORY_MAP[slug] ?? null : null;
    let externalNews: any[] = [];

    // Fetch external if: no slug filter (latest page) OR slug maps to an external category
    if (!slug || externalCategory) {
      const externalWhere: any = externalCategory ? { category: externalCategory } : {};
      externalNews = await prisma.externalNews.findMany({
        where: externalWhere,
        select: {
          id: true,
          title: true,
          description: true,
          link: true,
          source_name: true,
          image_url: true,
          pub_date: true,
          created_at: true,
        },
        orderBy: [{ pub_date: "desc" }, { created_at: "desc" }],
        take: 200, // cap external results
      });
    }

    // --- Normalize into a unified shape ---
    type NewsEntry = {
      id: number;
      title: string;
      description: string | null;
      highlight_text: string | null;
      image_url: string | null;
      reporter_name: string | null;
      link: string | null;   // null = internal (frontend builds /news/details/id)
      source: "internal" | "external";
      date: Date;
    };

    const merged: NewsEntry[] = [
      ...internalNews.map((n) => ({
        id: n.id,
        title: n.title,
        description: n.description,
        highlight_text: n.highlight_text,
        image_url: n.featured_image,
        reporter_name: n.reporter_name,
        link: null,
        source: "internal" as const,
        date: n.created_at,
      })),
      ...externalNews.map((n) => ({
        id: n.id,
        title: n.title,
        description: n.description,
        highlight_text: null,
        image_url: n.image_url,
        reporter_name: n.source_name,
        link: n.link,
        source: "external" as const,
        date: n.pub_date ?? n.created_at,
      })),
    ];

    // Sort newest first
    merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const total = merged.length;
    const paginated = merged.slice(skip, skip + limit);
    const hasMore = skip + paginated.length < total;

    return NextResponse.json({
      category,
      news: paginated,
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
