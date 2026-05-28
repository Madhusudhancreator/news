import prisma from "../../../../prisma/prisma";
import LatestNewsTabs from "./LatestNewsTabs";

export default async function NewsFeatureRightSide() {
  const latestNews = await prisma.news.findMany({
    where: { publish_status: "PUBLISHED" },
    orderBy: { created_at: "desc" },
    take: 10,
    select: { id: true, title: true },
  });

  return (
    <div className="w-full pb-5">
      <LatestNewsTabs latestNews={latestNews} />
    </div>
  );
}
