"use client";

import { useState, useMemo } from "react";
import type { NewsArticle } from "@/types";
import { Newspaper, ExternalLink, Search, Clock, Flame } from "lucide-react";

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
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-indigo-400" />
            {teamDisplayName} News Stream
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Aggregated real-time headlines from ESPN, local beat writers, and sports media.
          </p>
        </div>

        {/* Source Filter Pills */}
        <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              filter === "ALL"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All ({articles.length})
          </button>
          <button
            onClick={() => setFilter("ESPN")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              filter === "ESPN"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ESPN ({espnCount})
          </button>
          <button
            onClick={() => setFilter("WIRE")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              filter === "WIRE"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Beat / Wire ({wireCount})
          </button>
        </div>
      </div>

      {/* Quick Search within News */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter news headlines (e.g. injury, coach, injury report, trade)..."
          className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* News Grid */}
      {filteredArticles.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
          No news articles found for this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredArticles.map((article) => (
            <a
              key={article.id}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-all duration-150 hover:-translate-y-0.5"
            >
              <div>
                {/* Image preview if available */}
                {article.imageUrl && (
                  <div className="relative w-full h-36 rounded-lg overflow-hidden mb-3 bg-slate-950">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
                      Featured
                    </div>
                  </div>
                )}

                {/* Meta Bar */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      article.isOfficial
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {article.source}
                  </span>

                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {article.relativeTime}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-3 leading-snug">
                  {article.title}
                </h4>

                {/* Description snippet if any */}
                {article.description && (
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                    {article.description}
                  </p>
                )}
              </div>

              {/* Bottom footer link */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-indigo-400 transition-colors">
                <span className="text-[11px] font-medium">Read Article</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
