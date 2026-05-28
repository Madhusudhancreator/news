import Link from "next/link";
import HomeLayout from "@/components/layouts/HomeLayout";
import BodyContainer from "@/components/common/BodyContainer";
import TopNewsSection from "@/components/home/TopNewsSection";
import TimeBasedSection from "@/components/home/TimeBasedSection";
import HomeCategorySection from "@/components/home/HomeCategorySection";

const mobileCategories = [
  { label: "Latest", href: "/latest" },
  { label: "National", href: "/category/national" },
  { label: "Politics", href: "/category/politics" },
  { label: "Sports", href: "/category/sports" },
  { label: "Economy", href: "/category/economy" },
  { label: "International", href: "/category/international" },
  { label: "Technology", href: "/category/technology" },
  { label: "Health", href: "/category/health" },
  { label: "Entertainment", href: "/category/entertainment" },
];

export default function HomePage() {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return (
    <HomeLayout>
      <BodyContainer>
        <div className="py-4">
          {/* Mobile category quick-nav pills */}
          <div className="sm:hidden flex gap-2 overflow-x-auto pb-3 mb-2 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            {mobileCategories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white active:bg-red-700 active:text-white transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* 1. Top News */}
          <TopNewsSection />

          {/* Divider */}
          <div className="border-t border-gray-100 my-6" />

          {/* 2. Last 24 Hours */}
          <TimeBasedSection
            title="Top News — Last 24 Hours"
            from={last24h}
            to={now}
          />

          {/* Divider */}
          <div className="border-t border-gray-100 my-6" />

          {/* 3. Last Week */}
          <TimeBasedSection
            title="Top News — Last Week"
            from={last7d}
            to={last24h}
          />

          {/* Divider */}
          <div className="border-t border-gray-100 my-6" />

          {/* 4. Government Announcements */}
          <HomeCategorySection
            categorySlug="national"
            sectionTitle="Government Announcements"
          />
        </div>
      </BodyContainer>
    </HomeLayout>
  );
}
