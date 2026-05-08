"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import HomeLayout from "../../components/layouts/HomeLayout";
import Ads from "../../assets/super-white-ad.webp";
import ad from "../../assets/bangla-bid-ad.jpg";
import ShortNewsCard from "../../components/home/FeatureNews/ShortNewsCard";
import Ad from "../../components/common/Ad";
import CategoryCard from "../../components/category/CategoryCard";
import NewsFeatureRightSide from "../../components/home/FeatureNews/NewsFeatureRightSide";
import LoadingSpinner from "../../components/LoadingSpinner";

const imageBaseURL = process.env.NEXT_PUBLIC_IMAGE_URL;
const LIMIT = 12;

interface NewsEntry {
  id: number;
  title: string;
  description: string | null;
  highlight_text: string | null;
  image_url: string | null;
  reporter_name: string | null;
  link: string | null;
  source: "internal" | "external";
  date: string;
}

function getHref(item: NewsEntry): string {
  return item.source === "external" && item.link
    ? item.link
    : `/news/details/${item.id}`;
}

function getImage(item: NewsEntry): string {
  if (!item.image_url) return "/placeholder.png";
  return item.source === "internal"
    ? `${imageBaseURL}/${item.image_url}`
    : item.image_url;
}

const LatestNews: React.FC = () => {
  const [news, setNews] = useState<NewsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  async function fetchNews(pageNum: number, replace = false) {
    try {
      const res = await fetch(
        `/api/public/news/by-category?page=${pageNum}&limit=${LIMIT}`
      );
      const data = await res.json();
      if (!res.ok) {
        console.error("[latest page] API error:", data);
        return;
      }
      setNews((prev) => (replace ? data.news : [...prev, ...data.news]));
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("[latest page] fetch failed:", err);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchNews(1, true).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchNews(nextPage);
    setPage(nextPage);
    setLoadingMore(false);
  }

  const featuredItem = news[0] ?? null;
  const gridItems = news.slice(1, 5);
  const listItems = news.slice(5);

  if (loading) {
    return (
      <HomeLayout>
        <LoadingSpinner />
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="xl:max-w-7xl lg:max-w-5xl md:max-w-[768px] sm:max-w-[640px] xl:px-4 md:mx-auto lg:px-6 sm:mx-auto sm:px-4 px-3 pt-4 mb-8">
        {/* Heading */}
        <div className="mb-2 mt-2">
          <h1 className="text-2xl md:text-4xl text-red-500">Latest News</h1>
        </div>
        <div className="border-b-2 border-gray-100 mb-4" />

        {news.length === 0 ? (
          <p className="text-gray-500 text-lg py-10 text-center">
            No news available.
          </p>
        ) : (
          <>
            {/* Featured article + sidebar ad */}
            <div className="lg:flex gap-6 pt-2">
              <div className="w-full lg:w-3/4">
                {featuredItem && (
                  <Link
                    href={getHref(featuredItem)}
                    target={featuredItem.source === "external" ? "_blank" : undefined}
                    rel={featuredItem.source === "external" ? "noopener noreferrer" : undefined}
                  >
                    <CategoryCard
                      title={featuredItem.title}
                      description={featuredItem.description ?? ""}
                      author={featuredItem.reporter_name ?? "Our Reporter"}
                      timeAgo={formatDistanceToNow(new Date(featuredItem.date), { addSuffix: true })}
                      customClass="w-full h-48 sm:h-60 md:h-72 md:w-1/2"
                      imagePosition="right"
                      imageUrl={getImage(featuredItem)}
                    />
                  </Link>
                )}
              </div>
              <div className="block lg:w-1/4 mt-4 lg:mt-0">
                <Image
                  width={250}
                  height={220}
                  src={Ads}
                  alt="Advertisement"
                  className="w-full h-[192px] object-fill"
                  priority
                />
              </div>
            </div>

            {/* Short news grid */}
            {gridItems.length > 0 && (
              <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {gridItems.map((item) => (
                  <Link
                    key={`${item.source}-${item.id}`}
                    href={getHref(item)}
                    target={item.source === "external" ? "_blank" : undefined}
                    rel={item.source === "external" ? "noopener noreferrer" : undefined}
                  >
                    <ShortNewsCard
                      title={item.title}
                      imageSrc={getImage(item)}
                      highlight={item.highlight_text ?? ""}
                    />
                  </Link>
                ))}
              </div>
            )}

            {/* Ad banner */}
            <div className="py-4">
              <Ad image={ad} link="#" />
            </div>

            {/* List + sidebar */}
            {listItems.length > 0 && (
              <div className="flex flex-col lg:flex-row gap-8 pt-4">
                <div className="w-full lg:w-8/12 space-y-6">
                  {listItems.map((item) => (
                    <Link
                      key={`${item.source}-${item.id}`}
                      href={getHref(item)}
                      target={item.source === "external" ? "_blank" : undefined}
                      rel={item.source === "external" ? "noopener noreferrer" : undefined}
                    >
                      <CategoryCard
                        title={item.title}
                        description={item.description ?? ""}
                        author={item.reporter_name ?? "Our Reporter"}
                        timeAgo={formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                        imagePosition="left"
                        customClass="w-full h-40 md:h-36 lg:h-40 xl:h-48 md:w-1/3"
                        imageUrl={getImage(item)}
                      />
                    </Link>
                  ))}

                  {hasMore && (
                    <div className="text-center pt-4">
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="btn btn-outline text-xl px-10"
                      >
                        {loadingMore ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-full lg:w-4/12">
                  <NewsFeatureRightSide />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </HomeLayout>
  );
};

export default LatestNews;
