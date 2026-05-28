"use client";

import { useState } from "react";
import Link from "next/link";
import NewsItem from "./NewsItem";

interface NewsEntry {
  id: number;
  title: string;
}

interface Props {
  latestNews: NewsEntry[];
}

const tabs = ["Latest", "Popular"];

export default function LatestNewsTabs({ latestNews }: Props) {
  const [activeTab, setActiveTab] = useState("Latest");

  return (
    <div className="relative shadow-md rounded-md px-1 pb-3">
      <ul className="flex justify-between bg-slate-100 rounded-t-md p-2" role="list">
        {tabs.map((tab) => (
          <li key={tab} className="flex-auto text-center">
            <button
              onClick={() => setActiveTab(tab)}
              className={`w-full px-2 py-2 rounded-md text-xl font-medium ${
                activeTab === tab
                  ? "text-red-800 bg-white shadow-md"
                  : "text-slate-600 bg-inherit"
              }`}
              role="tab"
              aria-selected={activeTab === tab}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      <div className="bg-white rounded-b-md">
        <div className="h-[350px] overflow-y-auto p-2">
          {latestNews.length > 0 ? (
            latestNews.map((news) => (
              <Link href={`/news/details/${news.id}`} key={news.id}>
                <NewsItem text={news.title} Icon={true} />
              </Link>
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">No news available</p>
          )}
        </div>
      </div>

      <Link href="/latest">
        <button className="btn w-full btn-outline text-xl font-medium mt-3">
          See All Latest News
        </button>
      </Link>
    </div>
  );
}
