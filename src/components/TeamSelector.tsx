"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { NFL_TEAMS, type NFLTeam } from "@/data/teams";
import { Search, Trophy, ArrowRight, Sparkles } from "lucide-react";

export default function TeamSelector() {
  const [search, setSearch] = useState("");
  const [conferenceFilter, setConferenceFilter] = useState<"ALL" | "AFC" | "NFC">("ALL");
  const [divisionFilter, setDivisionFilter] = useState<string>("ALL");

  const filteredTeams = useMemo(() => {
    return NFL_TEAMS.filter((team) => {
      const matchesSearch =
        team.displayName.toLowerCase().includes(search.toLowerCase()) ||
        team.name.toLowerCase().includes(search.toLowerCase()) ||
        team.location.toLowerCase().includes(search.toLowerCase()) ||
        team.abbreviation.toLowerCase().includes(search.toLowerCase());

      const matchesConf =
        conferenceFilter === "ALL" || team.conference === conferenceFilter;

      const matchesDiv =
        divisionFilter === "ALL" || team.division === divisionFilter;

      return matchesSearch && matchesConf && matchesDiv;
    });
  }, [search, conferenceFilter, divisionFilter]);

  const conferences = ["ALL", "AFC", "NFC"] as const;
  const divisions = ["ALL", "East", "North", "South", "West"];

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm shadow-xl">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team, city, or abbreviation (e.g. Eagles, KC, 49ers)..."
            className="w-full bg-[#0d1322] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Conference Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
            {conferences.map((conf) => (
              <button
                key={conf}
                onClick={() => setConferenceFilter(conf)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  conferenceFilter === conf
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {conf === "ALL" ? "All NFL" : conf}
              </button>
            ))}
          </div>

          {/* Division Filter */}
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
            {divisions.map((div) => (
              <button
                key={div}
                onClick={() => setDivisionFilter(div)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  divisionFilter === div
                    ? "bg-slate-700 text-slate-100"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {div}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Teams */}
      {filteredTeams.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/30 rounded-2xl border border-slate-800/60">
          <Trophy className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No teams matched your filter</h3>
          <p className="text-sm text-slate-500 mt-1">Try searching for a different team or reset the filters.</p>
          <button
            onClick={() => {
              setSearch("");
              setConferenceFilter("ALL");
              setDivisionFilter("ALL");
            }}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-200 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTeams.map((team) => (
            <Link
              key={team.id}
              href={`/team/${team.slug}`}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
              style={{
                // Subtle colored accent top border
                borderTopColor: team.color,
                borderTopWidth: "3px",
              }}
            >
              {/* Subtle background glow from team color */}
              <div
                className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full blur-2xl opacity-10 group-hover:opacity-25 transition-opacity pointer-events-none"
                style={{ backgroundColor: team.color }}
              />

              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-slate-800/40 p-2 flex items-center justify-center border border-slate-750/50 group-hover:bg-slate-800/80 transition-colors">
                  <img
                    src={team.logo}
                    alt={team.displayName}
                    className="w-11 h-11 object-contain drop-shadow group-hover:scale-110 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-bold border border-slate-700/60">
                    {team.abbreviation}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 font-medium">
                    {team.conference} {team.division}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-100 group-hover:text-white transition-colors">
                  {team.displayName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {team.location}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-blue-400 transition-colors">
                <span>View Team Pulse</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
