const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

// Load .env manually
const envPath = path.join(__dirname, "../.env");
fs.readFileSync(envPath, "utf8").split("\n").forEach((line) => {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
});

const prisma = new PrismaClient();

const CATEGORIES = [
  "top", "politics", "business", "sports", "technology",
  "entertainment", "health", "science", "world", "tourism",
];

async function syncCategory(category) {
  const url = `https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_API_KEY}&language=en&category=${category}&size=10`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "success" || !Array.isArray(data.results)) {
    console.log(`${category} -> no results (${data.message || data.status})`);
    return 0;
  }

  let count = 0;
  for (const a of data.results) {
    if (!a.article_id || !a.title || !a.link) continue;
    await prisma.externalNews.upsert({
      where: { article_id: a.article_id },
      create: {
        article_id: a.article_id,
        title: a.title,
        description: a.description || null,
        link: a.link,
        source_name: a.source_name || null,
        image_url: a.image_url || null,
        pub_date: a.pubDate ? new Date(a.pubDate) : null,
        category,
      },
      update: {
        title: a.title,
        description: a.description || null,
        image_url: a.image_url || null,
        pub_date: a.pubDate ? new Date(a.pubDate) : null,
        updated_at: new Date(),
      },
    });
    count++;
  }
  return count;
}

async function main() {
  console.log("Starting initial news sync...");
  for (const cat of CATEGORIES) {
    try {
      const n = await syncCategory(cat);
      console.log(`${cat} -> ${n} articles synced`);
      await new Promise((r) => setTimeout(r, 400));
    } catch (e) {
      console.error(`${cat} failed:`, e.message);
    }
  }
  await prisma.$disconnect();
  console.log("Sync complete.");
}

main();
