import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  const nodeEnv = process.env.NODE_ENV;

  // Test direct Neon connection
  let neonStatus = "not_tested";
  let neonError = null;
  if (dbUrl) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);
      await sql`SELECT 1`;
      neonStatus = "connected";
    } catch (e: any) {
      neonStatus = "failed";
      neonError = e.message;
    }
  }

  // Test Prisma connection
  let prismaStatus = "not_tested";
  let prismaError = null;
  try {
    const prisma = (await import("../../../../prisma/prisma")).default;
    await prisma.news.count();
    prismaStatus = "connected";
  } catch (e: any) {
    prismaStatus = "failed";
    prismaError = e.message;
  }

  return NextResponse.json({
    DATABASE_URL: dbUrl ? `set (${dbUrl.substring(0, 30)}...)` : "NOT SET",
    NEXT_PUBLIC_IMAGE_URL: imageUrl || "NOT SET",
    NODE_ENV: nodeEnv,
    neon: neonStatus,
    neonError,
    prisma: prismaStatus,
    prismaError,
  });
}
