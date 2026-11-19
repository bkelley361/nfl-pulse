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
      {/* Header & Source Filter Tabs (All amounts strictly inline on one line) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-editorial text-xs font-semibold text-[var(--muted)]">02</span>
            <h3 className="font-editorial text-xl font-medium text-[var(--foreground)] tracking-tight">
              {teamDisplayName} News Stream
            </h3>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Aggregated coverage organized chronologically by latest reporting.
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

      {/* Active Search Results Indicator */}
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

      {/* Spacious Full-Width Articles Grid */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map((article) => (
            <a
              key={article.id}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group calm-card p-5 sm:p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              <div>
                {/* Hero Photo if available */}
                {article.imageUrl && (
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-[var(--input)]">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 px-3 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                      Featured
                    </div>
                  </div>
                )}

                {/* Source & Relative Timestamp */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      article.isOfficial
                        ? "bg-team-tint text-team border border-team-tint"
                        : "bg-[var(--input)] text-[var(--muted)] border border-[var(--border)]"
                    }`}
                  >
                    {article.source}
                  </span>

                  <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <Clock className="w-3.5 h-3.5 text-[var(--muted-light)]" />
                    {article.relativeTime}
                  </span>
                </div>

                {/* Headline */}
                <h4 className="font-editorial text-lg font-semibold text-[var(--foreground)] group-hover:text-team transition-colors leading-snug line-clamp-3">
                  {article.title}
                </h4>

                {/* Description */}
                {article.description && (
                  <p className="text-xs text-[var(--muted)] mt-2 line-clamp-3 leading-relaxed">
                    {article.description}
                  </p>
                )}
              </div>

              {/* Bottom Tactile Action */}
              <div className="mt-5 pt-3.5 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)] group-hover:text-team transition-colors">
                <span className="text-xs font-semibold">Read Full Story</span>
                <span className="w-6 h-6 rounded-full bg-[var(--input)] flex items-center justify-center group-hover:bg-team group-hover:text-white transition-all shadow-2xs">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
