/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import BodyContainer from "../../common/BodyContainer";
import NewsCard from "../FeatureNews/NewsCard";
import NewsCardHorizontal from "../HorizontalCard";
import Ad from "../../common/Ad";
import ad from "../../../assets/bangla-bid-ad.jpg";
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

const NationalNewsSection: React.FC = () => {
  const [politicsNews, setPoliticsNews] = useState<ExternalNewsItem[]>([]);
  const [businessNews, setBusinessNews] = useState<ExternalNewsItem[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasFetched) return;

    const fetchAllNews = async () => {
      try {
        const [politicsRes, businessRes] = await Promise.all([
          fetch(`/api/public/external-news?category=politics&limit=5`),
          fetch(`/api/public/external-news?category=business&limit=5`),
        ]);
        const [politicsData, businessData] = await Promise.all([
          politicsRes.json(),
          businessRes.json(),
        ]);
        setPoliticsNews(politicsData);
        setBusinessNews(businessData);
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
      <div className="pt-2 md:pt-2">
        <div className="xl:flex xl:space-x-5">
          {/* Politics Section */}
          <div className="w-full xl:w-[67%]">
            <div className="flex items-center justify-between border bg-base-content shadow-md rounded-xl py-1">
              <Link href="/category/politics" passHref>
                <div className="text-white text-2xl px-4 ml-4 cursor-pointer">Politics</div>
              </Link>
            </div>
            <div className="space-y-1 md:space-y-0 w-full md:flex md:space-x-4 pt-5">
              <div className="w-full md:w-1/2">
                {politicsNews[0] && (
                  <a href={politicsNews[0].link} target="_blank" rel="noopener noreferrer">
                    <NewsCard
                      title={politicsNews[0].title}
                      description={politicsNews[0].description || ""}
                      imageSrc={politicsNews[0].image_url || FALLBACK_IMAGE}
                      highlight={politicsNews[0].source_name || ""}
                      clamp={3}
                      maxLength={140}
                    />
                  </a>
                )}
              </div>

              <div className="w-full md:w-1/2 grid grid-cols-1 gap-2 md:pt-0 px-0 pr-0">
                {politicsNews.slice(1).map((news, index) => (
                  <a href={news.link} key={index} target="_blank" rel="noopener noreferrer">
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

          {/* Business/Economy Section */}
          <div className="w-full xl:w-[33%] pt-4 md:pt-4 xl:pt-0">
            <div className="flex items-center justify-between border bg-base-content shadow-md rounded-xl py-1">
              <Link href="/category/economy" passHref>
                <div className="text-white text-2xl px-4 ml-4 cursor-pointer">Economy</div>
              </Link>
            </div>

            <div className="w-full grid grid-cols-1 gap-2 pt-4">
              {businessNews.map((news, index) => (
                <a href={news.link} key={index} target="_blank" rel="noopener noreferrer">
                  <NewsItem2 text={news.title} highlight={news.source_name || ""} onClick={() => {}} Icon={false} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BodyContainer>
        <Ad image={ad} link={"#"} />
      </BodyContainer>
    </BodyContainer>
  );
};

export default NationalNewsSection;
