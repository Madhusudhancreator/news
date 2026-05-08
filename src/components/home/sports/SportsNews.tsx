"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import BodyContainer from "../../common/BodyContainer";
import NewsCard from "../FeatureNews/NewsCard";
import NewsCardHorizontal from "../HorizontalCard";
import ShortNewsCard from "../FeatureNews/ShortNewsCard";
import SideAds from "../../../assets/sideAd.png";
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

const SportsNewsSection: React.FC = () => {
  const [newsData, setNewsData] = useState<ExternalNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return;

    const fetchSportsNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/public/external-news?category=sports&limit=9`);
        if (!res.ok) throw new Error("Failed to fetch sports news");
        const data: ExternalNewsItem[] = await res.json();
        setNewsData(data);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching sports news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSportsNews();
  }, [hasFetched]);

  if (loading) return null;

  return (
    <BodyContainer>
      <div className="flex flex-wrap items-center border bg-base-content shadow-md rounded-xl py-1 my-3 gap-2 px-4">
        <Link href="/category/sports" passHref>
          <div className="text-white text-2xl px-4 cursor-pointer">Sports</div>
        </Link>
      </div>

      <div className="lg:flex space-y-4 md:space-y-4 lg:space-y-0 pt-4 lg:space-x-4">
        <div className="w-full lg:w-1/3">
          {newsData[0] && (
            <>
              <a href={newsData[0].link} target="_blank" rel="noopener noreferrer">
                <NewsCard
                  title={newsData[0].title}
                  description={newsData[0].description || ""}
                  imageSrc={newsData[0].image_url || FALLBACK_IMAGE}
                  highlight={newsData[0].source_name || ""}
                  clamp={3}
                  maxLength={150}
                />
              </a>
              <div className="hidden w-full lg:block mt-4">
                <Image
                  src="https://placehold.co/400X80/png"
                  alt="Advertisement"
                  width={450}
                  height={100}
                  className="rounded-md shadow-md"
                  priority
                />
              </div>
            </>
          )}
        </div>

        <div className="block lg:w-2/3 md:flex">
          <div className="w-full md:w-[60%] lg:w-[60%] xl:w-full mb-3 md:mb-0">
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 gap-2">
                {newsData.slice(1, 3).map((newsItem) => (
                  <a href={newsItem.link} key={newsItem.id} target="_blank" rel="noopener noreferrer">
                    <ShortNewsCard
                      title={newsItem.title}
                      imageSrc={newsItem.image_url || FALLBACK_IMAGE}
                      highlight={newsItem.source_name || ""}
                    />
                  </a>
                ))}
              </div>
              <Image
                width={400}
                height={400}
                src={SideAds}
                alt="Blog Image"
                className="hidden md:flex md:w-[100px] lg:w-[90px] xl:w-[110px] object-fill mb-4"
                priority
              />
            </div>
          </div>

          <div className="w-full md:w-[50%] lg:w-[40%] xl:w-full grid grid-cols-1 md:pl-4 gap-2">
            {newsData.slice(3).map((newsItem) => (
              <a href={newsItem.link} key={newsItem.id} target="_blank" rel="noopener noreferrer">
                <NewsCardHorizontal
                  imageSrc={newsItem.image_url || FALLBACK_IMAGE}
                  highlight={newsItem.source_name || ""}
                  title={newsItem.title}
                  right={false}
                  left={false}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </BodyContainer>
  );
};

export default SportsNewsSection;
