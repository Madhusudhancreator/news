import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import { Prisma } from "@prisma/client";
import { neon } from "@neondatabase/serverless";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      video_url,
      highlight_text,
      reporter_name,
      publish_status,
      tag,
      categories,
      featured_image,
      meta_title,
      meta_description,
      focus_keyword,
      meta_image,
      created_by_id, // Ensure this is a valid user ID
    } = body;

    // Validate required fields
    if (!title || !created_by_id) {
      return NextResponse.json(
        { success: false, message: "Title and Created by ID are required." },
        { status: 400 }
      );
    }

    // Ensure categories are an array
    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { success: false, message: "Categories must be an array." },
        { status: 400 }
      );
    }

    // Step 1: Create news row without nested category connect (avoids implicit transaction)
    const news = await prisma.news.create({
      data: {
        title,
        description: description || null,
        highlight_text: highlight_text || null,
        reporter_name: reporter_name || null,
        publish_status,
        tag: tag || null,
        featured_image: featured_image || null,
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        focus_keyword: focus_keyword || null,
        video_url: video_url || null,
        meta_image: meta_image || null,
        created_by_id,
      },
    });

    // Step 2: Insert category links via raw SQL (Neon HTTP adapter doesn't support transactions)
    if (categories.length > 0) {
      const sql = neon(process.env.DATABASE_URL!);
      for (const catId of categories as number[]) {
        await sql`
          INSERT INTO "_CategoryToNews" ("A", "B")
          VALUES (${catId}, ${news.id})
          ON CONFLICT DO NOTHING
        `;
      }
    }

    return NextResponse.json(
      { success: true, message: "News added successfully.", news },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding news:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while adding news.",
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchQuery = url.searchParams.get("search") || "";

  try {
    const whereCondition: Prisma.NewsWhereInput = searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
            { reporter_name: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
            { tag: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
            { categories: { some: { title: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } } } },
            { created_by: { name: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } } },
          ],
        }
      : {};

    const news = await prisma.news.findMany({
      where: whereCondition,
      include: {
        categories: { select: { title: true } },
        created_by: { select: { name: true } },
      },
      orderBy: { created_at: "desc" },
      
    });

    return NextResponse.json({ success: true, news });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching news.", error },
      { status: 500 }
    );
  }
}


