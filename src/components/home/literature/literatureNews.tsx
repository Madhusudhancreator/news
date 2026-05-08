/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import NewsCardHorizontal from "../HorizontalCard";
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

const LiteratureNews: React.FC = () => {
  const [literatureNews, setLiteratureNews] = useState<ExternalNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return;

    const fetchLiteratureNews = async () => {
      try {
        const res = await fetch(`/api/public/external-news?category=science&limit=9`);
        if (!res.ok) throw new Error("Failed to fetch science news");
        const data: ExternalNewsItem[] = await res.json();
        setLiteratureNews(data);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching literature news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiteratureNews();
  }, [hasFetched]);

  if (loading) return null;

  return (
    <BodyContainer>
      <div className="flex items-center justify-between border bg-base-content shadow-md rounded-xl py-1 my-2 mt-6 md:mt-8">
        <Link href="/category/literature" passHref>
          <div className="text-white text-2xl px-4 ml-4 cursor-pointer">Science & Literature</div>
        </Link>
      </div>

      <div className="lg:flex pt-3 sm:pb-5 md:pb-0">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {literatureNews.map((news) => (
            <a href={news.link} key={news.id} target="_blank" rel="noopener noreferrer">
              <NewsCardHorizontal
                imageSrc={news.image_url || FALLBACK_IMAGE}
                title={news.title}
                highlight={news.source_name || ""}
                right={false}
                left={true}
              />
            </a>
          ))}
        </div>
      </div>
    </BodyContainer>
  );
};

export default LiteratureNews;
