/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import NewsCard from "../FeatureNews/NewsCard";
import NewsItem2 from "../FeatureNews/NewsItem2";
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

const LifestyleNews: React.FC = () => {
  const [healthNews, setHealthNews] = useState<ExternalNewsItem[]>([]);
  const [lifestyleNews, setLifestyleNews] = useState<ExternalNewsItem[]>([]);
  const [tourismNews, setTourismNews] = useState<ExternalNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return;

    const fetchAllNews = async () => {
      try {
        const [healthRes, lifestyleRes, tourismRes] = await Promise.all([
          fetch(`/api/public/external-news?category=health&limit=4`),
          fetch(`/api/public/external-news?category=top&limit=4`),
          fetch(`/api/public/external-news?category=tourism&limit=4`),
        ]);
        const [healthData, lifestyleData, tourismData] = await Promise.all([
          healthRes.json(),
          lifestyleRes.json(),
          tourismRes.json(),
        ]);
        setHealthNews(healthData);
        setLifestyleNews(lifestyleData);
        setTourismNews(tourismData);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching lifestyle news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();
  }, [hasFetched]);

  if (loading) return null;

  const renderCategorySection = (title: string, link: string, news: ExternalNewsItem[]) => (
    <div className="w-full sm:pt-">
      <div className="flex items-center justify-between border bg-base-content shadow-md rounded-xl py-1 my-2 sm:my-0">
        <Link href={link} passHref>
          <div className="text-white text-2xl px-4 ml-4 cursor-pointer">{title}</div>
        </Link>
      </div>

      <div className="space-y-2 sm:mt-4">
        {news[0] && (
          <a href={news[0].link} target="_blank" rel="noopener noreferrer">
            <NewsCard
              title={news[0].title}
              imageSrc={news[0].image_url || FALLBACK_IMAGE}
              highlight={news[0].source_name || ""}
              onClick={() => {}}
            />
          </a>
        )}

        <div className="space-y-4">
          {news.slice(1).map((item) => (
            <a href={item.link} key={item.id} target="_blank" rel="noopener noreferrer">
              <NewsItem2
                text={item.title}
                highlight={item.source_name || ""}
                Icon={false}
                onClick={() => {}}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <BodyContainer>
      <div className="pt-5 md:pt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-1">{renderCategorySection("Health", "/category/health", healthNews)}</div>
        <div className="col-span-1">{renderCategorySection("Lifestyle", "/category/lifestyle", lifestyleNews)}</div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">{renderCategorySection("Tourism", "/category/tourism", tourismNews)}</div>
      </div>
    </BodyContainer>
  );
};

export default LifestyleNews;
