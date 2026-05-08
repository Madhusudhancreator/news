/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import ShortNewsCard from "../FeatureNews/ShortNewsCard";
import NewsItem2 from "../FeatureNews/NewsItem2";
import BodyContainer from "@/components/common/BodyContainer";
import Link from "next/link";

const FALLBACK_IMAGE = "https://placehold.co/350x200/e2e8f0/94a3b8?text=No+Image";

interface ExternalNewsItem {
  id: number;
  title: string;
  link: string;
  source_name?: string | null;
  image_url?: string | null;
}

const ReligionNews: React.FC = () => {
  const [categories, setCategories] = useState<Record<string, ExternalNewsItem[]>>({
    top: [],
    environment: [],
    science: [],
    tourism: [],
  });
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return;

    const fetchAllNews = async () => {
      try {
        const [topRes, envRes, scienceRes, tourismRes] = await Promise.all([
          fetch(`/api/public/external-news?category=top&limit=4`),
          fetch(`/api/public/external-news?category=environment&limit=4`),
          fetch(`/api/public/external-news?category=science&limit=4`),
          fetch(`/api/public/external-news?category=tourism&limit=4`),
        ]);
        const [topData, envData, scienceData, tourismData] = await Promise.all([
          topRes.json(),
          envRes.json(),
          scienceRes.json(),
          tourismRes.json(),
        ]);
        setCategories({ top: topData, environment: envData, science: scienceData, tourism: tourismData });
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

  const renderCategorySection = (title: string, link: string, news: ExternalNewsItem[]) => (
    <div className="w-full">
      <div className="flex items-center justify-between border bg-base-content shadow-md rounded-xl py-1">
        <Link href={link} passHref>
          <div className="text-white text-2xl px-4 ml-4 cursor-pointer">{title}</div>
        </Link>
      </div>

      <div className="space-y-4 mt-3">
        {news[0] && (
          <a href={news[0].link} target="_blank" rel="noopener noreferrer">
            <ShortNewsCard
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
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 my-2">
        {renderCategorySection("Top Stories", "/category/top", categories.top)}
        {renderCategorySection("Environment", "/category/environment", categories.environment)}
        {renderCategorySection("Science", "/category/science", categories.science)}
        {renderCategorySection("Tourism", "/category/tourism", categories.tourism)}
      </div>
    </BodyContainer>
  );
};

export default ReligionNews;
