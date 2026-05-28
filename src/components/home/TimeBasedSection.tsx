import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import prisma from "../../../prisma/prisma";

const FALLBACK = "https://placehold.co/400x250/e2e8f0/94a3b8?text=No+Image";
const imageBaseURL = process.env.NEXT_PUBLIC_IMAGE_URL;

function imgSrc(path: string | null) {
  if (!path) return FALLBACK;
  if (path.startsWith("http")) return path;
  return `${imageBaseURL}/${path}`;
}

interface Props {
  title: string;
  from: Date;
  to: Date;
  limit?: number;
}

export default async function TimeBasedSection({ title, from, to, limit = 8 }: Props) {
  const news = await prisma.news.findMany({
    where: {
      publish_status: "PUBLISHED",
      created_at: { gte: from, lte: to },
    },
    select: {
      id: true,
      title: true,
      highlight_text: true,
      featured_image: true,
      reporter_name: true,
      created_at: true,
    },
    orderBy: { created_at: "desc" },
    take: limit,
  });

  if (!news.length) return null;

  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-red-600 rounded-full" />
        <h2 className="text-base sm:text-xl font-bold text-gray-800 uppercase tracking-wide">{title}</h2>
        <Link
          href="/latest"
          className="ml-auto text-xs sm:text-sm text-red-600 hover:text-red-800 font-semibold transition-colors whitespace-nowrap"
        >
          See All →
        </Link>
      </div>

      {/* Mobile: horizontal snap scroll */}
      <div className="sm:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {news.map((item) => (
          <Link
            href={`/news/details/${item.id}`}
            key={item.id}
            className="group flex-shrink-0 w-[70vw] snap-start"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
              <div className="relative w-full h-[140px] overflow-hidden">
                <Image
                  src={imgSrc(item.featured_image)}
                  alt={item.title}
                  fill
                  className="object-cover transform transition-transform duration-300 group-hover:scale-105"
                  sizes="70vw"
                />
                {item.highlight_text && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {item.highlight_text}
                  </span>
                )}
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-3 group-hover:text-red-600 transition-colors leading-snug flex-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  <p className="text-gray-400 text-[11px]">
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {news.map((item) => (
          <Link href={`/news/details/${item.id}`} key={item.id} className="group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
              <div className="relative w-full h-[150px] overflow-hidden">
                <Image
                  src={imgSrc(item.featured_image)}
                  alt={item.title}
                  fill
                  className="object-cover transform transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="p-3 flex flex-col flex-1">
                {item.highlight_text && (
                  <span className="text-red-500 text-[10px] font-semibold uppercase tracking-wide line-clamp-1 mb-1">
                    {item.highlight_text}
                  </span>
                )}
                <h3 className="text-sm font-medium text-gray-800 line-clamp-3 group-hover:text-red-600 transition-colors leading-snug flex-1">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-[11px] mt-2">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
