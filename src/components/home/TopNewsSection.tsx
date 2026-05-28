import Image from "next/image";
import Link from "next/link";
import prisma from "../../../prisma/prisma";

const FALLBACK = "https://placehold.co/800x450/e2e8f0/94a3b8?text=No+Image";
const imageBaseURL = process.env.NEXT_PUBLIC_IMAGE_URL;

function imgSrc(path: string | null) {
  if (!path) return FALLBACK;
  if (path.startsWith("http")) return path;
  return `${imageBaseURL}/${path}`;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "").trim();
}

export default async function TopNewsSection() {
  const news = await prisma.news.findMany({
    where: { publish_status: "PUBLISHED" },
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
    take: 7,
  });

  if (!news.length) return null;

  const [hero, ...rest] = news;

  return (
    <div className="mb-6">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-red-600 rounded-full" />
        <h2 className="text-base sm:text-xl font-bold text-gray-800 uppercase tracking-wide">Top News</h2>
      </div>

      {/* Hero card */}
      <Link href={`/news/details/${hero.id}`} className="group block mb-4">
        <div className="relative w-full h-[360px] sm:h-[380px] lg:h-[460px] rounded-2xl overflow-hidden">
          <Image
            src={imgSrc(hero.featured_image)}
            alt={hero.title}
            fill
            priority
            className="object-cover transform transition-transform duration-500 group-hover:scale-105"
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-7">
            {hero.highlight_text && (
              <span className="inline-block bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                {hero.highlight_text}
              </span>
            )}
            <h1 className="text-white text-lg sm:text-3xl lg:text-4xl font-bold leading-snug line-clamp-3 group-hover:text-red-300 transition-colors">
              {hero.title}
            </h1>
            {hero.description && (
              <p className="text-gray-300 text-sm mt-2 line-clamp-2 hidden sm:block">
                {stripHtml(hero.description).substring(0, 160)}
              </p>
            )}
            {hero.reporter_name && (
              <p className="text-gray-400 text-xs mt-2 sm:hidden">By {hero.reporter_name}</p>
            )}
          </div>
        </div>
      </Link>

      {/* Sub-cards: horizontal scroll on mobile, grid on desktop */}
      <div className="sm:hidden flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {rest.slice(0, 6).map((item) => (
          <Link
            href={`/news/details/${item.id}`}
            key={item.id}
            className="group flex-shrink-0 w-[44vw]"
          >
            <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 h-full">
              <div className="relative w-full h-[100px]">
                <Image
                  src={imgSrc(item.featured_image)}
                  alt={item.title}
                  fill
                  className="object-cover transform transition-transform duration-300 group-hover:scale-105"
                  sizes="44vw"
                />
              </div>
              <div className="p-2">
                {item.highlight_text && (
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide line-clamp-1 mb-0.5">
                    {item.highlight_text}
                  </p>
                )}
                <h3 className="text-xs font-semibold text-gray-800 line-clamp-3 group-hover:text-red-600 transition-colors leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop grid */}
      <div className="hidden sm:grid grid-cols-3 lg:grid-cols-6 gap-3">
        {rest.slice(0, 6).map((item) => (
          <Link href={`/news/details/${item.id}`} key={item.id} className="group">
            <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 h-full">
              <div className="relative w-full h-[120px]">
                <Image
                  src={imgSrc(item.featured_image)}
                  alt={item.title}
                  fill
                  className="object-cover transform transition-transform duration-300 group-hover:scale-105"
                  sizes="20vw"
                />
              </div>
              <div className="p-2">
                {item.highlight_text && (
                  <p className="text-red-500 text-[10px] font-semibold line-clamp-1 mb-0.5">
                    {item.highlight_text}
                  </p>
                )}
                <h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-3 group-hover:text-red-600 transition-colors leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
