"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { FaPlay, FaFacebookF, FaTwitter, FaWhatsapp, FaTelegramPlane, FaLink } from "react-icons/fa";
import { format, parseISO } from "date-fns";

import HomeLayout from "../../../../components/layouts/HomeLayout";
import FacebookComments from "../../../../components/FacebookComments";
import VideoCard from "../../../../components/home/videoSection/VideoCard";

const imageBaseURL = process.env.NEXT_PUBLIC_IMAGE_URL;
const FALLBACK = "https://placehold.co/800x450/e2e8f0/94a3b8?text=No+Image";

interface NewsData {
  id: number;
  title: string;
  description: string | null;
  reporter_name: string | null;
  tag: string | null;
  featured_image: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
  categories: { id: number; title: string; slug: string }[];
}

function imgSrc(path: string | null) {
  if (!path) return FALLBACK;
  if (path.startsWith("http")) return path;
  return `${imageBaseURL}/${path}`;
}

export default function NewsDetailClient({
  news,
  slug,
  sidebar,
}: {
  news: NewsData;
  slug: string;
  sidebar: React.ReactNode;
}) {
  const [related, setRelated] = useState<any[]>([]);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchRelated() {
      if (!news.categories?.[0]?.id) return;
      const mode = news.video_url ? "1" : "0";
      const res = await fetch(
        `/api/public/news/related?category=${news.categories[0].id}&exclude=${news.id}&limit=8&video=${mode}`
      );
      if (res.ok) setRelated(await res.json());
    }
    fetchRelated();
  }, [news]);

  const category = news.categories?.[0];
  const isVideoNews = !!news.video_url;
  const shareUrl = encodeURIComponent(`https://newscity24.com/news/details/${slug}`);
  const pubDate = format(parseISO(news.created_at), "d MMMM yyyy, h:mm a");
  const reporterInitial = (news.reporter_name ?? "R")[0].toUpperCase();

  function copyLink() {
    navigator.clipboard.writeText(`https://newscity24.com/news/details/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <HomeLayout>
      <div className="xl:max-w-7xl lg:max-w-5xl mx-auto lg:px-6 mb-10">
        <div className="lg:flex lg:gap-8 items-start">

          {/* ── Main article ── */}
          <article className="lg:w-[73%]">

            {/* Hero image — full-bleed on mobile, rounded on desktop */}
            <div className="-mx-4 sm:mx-0 sm:mt-4">
              {isVideoNews ? (
                <div className="relative w-full aspect-video sm:rounded-2xl overflow-hidden bg-black">
                  <ReactPlayer
                    url={news.video_url!}
                    width="100%"
                    height="100%"
                    controls
                    playing={playing}
                    light={!playing ? imgSrc(news.featured_image) : false}
                    onClickPreview={() => setPlaying(true)}
                  />
                  {!playing && (
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      onClick={() => setPlaying(true)}
                    >
                      <div className="bg-white text-green-600 rounded-full p-4 shadow-lg">
                        <FaPlay size={28} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full aspect-video sm:rounded-2xl overflow-hidden">
                  <Image
                    src={imgSrc(news.featured_image)}
                    alt={news.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw"
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="px-4 sm:px-0">

              {/* Category pill */}
              <div className="mt-4 mb-3">
                <Link
                  href={isVideoNews ? "#" : `/category/${category?.slug ?? "#"}`}
                  className="inline-block bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest hover:bg-red-700 transition-colors"
                >
                  {isVideoNews ? "Video News" : (category?.title ?? "News")}
                </Link>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-3xl lg:text-[2.1rem] font-bold text-gray-900 leading-snug mb-5">
                {news.title}
              </h1>

              {/* Meta bar: reporter + share */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-5 border-b border-gray-100">

                {/* Reporter + date */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 text-sm font-bold">{reporterInitial}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">
                      {news.reporter_name ?? "Our Reporter"}
                    </p>
                    <p className="text-xs text-gray-400">{pubDate}</p>
                  </div>
                </div>

                {/* Share buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mr-1 hidden sm:block">
                    Share
                  </span>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                    title="Facebook"
                  >
                    <FaFacebookF size={12} />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                    title="X / Twitter"
                  >
                    <FaTwitter size={12} />
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${shareUrl}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                    title="WhatsApp"
                  >
                    <FaWhatsapp size={13} />
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${shareUrl}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#229ED9] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                    title="Telegram"
                  >
                    <FaTelegramPlane size={13} />
                  </a>
                  <button
                    onClick={copyLink}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                    title="Copy link"
                  >
                    <FaLink size={11} />
                  </button>
                  {copied && (
                    <span className="text-xs text-green-600 font-semibold">Copied!</span>
                  )}
                </div>
              </div>

              {/* Article body */}
              <div
                className="prose prose-base sm:prose-lg max-w-none text-gray-800
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-p:leading-relaxed prose-p:my-4
                  prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:w-full prose-img:my-6
                  prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: news.description ?? "" }}
              />

              {/* Tags */}
              {news.tag && (
                <div className="flex flex-wrap items-center gap-2 mt-8 pt-5 border-t border-gray-100">
                  <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">Tags:</span>
                  {news.tag.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Comments */}
              <div className="mt-8">
                <FacebookComments url={`https://newscity24.com/news/details/${slug}`} />
              </div>
            </div>
          </article>

          {/* ── Sidebar (desktop only) ── */}
          <aside className="hidden lg:block lg:w-[27%] sticky top-20 self-start">
            {sidebar}
          </aside>
        </div>

        {/* ── Related articles ── */}
        {related.length > 0 && (
          <div className="mt-10 px-4 sm:px-0">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-red-600 rounded-full" />
              <h2 className="text-base sm:text-xl font-bold text-gray-800 uppercase tracking-wide">
                {isVideoNews ? "Watch More Videos" : `More from ${category?.title ?? "Related"}`}
              </h2>
            </div>

            {/* Mobile: horizontal scroll */}
            <div className="sm:hidden flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
              {related.map((item) =>
                isVideoNews ? (
                  <div key={item.id} className="flex-shrink-0 w-[72vw] snap-start">
                    <VideoCard
                      videoUrl={item.video_url}
                      title={item.title}
                      imgSrc={imgSrc(item.featured_image)}
                      linkTo={item.id}
                      highlight={item.highlight_text}
                    />
                  </div>
                ) : (
                  <Link
                    href={`/news/details/${item.id}`}
                    key={item.id}
                    className="group flex-shrink-0 w-[68vw] snap-start"
                  >
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="relative w-full h-[120px]">
                        <Image
                          src={imgSrc(item.featured_image)}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="68vw"
                        />
                        {item.highlight_text && (
                          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            {item.highlight_text}
                          </span>
                        )}
                      </div>
                      <div className="p-2.5">
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-3 group-hover:text-red-600 transition-colors leading-snug">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>

            {/* Desktop: grid */}
            <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((item) =>
                isVideoNews ? (
                  <VideoCard
                    key={item.id}
                    videoUrl={item.video_url}
                    title={item.title}
                    imgSrc={imgSrc(item.featured_image)}
                    linkTo={item.id}
                    highlight={item.highlight_text}
                  />
                ) : (
                  <Link href={`/news/details/${item.id}`} key={item.id} className="group">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                      <div className="relative w-full h-[140px]">
                        <Image
                          src={imgSrc(item.featured_image)}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="25vw"
                        />
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        {item.highlight_text && (
                          <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mb-1">
                            {item.highlight_text}
                          </p>
                        )}
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-3 group-hover:text-red-600 transition-colors leading-snug">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </HomeLayout>
  );
}
