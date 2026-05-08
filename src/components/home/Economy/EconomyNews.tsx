/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import BodyContainer from "../../common/BodyContainer";
import NewsCardHorizontal from "../HorizontalCard";
import NewsCard from "../FeatureNews/NewsCard";
import Link from "next/link";
import NewsItem2 from "../FeatureNews/NewsItem2";

const FALLBACK_IMAGE = "https://placehold.co/350x200/e2e8f0/94a3b8?text=No+Image";

interface ExternalNewsItem {
  id: number;
  title: string;
  description?: string | null;
  link: string;
  source_name?: string | null;
  image_url?: string | null;
}

const EcomomyNews: React.FC = () => {
  const [healthNews, setHealthNews] = useState<ExternalNewsItem[]>([]);
  const [entertainmentNews, setEntertainmentNews] = useState<ExternalNewsItem[]>([]);
  const [deviceType, setDeviceType] = useState<string>("desktop");
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasFetched) return;

    const fetchAllNews = async () => {
      try {
        const [healthRes, entertainmentRes] = await Promise.all([
          fetch(`/api/public/external-news?category=health&limit=5`),
          fetch(`/api/public/external-news?category=entertainment&limit=12`),
        ]);
        const [healthData, entertainmentData] = await Promise.all([
          healthRes.json(),
          entertainmentRes.json(),
        ]);
        setHealthNews(healthData);
        setEntertainmentNews(entertainmentData);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();
  }, [hasFetched]);

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth < 1024 ? "mobile" : "desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return null;

  return (
    <BodyContainer>
      <div className="md:space-x-4 lg:space-x-5 md:flex space-y-4 md:space-y-0 pt-2 md:pt-6">
        {/* Health Section */}
        <div className="w-full md:w-1/2 lg:w-[35%] xl:w-[33%]">
          <div className="flex items-center justify-between border bg-base-content shadow-md rounded-xl py-1 mt-4 sm:mt-0">
            <Link href="/category/health" passHref>
              <div className="text-white text-2xl px-4 ml-4 cursor-pointer">Health</div>
            </Link>
          </div>

          <div className="w-full space-y-2 sm:space-y-0 sm:space-x-4 pt-4 sm:flex md:flex-col md:space-x-0 md:space-y-2">
            {healthNews[0] && (
              <div className="sm:w-1/2 md:w-full">
                <a href={healthNews[0].link} target="_blank" rel="noopener noreferrer">
                  <NewsCard
                    title={healthNews[0].title}
                    highlight={healthNews[0].source_name || ""}
                    description={healthNews[0].description || ""}
                    imageSrc={healthNews[0].image_url || FALLBACK_IMAGE}
                    clamp={3}
                    maxLength={180}
                  />
                </a>
              </div>
            )}
            <div className="space-y-2 sm:w-1/2 md:w-full">
              {healthNews.slice(1, deviceType === "mobile" ? 5 : 3).map((item) => (
                <a href={item.link} key={item.id} target="_blank" rel="noopener noreferrer">
                  <NewsItem2 highlight={item.source_name || ""} text={item.title} Icon={false} onClick={() => {}} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Entertainment Section */}
        <div className="block md:w-1/2 lg:w-[65%] xl:w-[66%]">
          <div className="flex items-center justify-between border bg-base-content shadow-md rounded-xl py-1">
            <Link href="/category/entertainment" passHref>
              <div className="text-white text-2xl px-4 ml-4 cursor-pointer">Entertainment</div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 pt-4">
            {entertainmentNews.slice(0, deviceType === "mobile" ? 8 : entertainmentNews.length).map((item) => (
              <a href={item.link} key={item.id} target="_blank" rel="noopener noreferrer">
                <NewsCardHorizontal
                  imageSrc={item.image_url || FALLBACK_IMAGE}
                  highlight={item.source_name || ""}
                  title={item.title}
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

export default EcomomyNews;
