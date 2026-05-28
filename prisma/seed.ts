import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  // ── Get or create a user ──
  const users = await sql`SELECT id FROM "User" LIMIT 1`;
  let userId: number;

  if (users.length === 0) {
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash("password123", 10);
    const res = await sql`
      INSERT INTO "User" (name, email, password, role, created_at, updated_at)
      VALUES ('Admin', 'admin@newscity24.com', ${hash}, 'ADMIN', NOW(), NOW())
      RETURNING id
    `;
    userId = res[0].id;
    console.log("Created user id:", userId);
  } else {
    userId = users[0].id;
    console.log("Using existing user id:", userId);
  }

  // ── Ensure categories exist ──
  const categoryData = [
    { title: "National", slug: "national" },
    { title: "International", slug: "international" },
    { title: "Politics", slug: "politics" },
    { title: "Economy", slug: "economy" },
    { title: "Sports", slug: "sports" },
    { title: "Entertainment", slug: "entertainment" },
    { title: "Technology", slug: "technology" },
    { title: "Crime News", slug: "crime-news" },
    { title: "Education", slug: "education" },
    { title: "Health", slug: "health" },
  ];

  for (const cat of categoryData) {
    await sql`
      INSERT INTO "Category" (title, slug, created_at, updated_at)
      VALUES (${cat.title}, ${cat.slug}, NOW(), NOW())
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log("Categories ready.");

  const cats = await sql`SELECT id, slug FROM "Category"`;
  const catMap: Record<string, number> = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  // ── Time helpers ──
  const h = (n: number) => new Date(Date.now() - n * 60 * 60 * 1000).toISOString();
  const d = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

  const newsItems = [
    // ── Last 24 hours ──
    {
      title: "Parliament Passes New Budget with Record Infrastructure Spending",
      highlight_text: "Breaking",
      description: "<p>The National Parliament has passed a landmark budget allocating record funds to infrastructure development. Finance Minister announced a 20% increase in development spending focused on roads, bridges, and digital infrastructure.</p>",
      reporter_name: "Staff Reporter",
      created_at: h(2),
      categories: ["national", "politics"],
    },
    {
      title: "Government Launches Digital Health Initiative for Rural Areas",
      highlight_text: "Health",
      description: "<p>A comprehensive digital health program has been launched targeting rural communities, providing telemedicine services and mobile health units to underserved regions across the country.</p>",
      reporter_name: "Health Desk",
      created_at: h(5),
      categories: ["national", "health"],
    },
    {
      title: "Central Bank Raises Interest Rates Amid Inflation Concerns",
      highlight_text: "Economy",
      description: "<p>The central bank raised its benchmark interest rate by 50 basis points in response to rising inflation. The move is expected to cool consumer spending while stabilizing the currency.</p>",
      reporter_name: "Economic Desk",
      created_at: h(8),
      categories: ["economy"],
    },
    {
      title: "National Cricket Team Wins Historic Test Match Against Australia",
      highlight_text: "Sports",
      description: "<p>In a stunning upset, the national cricket team defeated Australia in a five-day test match, marking a historic victory that sent fans into celebration across the country.</p>",
      reporter_name: "Sports Desk",
      created_at: h(10),
      categories: ["sports"],
    },
    {
      title: "Prime Minister Meets World Leaders at UN General Assembly",
      highlight_text: "Diplomacy",
      description: "<p>The Prime Minister held bilateral meetings with over a dozen world leaders on the sidelines of the United Nations General Assembly, focusing on climate change, trade, and regional security.</p>",
      reporter_name: "Diplomatic Correspondent",
      created_at: h(14),
      categories: ["national", "international"],
    },
    {
      title: "Tech Startup Raises $50M to Expand AI Solutions Across South Asia",
      highlight_text: "Technology",
      description: "<p>A local technology startup has secured $50 million in Series B funding from international investors, with plans to expand its AI platform across South Asian markets.</p>",
      reporter_name: "Tech Reporter",
      created_at: h(18),
      categories: ["technology"],
    },
    {
      title: "Education Ministry Announces Free University Seats for Top Students",
      highlight_text: "Education",
      description: "<p>A new scholarship program offers fully funded university seats for the top 5,000 students in the national examination, covering tuition and living expenses.</p>",
      reporter_name: "Education Desk",
      created_at: h(22),
      categories: ["education", "national"],
    },
    {
      title: "Film Industry Celebrates Record Box Office Year",
      highlight_text: "Entertainment",
      description: "<p>The local film industry announced its highest-grossing year on record, with total box office revenues surpassing $200 million. Industry leaders credit improved production quality and streaming partnerships.</p>",
      reporter_name: "Entertainment Desk",
      created_at: h(23),
      categories: ["entertainment"],
    },

    // ── Last week (2–7 days ago) ──
    {
      title: "Government Unveils 10-Year National Development Plan",
      highlight_text: "National",
      description: "<p>A comprehensive 10-year national development roadmap has been unveiled, outlining strategic priorities in education, healthcare, infrastructure, and green energy transition.</p>",
      reporter_name: "Policy Desk",
      created_at: d(2),
      categories: ["national", "politics"],
    },
    {
      title: "Opposition Calls for Emergency Parliament Session Over Economic Crisis",
      highlight_text: "Politics",
      description: "<p>The main opposition party formally requested an emergency parliamentary session to debate ongoing economic challenges, citing rising unemployment and cost of living pressures.</p>",
      reporter_name: "Political Correspondent",
      created_at: d(3),
      categories: ["politics"],
    },
    {
      title: "International Trade Agreement Signed with Three European Nations",
      highlight_text: "Trade",
      description: "<p>A landmark trade agreement has been signed with three major European nations, expected to boost exports by 30% and create over 200,000 new jobs in the manufacturing sector.</p>",
      reporter_name: "Trade Desk",
      created_at: d(4),
      categories: ["international", "economy"],
    },
    {
      title: "New Anti-Corruption Task Force Launched by Government",
      highlight_text: "National",
      description: "<p>A specialized anti-corruption task force with sweeping investigative powers has been established to tackle financial crimes and improve transparency in public procurement.</p>",
      reporter_name: "Law & Order Desk",
      created_at: d(5),
      categories: ["national", "crime-news"],
    },
    {
      title: "Renewable Energy Project to Power 2 Million Homes by 2027",
      highlight_text: "Environment",
      description: "<p>A major solar and wind energy project received final government approval, with the capacity to power over two million homes by 2027, reducing dependence on fossil fuels.</p>",
      reporter_name: "Environment Desk",
      created_at: d(6),
      categories: ["national", "economy"],
    },
    {
      title: "National Football Team Qualifies for Asian Cup Finals",
      highlight_text: "Sports",
      description: "<p>The national football team secured qualification for the Asian Cup Finals after a dramatic penalty shootout victory, sending fans into joyous celebration across major cities.</p>",
      reporter_name: "Sports Desk",
      created_at: d(7),
      categories: ["sports"],
    },
  ];

  let created = 0;
  for (const item of newsItems) {
    const { categories: slugs, created_at, ...rest } = item;

    // Insert news
    const result = await sql`
      INSERT INTO "News" (
        title, highlight_text, description, reporter_name,
        publish_status, created_by_id, created_at, updated_at
      ) VALUES (
        ${rest.title}, ${rest.highlight_text}, ${rest.description}, ${rest.reporter_name},
        'PUBLISHED', ${userId}, ${created_at}, ${created_at}
      )
      RETURNING id
    `;
    const newsId: number = result[0].id;

    // Insert category links
    for (const slug of slugs) {
      const catId = catMap[slug];
      if (catId) {
        await sql`
          INSERT INTO "_CategoryToNews" ("A", "B")
          VALUES (${catId}, ${newsId})
          ON CONFLICT DO NOTHING
        `;
      }
    }

    console.log(`  ✓ "${rest.title.substring(0, 50)}..."`);
    created++;
  }

  console.log(`\nDone! Seeded ${created} news articles.`);
}

main().catch(console.error);
