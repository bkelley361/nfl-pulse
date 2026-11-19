"use client";

import { useState, useMemo } from "react";
import type { NewsArticle } from "@/types";
import { Newspaper, ArrowUpRight, Search, Clock, SlidersHorizontal, X } from "lucide-react";

interface NewsFeedProps {
  articles: NewsArticle[];
  teamDisplayName: string;
}

export default function NewsFeed({ articles, teamDisplayName }: NewsFeedProps) {
  const [filter, setFilter] = useState<"ALL" | "ESPN" | "WIRE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        article.title.toLowerCase().includes(q) ||
        article.source.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filter === "ESPN") {
        return article.isOfficial || article.source.toLowerCase().includes("espn");
      }
      if (filter === "WIRE") {
        return !article.isOfficial && !article.source.toLowerCase().includes("espn");
      }
      return true;
    });
  }, [articles, filter, searchQuery]);

  const espnCount = articles.filter(
    (a) => a.isOfficial || a.source.toLowerCase().includes("espn")
  ).length;
  const wireCount = articles.filter(
    (a) => !a.isOfficial && !a.source.toLowerCase().includes("espn")
  ).length;

  return (
    <div className="space-y-6">
      {/* Header & Source Filter Tabs (All counts strictly inline on one line) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-editorial text-xs font-semibold text-[var(--muted)]">02</span>
            <h3 className="font-editorial text-xl font-medium text-[var(--foreground)] tracking-tight">
              {teamDisplayName} News Stream
            </h3>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Real-time coverage organized by latest reporting in a responsive bento box layout.
          </p>
        </div>

        {/* Tactile Source Tabs with Inline Counts */}
        <div className="inline-flex items-center rounded-full bg-[var(--input)] p-1 border border-[var(--border)] self-start sm:self-auto shadow-inner">
          <button
            onClick={() => setFilter("ALL")}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              filter === "ALL"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span>All</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--input)] border border-[var(--border)] font-normal text-[var(--muted)]">
              {articles.length}
            </span>
          </button>

          <button
            onClick={() => setFilter("ESPN")}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              filter === "ESPN"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span>ESPN</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--input)] border border-[var(--border)] font-normal text-[var(--muted)]">
              {espnCount}
            </span>
          </button>

          <button
            onClick={() => setFilter("WIRE")}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              filter === "WIRE"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span>Beat & Wire</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--input)] border border-[var(--border)] font-normal text-[var(--muted)]">
              {wireCount}
            </span>
          </button>
        </div>
      </div>

      {/* Prominent Live Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${teamDisplayName} headlines, injuries, coach pressers, trade rumors...`}
          className="calm-input w-full pl-11 pr-11 py-3 text-sm placeholder:text-[var(--muted)] shadow-inner"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery("")}
            className="w-5 h-5 rounded-full absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <SlidersHorizontal className="w-3.5 h-3.5 absolute right-4.5 top-1/2 -translate-y-1/2 text-[var(--muted-light)] pointer-events-none" />
        )}
      </div>

      {searchQuery && (
        <div className="flex items-center justify-between text-xs text-[var(--muted)] px-1">
          <span>
            Found <strong>{filteredArticles.length}</strong> matching stories for "{searchQuery}"
          </span>
          <button
            onClick={() => setSearchQuery("")}
            className="text-team underline cursor-pointer"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Bento Box Grid (Compact cards when no picture, hero cards with photos) */}
      {filteredArticles.length === 0 ? (
        <div className="calm-card p-12 text-center">
          <Newspaper className="w-8 h-8 mx-auto text-[var(--muted-light)] mb-3" />
          <h4 className="font-editorial text-lg font-medium text-[var(--foreground)]">
            No articles found
          </h4>
          <p className="text-xs text-[var(--muted)] mt-1">
            Try a different search keyword or switch back to the "All" tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {filteredArticles.map((article, idx) => {
            const hasImage = Boolean(article.imageUrl);
            // Feature the first 1-2 articles with images as wider bento spans on large screens
            const isFeatured = hasImage && idx < 2;

            return (
              <a
                key={article.id}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group calm-card hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isFeatured
                    ? "md:col-span-2 p-5 sm:p-6"
                    : hasImage
                    ? "p-4 sm:p-5"
                    : "p-4 sm:p-4.5"
                }`}
              >
                <div>
                  {/* Photo if available */}
                  {hasImage && (
                    <div
                      className={`relative w-full rounded-2xl overflow-hidden mb-3.5 bg-[var(--input)] ${
                        isFeatured ? "h-52 sm:h-64" : "h-36 sm:h-40"
                      }`}
                    >
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                        {article.isOfficial ? "ESPN Official" : "Featured"}
                      </div>
                    </div>
                  )}

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        article.isOfficial
                          ? "bg-team-tint text-team border border-team-tint"
                          : "bg-[var(--input)] text-[var(--muted)] border border-[var(--border)]"
                      }`}
                    >
                      {article.source}
                    </span>

                    <span className="flex items-center gap-1.5 text-[11px] text-[var(--muted)] font-mono">
                      <Clock className="w-3 h-3 text-[var(--muted-light)]" />
                      {article.relativeTime}
                    </span>
                  </div>

                  {/* Headline */}
                  <h4
                    className={`font-editorial font-semibold text-[var(--foreground)] group-hover:text-team transition-colors leading-snug line-clamp-3 ${
                      isFeatured ? "text-xl sm:text-2xl" : "text-sm sm:text-base"
                    }`}
                  >
                    {article.title}
                  </h4>

                  {/* Description snippet */}
                  {article.description && (
                    <p
                      className={`text-xs text-[var(--muted)] mt-1.5 line-clamp-2 leading-relaxed ${
                        isFeatured ? "sm:line-clamp-3 text-sm" : ""
                      }`}
                    >
                      {article.description}
                    </p>
                  )}
                </div>

                {/* Bottom Action */}
                <div className="mt-3.5 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)] group-hover:text-team transition-colors">
                  <span className="text-[11px] font-semibold">Read Coverage</span>
                  <span className="w-5.5 h-5.5 rounded-full bg-[var(--input)] flex items-center justify-center group-hover:bg-team group-hover:text-white transition-all shadow-2xs">
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
