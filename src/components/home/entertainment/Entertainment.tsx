"use client";
import React, { useEffect, useState } from "react";
import NewsCard from "../FeatureNews/NewsCard";
import NewsCardHorizontal from "../HorizontalCard";
import BodyContainer from "@/components/common/BodyContainer";
import Link from "next/link";

const FALLBACK_IMAGE = "https://placehold.co/350x200/e2e8f0/94a3b8?text=No+Image";

interface ExternalNewsItem {
  id: number;
  title: string;
  description?: string | null;
  link: string;
  source_name?: string | null;
  image_url?: string | null;
}

const EntertainmentNews: React.FC = () => {
  const [entertainmentNews, setEntertainmentNews] = useState<ExternalNewsItem[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasFetched) return;

    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/public/external-news?category=entertainment&limit=9`);
        if (!res.ok) throw new Error("Failed to fetch entertainment news");
        const data: ExternalNewsItem[] = await res.json();
        setEntertainmentNews(data);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching entertainment news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [hasFetched]);

  if (loading) return null;

  return (
    <BodyContainer>
      <div className="flex items-center justify-between border bg-base-content shadow-md rounded-xl py-1 my-3 mt-6">
        <Link href="/category/entertainment" passHref>
          <div className="text-white text-2xl px-4 ml-4 cursor-pointer">Entertainment</div>
        </Link>
      </div>

      <div className="lg:flex space-y-3 md:space-y-0 pt-2 lg:space-x-4">
        {/* Left Side */}
        <div className="w-full lg:w-[30%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
          {entertainmentNews.slice(1, 5).map((news) => (
            <a href={news.link} key={news.id} target="_blank" rel="noopener noreferrer">
              <NewsCardHorizontal
                imageSrc={news.image_url || FALLBACK_IMAGE}
                highlight={news.source_name || ""}
                title={news.title}
                right={false}
                left={true}
              />
            </a>
          ))}
        </div>

        {/* Right Side */}
        <div className="space-y-3 md:space-y-0 md:space-x-4 md:flex md:pt-6 lg:pt-0 lg:w-[70%]">
          {entertainmentNews[0] && (
            <div className="w-full md:w-[50%] lg:w-[55%]">
              <a href={entertainmentNews[0].link} target="_blank" rel="noopener noreferrer">
                <NewsCard
                  title={entertainmentNews[0].title}
                  description={entertainmentNews[0].description || ""}
                  imageSrc={entertainmentNews[0].image_url || FALLBACK_IMAGE}
                  clamp={4}
                  maxLength={140}
                  highlight={entertainmentNews[0].source_name || ""}
                  onClick={() => {}}
                />
              </a>
            </div>
          )}

          <div className="block md:w-[50%] space-y-2 md:space-y-3 grid gap-2">
            {entertainmentNews.slice(5, 9).map((news) => (
              <a href={news.link} key={news.id} target="_blank" rel="noopener noreferrer">
                <NewsCardHorizontal
                  imageSrc={news.image_url || FALLBACK_IMAGE}
                  highlight={news.source_name || ""}
                  title={news.title}
                  right={false}
                  left={true}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </BodyContainer>
  );
};

export default EntertainmentNews;
