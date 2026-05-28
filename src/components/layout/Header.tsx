"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaHouse, FaBolt, FaThumbsUp } from "react-icons/fa6";
import { IoSearchSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { GoDotFill } from "react-icons/go";
import { format } from "date-fns";
import BodyContainer from "../common/BodyContainer";
import Btn from "../common/Btn";
import StayTuned from "../common/StayTuned";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [followOpen, setFollowOpen] = useState(false);
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
      {/* ── Desktop top bar ── */}
      <BodyContainer>
        <div className="hidden sm:flex items-center justify-between py-4">
          <p className="text-sm text-gray-500">{formattedDate}</p>
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
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          >
            <IoSearchSharp className="text-base" /> Search
          </button>
        </div>
      </BodyContainer>

      {/* ── Mobile top bar ── */}
      <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="w-8" />
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
        <button
          onClick={() => setSearchOpen(true)}
          className="text-xl text-gray-600"
          aria-label="Search"
        >
          <IoSearchSharp />
        </button>
      </div>

      {/* ── Desktop sticky nav ── */}
      <div className="hidden sm:block border-y border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
        <BodyContainer>
          <nav className="flex items-center justify-center overflow-x-auto">
            {menuItems.map((item) => (
              <Link
                key={item.text}
                href={item.link}
                className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:border-red-600 hover:text-red-600 transition-all"
              >
                {item.text}
              </Link>
            ))}
            <button
              onClick={() => setMenuOpen(true)}
              className="ml-1 px-3 py-3 text-gray-500 border-b-2 border-transparent hover:border-red-600 hover:text-red-600 transition-all"
              aria-label="All categories"
            >
              <FaBars className="text-sm" />
            </button>
          </nav>
        </BodyContainer>
      </div>

      {/* ── Mobile bottom nav bar (app-like) ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-5 h-16">
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-red-600 active:text-red-600 transition-colors"
          >
            <FaHouse className="text-xl" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link
            href="/latest"
            className="flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-red-600 active:text-red-600 transition-colors"
          >
            <FaBolt className="text-xl" />
            <span className="text-[10px] font-medium">Latest</span>
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-red-600 active:text-red-600 transition-colors"
          >
            <FaBars className="text-xl" />
            <span className="text-[10px] font-medium">Categories</span>
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-red-600 active:text-red-600 transition-colors"
          >
            <IoSearchSharp className="text-xl" />
            <span className="text-[10px] font-medium">Search</span>
          </button>
          <button
            onClick={() => setFollowOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-red-600 active:text-red-600 transition-colors"
          >
            <FaThumbsUp className="text-xl" />
            <span className="text-[10px] font-medium">Follow</span>
          </button>
        </div>
      </div>

      {/* ── Mega menu (desktop) / Slide drawer (mobile) ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Mobile slide-in drawer */}
          <div className="sm:hidden flex h-full">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMenuOpen(false)}
            />
            <div className="relative bg-white w-[82%] max-w-xs h-full overflow-y-auto shadow-2xl flex flex-col">
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/logocitynews.png`}
                    alt="logo"
                    width={120}
                    height={40}
                    className="w-[110px]"
                  />
                </Link>
                <button onClick={() => setMenuOpen(false)} aria-label="Close">
                  <RxCross2 className="text-2xl text-gray-400" />
                </button>
              </div>
              {/* Category list */}
              <div className="px-5 py-4 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
                  All Categories
                </p>
                {megaMenuItems.map((item) => (
                  <Link
                    key={item.text}
                    href={item.link}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 py-3 text-sm font-medium text-gray-700 border-b border-gray-50 hover:text-red-600 transition-colors"
                  >
                    <GoDotFill className="text-[9px] text-red-400 flex-shrink-0" />
                    {item.text}
                  </Link>
                ))}
              </div>
              {/* Quick links */}
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
                  Quick Links
                </p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                  {quickLinks.map((item) => (
                    <Link
                      key={item.text}
                      href={item.link}
                      onClick={() => setMenuOpen(false)}
                      className="text-xs text-gray-600 hover:text-red-600 transition-colors"
                    >
                      {item.text}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop mega menu */}
          <div className="hidden sm:block bg-black/60 h-full overflow-y-auto">
            <div className="bg-white">
              <div className="border-b border-gray-100">
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
                      <RxCross2 className="text-3xl text-gray-500" />
                    </button>
                  </div>
                </BodyContainer>
              </div>
              <BodyContainer>
                <div className="flex flex-col lg:flex-row gap-6 py-6">
                  <div className="lg:w-[65%]">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 text-base font-medium">
                      {megaMenuItems.map((item) => (
                        <Link
                          key={item.text}
                          href={item.link}
                          onClick={() => setMenuOpen(false)}
                          className="text-gray-700 hover:text-red-600 transition-colors"
                        >
                          {item.text}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="hidden lg:block w-px bg-gray-200 self-stretch" />
                  <div className="lg:w-[33%]">
                    <StayTuned colon={true} />
                    <div className="border-t border-gray-200 pt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
                      {quickLinks.map((item) => (
                        <Link
                          key={item.text}
                          href={item.link}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
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
        </div>
      )}

      {/* ── Mobile Follow Us bottom sheet ── */}
      {followOpen && (
        <div
          className="sm:hidden fixed inset-0 z-50 bg-black/50 flex items-end"
          onClick={(e) => e.target === e.currentTarget && setFollowOpen(false)}
        >
          <div className="bg-white w-full rounded-t-2xl px-6 pt-5 pb-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-800">Follow Us</h3>
              <button onClick={() => setFollowOpen(false)}>
                <RxCross2 className="text-xl text-gray-400" />
              </button>
            </div>
            <StayTuned />
          </div>
        </div>
      )}

      {/* ── Search overlay ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <div className="bg-white rounded-xl w-full max-w-lg py-8 px-6 relative shadow-2xl">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-4 top-4"
              aria-label="Close search"
            >
              <RxCross2 className="text-2xl text-gray-400" />
            </button>
            <h3 className="font-semibold text-xl text-center mb-5 text-gray-800">
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
                className="input input-bordered w-full h-[52px] text-base"
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
