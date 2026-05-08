import { NextRequest, NextResponse } from "next/server";
import { syncAllNews } from "@/lib/newsSyncService";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[cron] Starting news sync...");
    const results = await syncAllNews();
    console.log("[cron] Sync complete:", results);
    return NextResponse.json({ success: true, synced_at: new Date().toISOString(), results });
  } catch (error) {
    console.error("[cron] Sync failed:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
