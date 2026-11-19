"use client";

import { useState, useMemo } from "react";
import type { NewsArticle } from "@/types";
import { Newspaper, ArrowUpRight, Search, Clock, SlidersHorizontal } from "lucide-react";

interface NewsFeedProps {
  articles: NewsArticle[];
  teamDisplayName: string;
}

export default function NewsFeed({ articles, teamDisplayName }: NewsFeedProps) {
  const [filter, setFilter] = useState<"ALL" | "ESPN" | "WIRE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase());

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
    <div className="space-y-5">
      {/* Header & Source Filter Tabs (Image 4 Component 07) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-editorial text-xs font-semibold text-[var(--muted)]">02</span>
            <h3 className="font-editorial text-xl font-medium text-[var(--foreground)] tracking-tight">
              {teamDisplayName} Dispatch
            </h3>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Real-time reporting from ESPN, regional beat writers, and sports media.
          </p>
        </div>

        {/* Tactile Source Tabs */}
        <div className="inline-flex rounded-full bg-[var(--input)] p-1 border border-[var(--border)] self-start sm:self-auto shadow-inner">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === "ALL"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            All ({articles.length})
          </button>
          <button
            onClick={() => setFilter("ESPN")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === "ESPN"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            ESPN ({espnCount})
          </button>
          <button
            onClick={() => setFilter("WIRE")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === "WIRE"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Beat / Wire ({wireCount})
          </button>
        </div>
      </div>

      {/* Pill Search Input Field (Image 4 Component 04) */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter headlines by keyword (e.g. injury, coach, roster, trade)..."
          className="calm-input w-full pl-10 pr-10 py-2 text-xs placeholder:text-[var(--muted)] shadow-inner"
        />
        <SlidersHorizontal className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-light)] pointer-events-none" />
      </div>

      {/* Articles Feed */}
      {filteredArticles.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-[var(--input)]/50 border border-[var(--border)] text-[var(--muted)] text-xs">
          No news articles found for this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredArticles.map((article) => (
            <a
              key={article.id}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group calm-card p-4 flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-150 block cursor-pointer"
            >
              <div>
                {/* Image preview if available */}
                {article.imageUrl && (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-[var(--input)]">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                      Featured
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

                  <span className="flex items-center gap-1 text-[11px] text-[var(--muted)]">
                    <Clock className="w-3 h-3 text-[var(--muted-light)]" />
                    {article.relativeTime}
                  </span>
                </div>

                {/* Headline */}
                <h4 className="font-editorial text-base font-semibold text-[var(--foreground)] group-hover:text-team transition-colors leading-snug line-clamp-2">
                  {article.title}
                </h4>

                {/* Description snippet */}
                {article.description && (
                  <p className="text-xs text-[var(--muted)] mt-1.5 line-clamp-2 leading-relaxed">
                    {article.description}
                  </p>
                )}
              </div>

              {/* Bottom Tactile Pill Action (Image 4 Component 03: Continue ->) */}
              <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)] group-hover:text-team transition-colors">
                <span className="text-[11px] font-medium">Read Coverage</span>
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
