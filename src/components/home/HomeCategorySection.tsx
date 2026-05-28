import Image from "next/image";
import Link from "next/link";
import prisma from "../../../prisma/prisma";

const FALLBACK = "https://placehold.co/400x250/e2e8f0/94a3b8?text=No+Image";
const imageBaseURL = process.env.NEXT_PUBLIC_IMAGE_URL;

function imgSrc(path: string | null) {
  if (!path) return FALLBACK;
  if (path.startsWith("http")) return path;
  return `${imageBaseURL}/${path}`;
}

function stripHtml(html: string) {
  return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
}

interface Props {
  categorySlug: string;
  sectionTitle: string;
  limit?: number;
}

export default async function HomeCategorySection({
  categorySlug,
  sectionTitle,
  limit = 7,
}: Props) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { id: true, slug: true },
  });

  if (!category) return null;

  const news = await prisma.news.findMany({
    where: {
      publish_status: "PUBLISHED",
      categories: { some: { id: category.id } },
    },
    select: {
      id: true,
      title: true,
      description: true,
      highlight_text: true,
      featured_image: true,
    },
    orderBy: { created_at: "desc" },
    take: limit,
  });

  if (!news.length) return null;

  const [main, ...rest] = news;

  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-red-600 rounded-full" />
        <h2 className="text-base sm:text-xl font-bold text-gray-800 uppercase tracking-wide">
          {sectionTitle}
        </h2>
        <Link
          href={`/category/${category.slug}`}
          className="ml-auto text-xs sm:text-sm text-red-600 hover:text-red-800 font-semibold transition-colors whitespace-nowrap"
        >
          See All →
        </Link>
      </div>

      {/* Main card — full width on all screens */}
      <Link href={`/news/details/${main.id}`} className="group block mb-4">
        <div className="rounded-2xl shadow-sm overflow-hidden bg-white border border-gray-100">
          <div className="relative w-full h-[200px] sm:h-[260px] overflow-hidden">
            <Image
              src={imgSrc(main.featured_image)}
              alt={main.title}
              fill
              className="object-cover transform transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {main.highlight_text && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                {main.highlight_text}
              </span>
            )}
          </div>
          <div className="p-3 sm:p-4">
            <h3 className="text-base sm:text-xl font-bold text-gray-800 group-hover:text-red-600 line-clamp-2 transition-colors leading-snug">
              {main.title}
            </h3>
            {main.description && (
              <p className="text-gray-500 text-sm mt-1 line-clamp-2 hidden sm:block">
                {stripHtml(main.description).substring(0, 120)}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Side cards: horizontal scroll on mobile, grid on desktop */}
      <div className="sm:hidden flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {rest.slice(0, 6).map((item) => (
          <Link
            href={`/news/details/${item.id}`}
            key={item.id}
            className="group flex-shrink-0 w-[44vw]"
          >
            <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 h-full">
              <div className="relative w-full h-[90px]">
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
                <h4 className="text-xs font-semibold text-gray-800 line-clamp-3 group-hover:text-red-600 transition-colors leading-snug">
                  {item.title}
                </h4>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop grid */}
      <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3">
        {rest.slice(0, 6).map((item) => (
          <Link href={`/news/details/${item.id}`} key={item.id} className="group">
            <div className="rounded-xl shadow-sm overflow-hidden bg-white border border-gray-100 h-full">
              <div className="relative w-full h-[130px] overflow-hidden">
                <Image
                  src={imgSrc(item.featured_image)}
                  alt={item.title}
                  fill
                  className="object-cover transform transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              </div>
              <div className="p-2">
                {item.highlight_text && (
                  <p className="text-red-500 text-xs font-semibold line-clamp-1">
                    {item.highlight_text}
                  </p>
                )}
                <h4 className="text-sm group-hover:text-red-600 line-clamp-3 transition-colors leading-snug">
                  {item.title}
                </h4>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
