/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import BodyContainer from "../../common/BodyContainer";
import NewsCardHorizontal from "../HorizontalCard";
import NewsItem2 from "../FeatureNews/NewsItem2";
import NewsCard from "../FeatureNews/NewsCard";
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

const DynamicNewsSection: React.FC = () => {
  const [worldNews, setWorldNews] = useState<ExternalNewsItem[]>([]);
  const [scienceNews, setScienceNews] = useState<ExternalNewsItem[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasFetched) return;

    const fetchAllNews = async () => {
      try {
        const [worldRes, scienceRes] = await Promise.all([
          fetch(`/api/public/external-news?category=world&limit=6`),
          fetch(`/api/public/external-news?category=science&limit=5`),
        ]);
        const [worldData, scienceData] = await Promise.all([
          worldRes.json(),
          scienceRes.json(),
        ]);
        setWorldNews(worldData);
        setScienceNews(scienceData);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();
  }, [hasFetched]);

  if (loading) return null;

  return (
    <BodyContainer>
      <div className="pt-2">
        <div className="xl:flex space-y-4 md:space-y-0 xl:space-x-5 pt-2 md:pt-5">
          {/* Left - International */}
          <div className="w-full mx-auto xl:w-[68%]">
            <div className="flex items-center justify-between border bg-base-content shadow-md rounded-xl py-1">
              <Link href="/category/international" passHref>
                <div className="text-white text-2xl px-4 ml-4 cursor-pointer">International</div>
              </Link>
            </div>

            <div className="space-y-1 md:space-y-0 2xl:pt-10 w-full md:flex md:space-x-4">
              <div className="w-full md:w-1/2 mt-5">
                {worldNews[0] && (
                  <a href={worldNews[0].link} target="_blank" rel="noopener noreferrer">
                    <NewsCard
                      title={worldNews[0].title}
                      description={worldNews[0].description || ""}
                      imageSrc={worldNews[0].image_url || FALLBACK_IMAGE}
                      highlight={worldNews[0].source_name || ""}
                      clamp={3}
                      maxLength={260}
                    />
                  </a>
                )}
              </div>

              <div className="w-full md:w-1/2 grid grid-cols-1 gap-2 pt-4 md:pt-5 px-0">
                {worldNews.slice(1).map((news, index) => (
                  <a href={news.link} key={index} target="_blank" rel="noopener noreferrer">
                    <NewsCardHorizontal
                      imageSrc={news.image_url || FALLBACK_IMAGE}
                      highlight={news.source_name || ""}
                      title={news.title}
                      right={false}
                      left={false}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Science */}
          <div className="w-full xl:w-[32%] pt-4 md:pt-4 xl:pt-0">
            <div className="flex items-center justify-between border bg-base-content shadow-md rounded-xl py-1">
              <Link href="/category/science" passHref>
                <div className="text-white text-2xl px-4 ml-4 cursor-pointer">Science</div>
              </Link>
            </div>

            <div className="gap-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 mt-5">
              {scienceNews.map((news, index) => (
                <a href={news.link} key={index} target="_blank" rel="noopener noreferrer">
                  <NewsItem2
                    text={news.title}
                    highlight={news.source_name || ""}
                    Icon={false}
                    onClick={() => {}}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BodyContainer>
  );
};

export default DynamicNewsSection;
