"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { IoSearchSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import LoadingSpinner from "../../components/LoadingSpinner";

const imageBaseURL = process.env.NEXT_PUBLIC_IMAGE_URL;
const LIMIT = 12;
const FALLBACK = "https://placehold.co/200x140/e2e8f0/94a3b8?text=No+Image";

interface NewsEntry {
  id: number;
  title: string;
  description: string | null;
  highlight_text: string | null;
  featured_image: string | null;
  reporter_name: string | null;
  created_at: string;
}

function imgSrc(path: string | null) {
  if (!path) return FALLBACK;
  if (path.startsWith("http")) return path;
  return `${imageBaseURL}/${path}`;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "").trim();
}

// Highlight matching query words in text
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") ?? "";

  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState<NewsEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchResults(q: string, pageNum: number, replace = false) {
    if (!q.trim()) return;
    try {
      const res = await fetch(
        `/api/public/news/search?q=${encodeURIComponent(q.trim())}&page=${pageNum}&limit=${LIMIT}`
      );
      const data = await res.json();
      if (!res.ok) return;
      setResults((prev) => (replace ? data.news : [...prev, ...data.news]));
      setTotal(data.total);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Search error:", err);
    }
  }

  // Run search whenever URL query changes
  useEffect(() => {
    setInputValue(query);
    if (!query.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    setPage(1);
    fetchResults(query, 1, true).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function clearSearch() {
    setInputValue("");
    setResults([]);
    setTotal(0);
    router.push("/search");
    inputRef.current?.focus();
  }

  async function loadMore() {
    setLoadingMore(true);
    const next = page + 1;
    await fetchResults(query, next);
    setPage(next);
    setLoadingMore(false);
  }

  return (
    <div className="xl:max-w-5xl md:mx-auto px-4 sm:px-6 pt-6 mb-12">

      {/* ── Search box ── */}
      <form onSubmit={handleSearch} className="relative mb-8">
        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-red-500 transition-colors">
          <IoSearchSharp className="text-gray-400 text-xl ml-4 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for news, topics, reporters..."
            className="flex-1 py-4 px-3 text-base outline-none bg-transparent"
            autoFocus={!query}
          />
          {inputValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-2 mr-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RxCross2 className="text-lg" />
            </button>
          )}
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 text-sm font-semibold transition-colors flex-shrink-0"
          >
            Search
          </button>
        </div>
      </form>

      {/* ── No query state ── */}
      {!query.trim() && (
        <div className="text-center py-16">
          <IoSearchSharp className="text-gray-200 text-7xl mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Type something above to search news</p>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && <LoadingSpinner />}

      {/* ── Results header ── */}
      {!loading && query && (
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Results for{" "}
              <span className="text-red-600">&ldquo;{query}&rdquo;</span>
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {total} article{total !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>
      )}

      {/* ── No results ── */}
      {!loading && query && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-2">
            No results found for &ldquo;{query}&rdquo;
          </p>
          <p className="text-gray-400 text-sm">Try different keywords or check spelling</p>
        </div>
      )}

      {/* ── Results list ── */}
      {!loading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((item) => {
            const desc = item.description ? stripHtml(item.description).substring(0, 200) : "";
            return (
              <Link href={`/news/details/${item.id}`} key={item.id} className="group block">
                <div className="flex gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-red-200 hover:shadow-md transition-all">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-[110px] h-[80px] sm:w-[160px] sm:h-[110px] rounded-lg overflow-hidden">
                    <Image
                      src={imgSrc(item.featured_image)}
                      alt={item.title}
                      width={160}
                      height={110}
                      className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {item.highlight_text && (
                      <span className="inline-block text-red-500 text-[11px] font-semibold uppercase tracking-wide mb-1">
                        <Highlight text={item.highlight_text} query={query} />
                      </span>
                    )}
                    <h2 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
                      <Highlight text={item.title} query={query} />
                    </h2>
                    {desc && (
                      <p className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-2 hidden sm:block">
                        <Highlight text={desc} query={query} />
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-gray-400 text-xs">
                      <span>{item.reporter_name ?? "Our Reporter"}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* ── Load more ── */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-10 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-red-500 hover:text-red-600 transition-all disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load More Results"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
