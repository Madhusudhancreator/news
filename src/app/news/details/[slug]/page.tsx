import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "../../../../../prisma/prisma";
import NewsDetailClient from "./NewsDetailClient";
import NewsFeatureRightSide from "../../../../components/home/FeatureNews/NewsFeatureRightSide";

const imageBaseURL = process.env.NEXT_PUBLIC_IMAGE_URL;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getNews(slug: string) {
  const numericId = Number(slug);
  if (Number.isNaN(numericId)) return null;

  return prisma.news.findUnique({
    where: { id: numericId },
    select: {
      id: true,
      title: true,
      description: true,
      reporter_name: true,
      tag: true,
      featured_image: true,
      meta_title: true,
      meta_description: true,
      meta_image: true,
      focus_keyword: true,
      video_url: true,
      created_at: true,
      updated_at: true,
      categories: {
        take: 1,
        select: { id: true, title: true, slug: true },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNews(slug);
  if (!news) return { title: "Not Found" };

  const title = news.meta_title || news.title;
  const description = news.meta_description || (news.description?.replace(/<[^>]+>/g, "").substring(0, 160) ?? "");
  const image = news.meta_image || news.featured_image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [`${imageBaseURL}/${image}`] : [],
      url: `https://newscity24.com/news/details/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [`${imageBaseURL}/${image}`] : [],
    },
  };
}

export default async function NewsDetailsPage({ params }: Props) {
  const { slug } = await params;
  const news = await getNews(slug);
  if (!news) notFound();

  const serialized = {
    ...news,
    created_at: news.created_at.toISOString(),
    updated_at: news.updated_at.toISOString(),
  };

  return <NewsDetailClient news={serialized} slug={slug} sidebar={<NewsFeatureRightSide />} />;
}
