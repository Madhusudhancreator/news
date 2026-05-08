"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import BodyContainer from "@/components/common/BodyContainer";
import Link from "next/link";

const FALLBACK_IMAGE = "https://placehold.co/150x150/e2e8f0/94a3b8?text=News";

interface OpinionCardProps {
  imageUrl: string;
  title: string;
  source_name: string;
  link: string;
}

const OpinionCard: React.FC<OpinionCardProps> = ({ imageUrl, title, source_name, link }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <div className="flex p-1 rounded-lg shadow-md bg-white border cursor-pointer">
        <div className="relative h-[100px] w-[120px] rounded-lg overflow-hidden border-4 border-red-500 flex-shrink-0 my-auto">
          <Image
            src={imageUrl}
            alt={title}
            width={150}
            height={150}
            className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="ml-2 py-2 my-auto flex-1">
          <h3 className="text-medium text-xl md:text-xl lg:text-2xl font-medium line-clamp-3 hover:text-red-500">
            {title}
          </h3>
          <span className="text-gray-500 text-xl mt-1 cursor-pointer">{source_name}</span>
        </div>
      </div>
    </a>
  );
};

interface ExternalNewsItem {
  id: number;
  title: string;
  link: string;
  source_name?: string | null;
  image_url?: string | null;
}

const OpinionSection: React.FC = () => {
  const [opinions, setOpinions] = useState<ExternalNewsItem[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasFetched) return;

    const fetchOpinions = async () => {
      try {
        const res = await fetch(`/api/public/external-news?category=politics&limit=6`);
        if (!res.ok) throw new Error("Failed to fetch opinion news");
        const data: ExternalNewsItem[] = await res.json();
        setOpinions(data);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching opinion news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpinions();
  }, [hasFetched]);

  if (loading) return null;

  return (
    <BodyContainer>
      <div className="pt-6">
        <div className="flex items-center justify-between border bg-base-content shadow-md rounded-xl py-1">
          <Link href="/category/opinion" passHref>
            <div className="text-white text-2xl px-4 ml-4 cursor-pointer">Opinion</div>
          </Link>
        </div>

        <div className="grid grid-col-1 md:grid-cols-2 xl:grid-cols-3 gap-2 mt-3">
          {opinions.map((opinion) => (
            <OpinionCard
              key={opinion.id}
              imageUrl={opinion.image_url || FALLBACK_IMAGE}
              title={opinion.title}
              source_name={opinion.source_name || ""}
              link={opinion.link}
            />
          ))}
        </div>
      </div>
    </BodyContainer>
  );
};

export default OpinionSection;
