import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  const nodeEnv = process.env.NODE_ENV;

  // Test DB connection
  let dbStatus = "not_tested";
  let dbError = null;
  if (dbUrl) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);
      await sql`SELECT 1`;
      dbStatus = "connected";
    } catch (e: any) {
      dbStatus = "failed";
      dbError = e.message;
    }
  }

  return NextResponse.json({
    DATABASE_URL: dbUrl ? `set (${dbUrl.substring(0, 30)}...)` : "NOT SET",
    NEXT_PUBLIC_IMAGE_URL: imageUrl || "NOT SET",
    NODE_ENV: nodeEnv,
    db: dbStatus,
    dbError,
  });
}
