"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import BodyContainer from "../../common/BodyContainer";
import Ad from "../../common/Ad";
import NewsCardHorizontal from "../HorizontalCard";
import NewsCard from "../FeatureNews/NewsCard";
import ad2 from "@/assets/super-white-ad.webp";
import ad from "@/assets/bangla-bid-ad.jpg";

const FALLBACK_IMAGE = "https://placehold.co/350x200/e2e8f0/94a3b8?text=No+Image";

interface ExternalNewsItem {
  id: number;
  title: string;
  description?: string | null;
  link: string;
  source_name?: string | null;
  image_url?: string | null;
}

const CountryNewsSection: React.FC = () => {
  const [news, setNews] = useState<ExternalNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return;

    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/public/external-news?category=top&limit=7`);
        if (!res.ok) throw new Error("Failed to fetch news");
        const data: ExternalNewsItem[] = await res.json();
        setNews(data);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [hasFetched]);

  if (isLoading) return null;

  return (
    <BodyContainer>
      <div className="pt-2 md:pt-2">
        <div className="flex items-center justify-between border bg-base-content shadow-md rounded-xl py-1">
          <Link href="/category/national" passHref>
            <div className="text-white text-2xl px-4 ml-4 cursor-pointer">National</div>
          </Link>
        </div>

        <div className="xl:flex space-y-4 md:space-y-0 xl:space-x-4 pt-4 md:pt-5">
          {/* Left Side */}
          <div className="w-full xl:w-[68%]">
            <div className="space-y-1 md:space-y-0 w-full md:flex md:space-x-5">
              <div className="w-full md:w-1/2">
                {news[0] && (
                  <a href={news[0].link} target="_blank" rel="noopener noreferrer">
                    <NewsCard
                      title={news[0].title}
                      highlight={news[0].source_name || ""}
                      description={news[0].description || ""}
                      imageSrc={news[0].image_url || FALLBACK_IMAGE}
                      clamp={3}
                      maxLength={180}
                    />
                  </a>
                )}
              </div>

              <div className="w-full md:w-1/2 grid grid-cols-1 gap-2 md:pt-0 px-0 pr-0">
                {news.slice(1, 5).map((item, index) => (
                  <a href={item.link} key={index} target="_blank" rel="noopener noreferrer">
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

          {/* Right Side */}
          <div className="w-full flex flex-col justify-between xl:w-[32%] md:pt-4 xl:pt-0">
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1">
              {news.slice(5).map((item, index) => (
                <a href={item.link} key={index} target="_blank" rel="noopener noreferrer">
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

            <center>
              {/* <Image
                width={250}
                height={220}
                src={ad2}
                alt="Ad"
                className="object-cover w-[250px] h-[220px] mt-5"
                priority
              /> */}
            </center>
          </div>
        </div>
      </div>

      {/* <div>
        <Ad image={ad} link="#" />
      </div> */}
    </BodyContainer>
  );
};

export default CountryNewsSection;
