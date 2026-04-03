"use client";

import { useEffect, useState } from "react";
import { motion, type Variants, type Transition } from "framer-motion";
import {
  LayoutGrid,
  Users,
  TrendingUp,
  Star,
  BarChart3,
  ChevronRight,
  Flame,
  ArrowUpRight,
  Trophy,
} from "lucide-react";
import { AttemptsBarChart } from "@/components/charts/bar-chart";

// ─── Types ────────────────────────────────────────────────────────────────────

type Stats = {
  totalQuizzes: number;
  totalAttempts: number;
  avgScore: number;
  topQuiz: {
    title: string;
    attempts: number;
  };
  quizStats: {
    title: string;
    attempts: number;
  }[];
};

// ─── Animation helpers ────────────────────────────────────────────────────────

function makeFadeUp(i: number = 0): Variants {
  const t: Transition = {
    duration: 0.55,
    delay: i * 0.08,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };
  return {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: t },
  };
}

function makeFadeIn(i: number = 0): Variants {
  const t: Transition = { duration: 0.45, delay: i * 0.07 };
  return {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: t },
  };
}

// ─── Stat card config ─────────────────────────────────────────────────────────

interface StatConfig {
  key: keyof Pick<Stats, "totalQuizzes" | "totalAttempts" | "avgScore">;
  label: string;
  icon: React.ElementType;
  suffix?: string;
  accent: string;       // text colour
  ring: string;         // ring colour
  glow: string;         // bg glow colour
  border: string;       // border colour
  iconBg: string;       // icon bg
}

const statConfigs: StatConfig[] = [
  {
    key: "totalQuizzes",
    label: "Total Quizzes",
    icon: LayoutGrid,
    accent: "text-sky-400",
    ring: "ring-sky-500/30",
    glow: "bg-sky-500/10",
    border: "border-sky-500/20",
    iconBg: "bg-sky-500/15",
  },
  {
    key: "totalAttempts",
    label: "Total Attempts",
    icon: Users,
    accent: "text-violet-400",
    ring: "ring-violet-500/30",
    glow: "bg-violet-500/10",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/15",
  },
  {
    key: "avgScore",
    label: "Avg. Score",
    icon: TrendingUp,
    suffix: "%",
    accent: "text-emerald-400",
    ring: "ring-emerald-500/30",
    glow: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/15",
  },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/5 ${className ?? ""}`}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-80" />
      <Skeleton className="h-64" />
    </div>
  );
}

// ─── Rank badge ───────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 0)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-400 ring-1 ring-amber-500/30">
        <Trophy size={10} /> #1
      </span>
    );
  if (rank === 1)
    return (
      <span className="inline-flex rounded-full bg-slate-400/10 px-2 py-0.5 text-xs font-semibold text-slate-400 ring-1 ring-slate-400/20">
        #2
      </span>
    );
  return (
    <span className="inline-flex rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-slate-500">
      #{rank + 1}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreatorDashboard() {
  const [data, setData] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/creator/metrics");
      const json = await res.json();
      setData(json);
    };
    fetchData();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Bricolage Grotesque', sans-serif; }

        /* Shimmer border */
        .shimmer-border { position: relative; }
        .shimmer-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg,rgba(56,189,248,.3),rgba(139,92,246,.2),rgba(52,211,153,.2),rgba(56,189,248,.1));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        /* Progress bar shimmer */
        @keyframes barShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .bar-shimmer {
          background: linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8);
          background-size: 300% auto;
          animation: barShimmer 3s linear infinite;
        }
        .bar-shimmer-emerald {
          background: linear-gradient(90deg, #34d399, #38bdf8, #34d399);
          background-size: 300% auto;
          animation: barShimmer 3s linear infinite;
        }

        /* Stat number gradient */
        .stat-num {
          background: linear-gradient(135deg, #f8fafc, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="relative min-h-screen overflow-x-hidden bg-[#030712] font-sans text-white antialiased">

        {/* ── Background ────────────────────────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-5%,rgba(56,189,248,0.06),transparent)]" />
          <div className="absolute -left-64 -top-64 h-[700px] w-[700px] rounded-full bg-sky-500/8 blur-[120px]" style={{ animation: "pulse 16s ease-in-out infinite" }} />
          <div className="absolute -bottom-64 -right-32 h-[600px] w-[600px] rounded-full bg-violet-500/8 blur-[110px]" style={{ animation: "pulse 20s ease-in-out infinite 3s" }} />
        </div>

        {/* ── Page wrapper ──────────────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 md:px-8 lg:px-10">

          {/* ── Header ────────────────────────────────────────────────── */}
          <motion.div
            variants={makeFadeUp(0)}
            initial="hidden"
            animate="show"
            className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
                Creator Studio
              </p>
              <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Your quiz performance at a glance.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live data
            </div>
          </motion.div>

          {/* ── Loading skeleton ──────────────────────────────────────── */}
          {!data && <DashboardSkeleton />}

          {/* ── Content ───────────────────────────────────────────────── */}
          {data && (
            <div className="space-y-8">

              {/* ── Stat Cards ──────────────────────────────────────── */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                {/* Standard stat cards */}
                {statConfigs.map((cfg, i) => {
                  const value = data[cfg.key];
                  return (
                    <motion.div
                      key={cfg.key}
                      variants={makeFadeUp(i)}
                      initial="hidden"
                      animate="show"
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 220, damping: 18 }}
                      className={`shimmer-border group relative overflow-hidden rounded-2xl border p-5 backdrop-blur-sm ${cfg.glow} ${cfg.border}`}
                    >
                      {/* Ambient blob */}
                      <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl ${cfg.glow}`} />

                      <div className="flex items-start justify-between">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${cfg.ring} ${cfg.iconBg}`}>
                          <cfg.icon size={18} className={cfg.accent} />
                        </div>
                        <ArrowUpRight size={14} className="text-slate-700 transition-colors group-hover:text-slate-500" />
                      </div>

                      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                        {cfg.label}
                      </p>
                      <p className={`font-display mt-1 text-3xl font-extrabold stat-num`}>
                        {value}{cfg.suffix ?? ""}
                      </p>
                    </motion.div>
                  );
                })}

                {/* Top Quiz card */}
                <motion.div
                  variants={makeFadeUp(3)}
                  initial="hidden"
                  animate="show"
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="shimmer-border group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 backdrop-blur-sm"
                >
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/15 blur-2xl" />

                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 ring-1 ring-amber-500/30">
                      <Flame size={18} className="text-amber-400" />
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-400 ring-1 ring-amber-500/30">
                      <Star size={9} fill="currentColor" /> Top
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Top Quiz
                  </p>
                  <p className="font-display mt-1 text-lg font-bold leading-snug text-white">
                    {data.topQuiz?.title || "N/A"}
                  </p>
                  {data.topQuiz?.attempts > 0 && (
                    <p className="mt-1 text-xs text-amber-400/70">
                      {data.topQuiz.attempts} attempts
                    </p>
                  )}
                </motion.div>
              </div>

              {/* ── Chart ───────────────────────────────────────────── */}
              <motion.div
                variants={makeFadeUp(4)}
                initial="hidden"
                animate="show"
                className="shimmer-border overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 ring-1 ring-sky-500/30">
                      <BarChart3 size={15} className="text-sky-400" />
                    </div>
                    <div>
                      <h2 className="font-display text-sm font-bold text-white">
                        Attempts per Quiz
                      </h2>
                      <p className="text-[11px] text-slate-500">All time</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-500">
                    {data.quizStats.length} quizzes
                  </span>
                </div>

                <div className="w-full h-[300px] p-4">
                  <AttemptsBarChart
                    data={data.quizStats.map((q) => ({
                      name: q.title,
                      value: q.attempts,
                    }))}
                  />
                </div>
              </motion.div>

              {/* ── Performance List ─────────────────────────────────── */}
              <motion.div
                variants={makeFadeUp(5)}
                initial="hidden"
                animate="show"
                className="shimmer-border overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] backdrop-blur-xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 ring-1 ring-violet-500/30">
                      <TrendingUp size={15} className="text-violet-400" />
                    </div>
                    <div>
                      <h2 className="font-display text-sm font-bold text-white">
                        Quiz Performance
                      </h2>
                      <p className="text-[11px] text-slate-500">Sorted by attempts</p>
                    </div>
                  </div>
                </div>

                {/* List items */}
                <div className="divide-y divide-white/5">
                  {[...data.quizStats]
                    .sort((a, b) => b.attempts - a.attempts)
                    .map((quiz, i) => {
                      const max = Math.max(...data.quizStats.map((q) => q.attempts), 1);
                      const pct = Math.round((quiz.attempts / max) * 100);

                      return (
                        <motion.div
                          key={i}
                          variants={makeFadeIn(i)}
                          initial="hidden"
                          animate="show"
                          className="group flex flex-col gap-2 px-6 py-4 transition-colors hover:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-4"
                        >
                          {/* Rank + title */}
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <RankBadge rank={i} />
                            <span className="truncate text-sm font-medium text-slate-200">
                              {quiz.title}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="flex items-center gap-3 sm:w-48">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                className={`h-full rounded-full ${i === 0 ? "bar-shimmer" : "bar-shimmer-emerald"}`}
                              />
                            </div>
                            <span className="w-16 text-right text-xs font-semibold text-slate-400">
                              {quiz.attempts} att.
                            </span>
                          </div>

                          {/* Arrow */}
                          <ChevronRight
                            size={14}
                            className="hidden text-slate-700 transition-all group-hover:translate-x-0.5 group-hover:text-slate-500 sm:block"
                          />
                        </motion.div>
                      );
                    })}
                </div>
              </motion.div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}