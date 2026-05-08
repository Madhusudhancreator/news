/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Ad from "@/assets/super-white-ad.webp";
import ShortNewsCard from "../FeatureNews/ShortNewsCard";
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

const TechnologyNews: React.FC = () => {
  const [technologyNews, setTechnologyNews] = useState<ExternalNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (hasFetched) return;

    const fetchTechnologyNews = async () => {
      try {
        const res = await fetch(`/api/public/external-news?category=technology&limit=8`);
        if (!res.ok) throw new Error("Failed to fetch technology news");
        const data: ExternalNewsItem[] = await res.json();
        setTechnologyNews(data);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching technology news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologyNews();
  }, [hasFetched]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return null;

  const newsToDisplay = isDesktop ? technologyNews.slice(0, 7) : technologyNews.slice(0, 8);

  return (
    <BodyContainer>
      <div className="flex items-center justify-between border bg-base-content shadow-md rounded-xl py-1 mt-6">
        <Link href="/category/technology" passHref>
          <div className="text-white text-2xl px-4 ml-4 cursor-pointer">Technology</div>
        </Link>
      </div>

      <div className="lg:flex space-y-5 md:space-y-0 pt-5">
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto">
          {newsToDisplay.map((news) => (
            <a href={news.link} key={news.id} target="_blank" rel="noopener noreferrer">
              <ShortNewsCard
                title={news.title}
                imageSrc={news.image_url || FALLBACK_IMAGE}
                onClick={() => {}}
                highlight={news.source_name || ""}
              />
            </a>
          ))}
          <div className="hidden md:block">
            <Image
              width={250}
              height={250}
              src={Ad}
              alt="Ad Image"
              className="object-cover w-[250px] h-[220px]"
              priority
            />
          </div>
        </div>
      </div>
    </BodyContainer>
  );
};

export default TechnologyNews;
