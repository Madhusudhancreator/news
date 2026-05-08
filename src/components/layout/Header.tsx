"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBars } from "react-icons/fa6";
import { IoSearchSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { GoDotFill } from "react-icons/go";
import { format } from "date-fns";
import Ad from "../common/Ad";
import ad from "@/assets/bangla-bid-ad.jpg";
import bigAdImg from "@/assets/walton-ad.jpg";
import BodyContainer from "../common/BodyContainer";
import Btn from "../common/Btn";
import Dropdown from "../common/Dropdown";
import StayTuned from "../common/StayTuned";
// import DownloadApp from "../common/DownloadApp";
import HorizontalScrollableText from "@/components/home/FeatureNews/HorizontalScrollableText";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const date = new Date();
  const formattedDate = format(date, "EEEE, d MMMM, yyyy");

  const menuItems = [
    { text: "Latest", link: "/latest" },
    { text: "National", link: "/category/national" },
    { text: "Politics", link: "/category/politics" },
    { text: "Economy", link: "/category/economy" },
    { text: "International", link: "/category/international" },
    { text: "Country", link: "/category/crime-news" },
    { text: "Education", link: "/category/education" },
    { text: "Opinion", link: "/category/opinion" },
    { text: "Sports", link: "/category/sports" },
    { text: "Entertainment", link: "/category/entertainment" },
    { text: "Literature", link: "/category/literature" },
  ];

  const megaMenuItems = [
    { text: "National", link: "/category/national" },
    { text: "International", link: "/category/international" },
    { text: "Sports", link: "/category/sports" },
    { text: "Health", link: "/category/health" },
    { text: "Education", link: "/category/education" },
    { text: "Feature", link: "/category/feature" },
    { text: "Photo", link: "/category/photo" },
    { text: "Politics", link: "/category/politics" },
    { text: "West Bengal", link: "/category/west-bengal" },
    { text: "Entertainment", link: "/category/entertainment" },
    { text: "Lifestyle", link: "/category/lifestyle" },
    { text: "Religion", link: "/category/religion" },
    { text: "Odd News", link: "/category/odd-news" },
    { text: "District News", link: "/category/district-news" },
    { text: "Economy", link: "/category/economy" },
    { text: "Technology", link: "/category/technology" },
    { text: "Treatment", link: "/category/treatment" },
    { text: "Literature", link: "/category/literature" },
    { text: "Opinion", link: "/category/opinion" },
    { text: "Crime News", link: "/category/crime-news" },
    { text: "Bangladeshi Diaspora", link: "/category/bangladeshi-diaspora" },
    { text: "Tourism", link: "/category/tourism" },
    { text: "Beauty Tips", link: "/category/beauty-tips" },
    { text: "Mass Media", link: "/category/mass-media" },
    { text: "Video", link: "/category/video" },
  ];

  const quickLinks = [
    { text: "About Us", link: "/" },
    { text: "Advertisement Policy", link: "/" },
    { text: "Comment Policy", link: "/" },
    { text: "Privacy Policy", link: "/" },
    { text: "Contact", link: "/" },
    { text: "Unicode Converter", link: "/" },
  ];

  return (
    <>
      <BodyContainer>
        {/* Desktop top bar */}
        <div className="hidden sm:flex items-center justify-between pt-6 pb-3">
          <p className="text-base md:text-lg">{formattedDate}</p>
          <Link href="/">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/logocitynews.png`}
              alt="logo"
              width={220}
              height={70}
              className="w-[150px] md:w-[180px] lg:w-[220px]"
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            <Dropdown />
            <div className="w-px h-5 bg-gray-400" />
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1 text-base font-medium hover:text-primary transition-colors"
            >
              <IoSearchSharp /> Search
            </button>
          </div>
        </div>

        {/* Mobile top bar */}
        <div className="flex sm:hidden items-center justify-between py-4">
          <Link href="/">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/logocitynews.png`}
              alt="logo"
              width={130}
              height={50}
              className="w-[120px]"
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-xl"
              aria-label="Search"
            >
              <IoSearchSharp />
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="text-xl"
              aria-label="Menu"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </BodyContainer>

      {/* Desktop nav bar — sticky */}
      <div className="hidden sm:block border-y border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
        <BodyContainer>
          <nav className="flex items-center justify-center py-2 overflow-x-auto">
            {menuItems.map((item) => (
              <Link
                key={item.text}
                href={item.link}
                className="whitespace-nowrap px-3 py-1 text-sm md:text-base font-medium hover:text-primary transition-colors"
              >
                {item.text}
              </Link>
            ))}
            <button
              onClick={() => setMenuOpen(true)}
              className="ml-2 p-1 hover:text-primary transition-colors"
              aria-label="All categories"
            >
              <FaBars className="text-base" />
            </button>
          </nav>
        </BodyContainer>
      </div>

      {/* Breaking news ticker */}
      <div className="mb-2">
        <HorizontalScrollableText text="Breaking news: Stay updated with the latest headlines from around the world. Follow us for real-time news updates and in-depth coverage." />
      </div>

      {/* Ad banner */}
      {/* <BodyContainer>
        <Ad image={ad} link={"#"} />
      </BodyContainer> */}

      {/* Mega menu / mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto">
          <div className="bg-white min-h-full w-full">
            {/* Header */}
            <div className="border-b border-gray-200">
              <BodyContainer>
                <div className="flex items-center justify-between py-5">
                  <Link href="/" onClick={() => setMenuOpen(false)}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/logocitynews.png`}
                      alt="logo"
                      width={160}
                      height={55}
                      className="w-[130px] md:w-[160px]"
                    />
                  </Link>
                  <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                    <RxCross2 className="text-3xl md:text-4xl" />
                  </button>
                </div>
              </BodyContainer>
            </div>

            {/* Body */}
            <BodyContainer>
              <div className="flex flex-col lg:flex-row gap-6 py-6">
                {/* Categories grid */}
                <div className="lg:w-[65%]">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 text-base md:text-lg font-medium">
                    {megaMenuItems.map((item) => (
                      <Link
                        key={item.text}
                        href={item.link}
                        onClick={() => setMenuOpen(false)}
                        className="hover:text-primary transition-colors"
                      >
                        {item.text}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Vertical divider */}
                <div className="hidden lg:block w-px bg-gray-200 self-stretch" />

                {/* Sidebar */}
                <div className="lg:w-[33%]">
                  <StayTuned colon={true} />
                  <div className="border-t border-gray-200 pt-4 flex flex-wrap gap-x-4 gap-y-2 text-base font-medium">
                    {quickLinks.map((item) => (
                      <Link
                        key={item.text}
                        href={item.link}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <GoDotFill className="text-xs" />
                        {item.text}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </BodyContainer>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <div className="bg-white rounded-lg w-full max-w-lg py-8 px-6 relative">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-3 top-3"
              aria-label="Close search"
            >
              <RxCross2 className="text-2xl" />
            </button>
            <h3 className="font-medium text-2xl text-center mb-5">
              What are you looking for?
            </h3>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                  setSearchOpen(false);
                }
              }}
            >
              <input
                type="text"
                placeholder="Type here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full h-[55px] text-lg"
                autoFocus
              />
              <Btn text={"Search"} />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
