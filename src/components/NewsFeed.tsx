"use client";

import { useState, useMemo } from "react";
import type { NewsArticle } from "@/types";
import { ArrowUpRight, Search, Clock, SlidersHorizontal, X, Tag } from "lucide-react";
import { SunburstIcon, EditorialDispatch } from "@/components/icons/EditorialIcons";

interface NewsFeedProps {
  articles: NewsArticle[];
  teamDisplayName: string;
}

type TopicFilter = "ALL" | "INJURY" | "ROSTER" | "PRESS" | "PREVIEW" | "ANALYSIS";

const TOPIC_CONFIG: { id: TopicFilter; label: string; keywords: RegExp }[] = [
  { id: "ALL", label: "All Topics", keywords: /./ },
  { id: "INJURY", label: "Injuries & Health", keywords: /injur|hurt|quest|doubt|ir\b|concuss|acl|hamstring|ankle|out\b|surgery|status|practic/i },
  { id: "ROSTER", label: "Roster & Moves", keywords: /trade|sign|waiv|roster|contract|free agent|bench|elevat|practice squad|cut\b|deal|pick/i },
  { id: "PRESS", label: "Quotes & Pressers", keywords: /coach|press|said|says|spoke|react|interview|comment|conf|message|campbell|locker room|dan/i },
  { id: "PREVIEW", label: "Game Previews", keywords: /vs\b|versus|preview|matchup|spread|odds|pick|week|predic|keys to|slate/i },
  { id: "ANALYSIS", label: "Film & Analysis", keywords: /grade|film|breakdown|stat|report|midseason|rank|future|evaluat|standout/i },
];

// Estimates card height in pixels to greedily balance columns and eliminate blank spaces
function estimateCardHeight(article: NewsArticle): number {
  if (article.imageUrl) {
    return 340;
  }
  let h = 125;
  if (article.title.length > 50) h += 22;
  if (article.description) h += 36;
  return h;
}

// Distributes articles into balanced columns based on accumulated height
function distributeArticles(articles: NewsArticle[], numCols: number): NewsArticle[][] {
  const cols: NewsArticle[][] = Array.from({ length: numCols }, () => []);
  const heights: number[] = Array.from({ length: numCols }, () => 0);

  articles.forEach((article) => {
    let shortestColIndex = 0;
    for (let i = 1; i < numCols; i++) {
      if (heights[i] < heights[shortestColIndex]) {
        shortestColIndex = i;
      }
    }

    cols[shortestColIndex].push(article);
    heights[shortestColIndex] += estimateCardHeight(article) + 16;
  });

  return cols;
}

function NewsCard({ article }: { article: NewsArticle }) {
  const hasImage = Boolean(article.imageUrl);

  // Estimated read time
  const wordCount =
    article.title.split(" ").length +
    (article.description ? article.description.split(" ").length : 0);
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 50));

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group calm-card hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between p-4 sm:p-5 hover:border-team-tint hover:shadow-md"
    >
      <div>
        {/* Photo if available */}
        {hasImage && (
          <div className="relative w-full rounded-xl overflow-hidden mb-3 bg-[var(--input)] aspect-[16/10]">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
              {article.isOfficial ? "ESPN Official" : "Beat Feature"}
            </div>
          </div>
        )}

        {/* Source badge + Time ago row + Estimated read time */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold truncate max-w-[150px] ${
              article.isOfficial
                ? "bg-team-tint text-team border border-team-tint font-bold"
                : "bg-[var(--input)] text-[var(--muted)] border border-[var(--border)] font-medium"
            }`}
          >
            {article.source}
          </span>

          <span className="flex items-center gap-1.5 text-[11px] text-[var(--muted)] font-mono shrink-0">
            <Clock className="w-3 h-3 text-[var(--muted-light)]" />
            <span>{article.relativeTime}</span>
            <span className="text-[var(--border)]">•</span>
            <span>{readTimeMinutes}m read</span>
          </span>
        </div>

        {/* Headline */}
        <h4 className="font-editorial font-semibold text-sm sm:text-base text-[var(--foreground)] group-hover:text-team transition-colors leading-snug line-clamp-3">
          {article.title}
        </h4>

        {/* Description snippet */}
        {article.description && (
          <p className="text-xs text-[var(--muted)] mt-1.5 line-clamp-2 leading-relaxed">
            {article.description}
          </p>
        )}
      </div>

      {/* Footer / Read link */}
      <div className="mt-3.5 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)] group-hover:text-team transition-colors">
        <span className="text-[11px] font-semibold">Read Coverage</span>
        <span className="w-5.5 h-5.5 rounded-full bg-[var(--input)] flex items-center justify-center group-hover:bg-team group-hover:text-white transition-all shadow-2xs">
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </a>
  );
}

export default function NewsFeed({ articles, teamDisplayName }: NewsFeedProps) {
  const [sourceFilter, setSourceFilter] = useState<"ALL" | "ESPN" | "WIRE">("ALL");
  const [topicFilter, setTopicFilter] = useState<TopicFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // 1. Search Query Filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        article.title.toLowerCase().includes(q) ||
        article.source.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // 2. Source Filter
      if (sourceFilter === "ESPN" && !(article.isOfficial || article.source.toLowerCase().includes("espn"))) {
        return false;
      }
      if (sourceFilter === "WIRE" && (article.isOfficial || article.source.toLowerCase().includes("espn"))) {
        return false;
      }

      // 3. Topic Filter
      if (topicFilter !== "ALL") {
        const topicConfig = TOPIC_CONFIG.find((t) => t.id === topicFilter);
        if (topicConfig) {
          const text = `${article.title} ${article.description}`;
          if (!topicConfig.keywords.test(text)) return false;
        }
      }

      return true;
    });
  }, [articles, sourceFilter, topicFilter, searchQuery]);

  // Topic counts for filter pills
  const topicCounts = useMemo(() => {
    const counts: Record<TopicFilter, number> = {
      ALL: articles.length,
      INJURY: 0,
      ROSTER: 0,
      PRESS: 0,
      PREVIEW: 0,
      ANALYSIS: 0,
    };
    articles.forEach((a) => {
      const text = `${a.title} ${a.description}`;
      TOPIC_CONFIG.forEach((tc) => {
        if (tc.id !== "ALL" && tc.keywords.test(text)) {
          counts[tc.id]++;
        }
      });
    });
    return counts;
  }, [articles]);

  const tabletColumns = useMemo(
    () => distributeArticles(filteredArticles, 2),
    [filteredArticles]
  );
  const desktopColumns = useMemo(
    () => distributeArticles(filteredArticles, 3),
    [filteredArticles]
  );

  const espnCount = articles.filter(
    (a) => a.isOfficial || a.source.toLowerCase().includes("espn")
  ).length;
  const wireCount = articles.filter(
    (a) => !a.isOfficial && !a.source.toLowerCase().includes("espn")
  ).length;

  return (
    <div className="space-y-6">
      {/* Header & Source Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <SunburstIcon className="w-4 h-4 text-team" />
            <h3 className="font-editorial text-xl font-medium text-[var(--foreground)] tracking-tight">
              {teamDisplayName} News Stream
            </h3>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Real-time coverage organized in an autofit bento layout with topic intelligence.
          </p>
        </div>

        {/* Source Tabs with Inline Counts */}
        <div className="inline-flex items-center rounded-full bg-[var(--input)] p-1 border border-[var(--border)] self-start sm:self-auto shadow-inner">
          <button
            onClick={() => setSourceFilter("ALL")}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              sourceFilter === "ALL"
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
            onClick={() => setSourceFilter("ESPN")}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              sourceFilter === "ESPN"
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
            onClick={() => setSourceFilter("WIRE")}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              sourceFilter === "WIRE"
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
      <div className="space-y-3">
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

        {/* Feature 4: Topic Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          <span className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider flex items-center gap-1 pl-1 shrink-0">
            <Tag className="w-3 h-3 text-team" />
            <span>Topic:</span>
          </span>
          {TOPIC_CONFIG.map((tc) => {
            const count = topicCounts[tc.id];
            if (tc.id !== "ALL" && count === 0) return null;
            const isSelected = topicFilter === tc.id;
            return (
              <button
                key={tc.id}
                onClick={() => setTopicFilter(tc.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? "bg-team text-white font-semibold shadow-xs"
                    : "bg-[var(--input)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]"
                }`}
              >
                <span>{tc.label}</span>
                <span
                  className={`text-[10px] font-mono px-1 rounded-full ${
                    isSelected ? "bg-black/20 text-white" : "bg-[var(--card)] text-[var(--muted)]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Search & Filter Status */}
      {(searchQuery || topicFilter !== "ALL") && (
        <div className="flex items-center justify-between text-xs text-[var(--muted)] px-1">
          <span>
            Showing <strong>{filteredArticles.length}</strong> stories
            {topicFilter !== "ALL" ? ` in ${TOPIC_CONFIG.find((t) => t.id === topicFilter)?.label}` : ""}
            {searchQuery ? ` matching "${searchQuery}"` : ""}
          </span>
          <button
            onClick={() => {
              setSearchQuery("");
              setTopicFilter("ALL");
            }}
            className="text-team underline cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Autofit Bento Masonry Columns (Zero blank space) */}
      {filteredArticles.length === 0 ? (
        <div className="calm-card p-12 text-center">
          <EditorialDispatch className="w-8 h-8 mx-auto text-[var(--muted-light)] mb-3" />
          <h4 className="font-editorial text-lg font-medium text-[var(--foreground)]">
            No articles found
          </h4>
          <p className="text-xs text-[var(--muted)] mt-1">
            Try a different search keyword or switch back to the "All Topics" tab.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Layout: 1 Column */}
          <div className="flex flex-col gap-4 md:hidden">
            {filteredArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          {/* Tablet Layout: 2 Height-Balanced Masonry Columns */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-4 items-start">
            {tabletColumns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-4">
                {col.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ))}
          </div>

          {/* Desktop Layout: 3 Height-Balanced Masonry Columns */}
          <div className="hidden lg:grid grid-cols-3 gap-4 items-start">
            {desktopColumns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-4">
                {col.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
