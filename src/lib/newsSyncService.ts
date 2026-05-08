import prisma from "../../prisma/prisma";

const CATEGORIES = [
  "top",
  "politics",
  "business",
  "sports",
  "technology",
  "entertainment",
  "health",
  "science",
  "world",
  "tourism",
];

interface NewsDataArticle {
  article_id: string;
  title: string;
  description?: string | null;
  link: string;
  source_name?: string | null;
  image_url?: string | null;
  pubDate?: string | null;
}

async function syncCategory(category: string): Promise<number> {
  const url = `https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_API_KEY}&language=en&category=${category}&size=10`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`newsdata.io responded ${res.status} for ${category}`);

  const data = await res.json();
  if (data.status !== "success" || !Array.isArray(data.results)) return 0;

  let count = 0;
  for (const article of data.results as NewsDataArticle[]) {
    if (!article.article_id || !article.title || !article.link) continue;

    await prisma.externalNews.upsert({
      where: { article_id: article.article_id },
      create: {
        article_id: article.article_id,
        title: article.title,
        description: article.description ?? null,
        link: article.link,
        source_name: article.source_name ?? null,
        image_url: article.image_url ?? null,
        pub_date: article.pubDate ? new Date(article.pubDate) : null,
        category,
      },
      update: {
        title: article.title,
        description: article.description ?? null,
        image_url: article.image_url ?? null,
        pub_date: article.pubDate ? new Date(article.pubDate) : null,
        updated_at: new Date(),
      },
    });
    count++;
  }

  return count;
}

export async function syncAllNews(): Promise<Record<string, number>> {
  const results: Record<string, number> = {};

  for (const category of CATEGORIES) {
    try {
      const count = await syncCategory(category);
      results[category] = count;
      // Small delay between requests to be polite to the API
      await new Promise((r) => setTimeout(r, 300));
    } catch (error) {
      console.error(`[newsSyncService] Failed to sync "${category}":`, error);
      results[category] = -1;
    }
  }

  return results;
}
