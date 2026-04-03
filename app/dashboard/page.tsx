"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, type Variants, type Transition } from "framer-motion";
import {
  LogOut,
  Activity,
  Target,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  ShieldAlert,
  BarChart3,
  PieChart,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { IncreaseSizePieChart } from "@/components/charts/pie-chart";
import { AttemptsBarChart } from "@/components/charts/bar-chart";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardData {
  totalAttempts: number;
  avgScore: number;
  suspiciousCount: number;
  attemptsPerQuiz: { name: string; value: number }[];
  scoreBuckets: { name: string; value: number }[];
}

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

function makeScaleIn(i: number = 0): Variants {
  const t: Transition = {
    duration: 0.45,
    delay: i * 0.07,
    type: "spring",
    stiffness: 180,
  };
  return {
    hidden: { opacity: 0, scale: 0.88 },
    show: { opacity: 1, scale: 1, transition: t },
  };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-white/5 ${className ?? ""}`} />
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Skeleton className="h-80 lg:col-span-2" />
        <Skeleton className="h-80" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;       // text colour
  iconBg: string;       // icon bg
  ring: string;         // ring
  glow: string;         // blob bg
  border: string;       // border
  badge?: string;
  badgeClass?: string;
  index: number;
}

function KpiCard({
  title,
  value,
  icon,
  accent,
  iconBg,
  ring,
  glow,
  border,
  badge,
  badgeClass,
  index,
}: KpiCardProps) {
  return (
    <motion.div
      variants={makeScaleIn(index)}
      initial="hidden"
      animate="show"
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className={`shimmer-border group relative overflow-hidden rounded-2xl border p-5 backdrop-blur-sm ${glow} ${border}`}
    >
      {/* Ambient blob */}
      <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl ${glow}`} />

      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${ring} ${iconBg} ${accent}`}>
          {icon}
        </div>
        {badge && (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${badgeClass}`}>
            {badge}
          </span>
        )}
        {!badge && (
          <ChevronRight size={13} className="text-slate-700 transition-colors group-hover:text-slate-500" />
        )}
      </div>

      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>
      <p className={`font-display mt-1 text-3xl font-extrabold stat-num`}>
        {value}
      </p>
    </motion.div>
  );
}

interface InsightCardProps {
  title: string;
  text: string;
  icon: React.ReactNode;
  danger?: boolean;
  index: number;
}

function InsightCard({ title, text, icon, danger, index }: InsightCardProps) {
  const borderClass = danger ? "border-red-500/25" : "border-sky-500/20";
  const bgClass     = danger ? "bg-red-500/8"      : "bg-sky-500/8";
  const glowClass   = danger ? "bg-red-500/10"     : "bg-sky-500/10";
  const iconBg      = danger ? "bg-red-500/15 ring-red-500/30"   : "bg-sky-500/15 ring-sky-500/30";
  const iconColor   = danger ? "text-red-400"      : "text-sky-400";
  const titleColor  = danger ? "text-red-400"       : "text-sky-300";

  return (
    <motion.div
      variants={makeFadeUp(index)}
      initial="hidden"
      animate="show"
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={`shimmer-border relative overflow-hidden rounded-2xl border p-5 backdrop-blur-sm ${bgClass} ${borderClass}`}
    >
      <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl ${glowClass}`} />

      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-sm font-semibold ${titleColor}`}>{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login";
    }
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    async function fetchData() {
      const res = await fetch("/api/dashboard", { credentials: "include" });
      const result = await res.json();
      if (result.success) setData(result.data);
    }
    fetchData();
  }, [status]);

  const isLoading = status === "loading" || (status === "authenticated" && !data);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Bricolage Grotesque', sans-serif; }

        .shimmer-border { position: relative; }
        .shimmer-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg,rgba(56,189,248,.3),rgba(139,92,246,.2),rgba(52,211,153,.15),rgba(56,189,248,.1));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .stat-num {
          background: linear-gradient(135deg, #f8fafc, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes barShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
      `}</style>

      <div className="relative min-h-dvh overflow-x-hidden bg-[#030712] font-sans text-white antialiased">

        {/* ── Background ──────────────────────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-5%,rgba(56,189,248,0.06),transparent)]" />
          <div
            className="absolute -left-64 -top-64 h-[700px] w-[700px] rounded-full bg-sky-500/8 blur-[120px]"
            style={{ animation: "pulse 16s ease-in-out infinite" }}
          />
          <div
            className="absolute -bottom-64 -right-32 h-[600px] w-[600px] rounded-full bg-violet-500/8 blur-[110px]"
            style={{ animation: "pulse 20s ease-in-out infinite 3s" }}
          />
        </div>

        <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 md:px-8 lg:px-10">

          {/* ── Header ────────────────────────────────────────────────── */}
          <motion.div
            variants={makeFadeUp(0)}
            initial="hidden"
            animate="show"
            className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
                <Sparkles size={11} />
                {session?.user?.name ?? "Your"}'s Analytics
              </div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                Analytics Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Overview of your quiz performance
              </p>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="group flex w-fit items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 backdrop-blur-sm transition-all duration-200 hover:border-red-400/50 hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut size={15} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              Sign Out
            </button>
          </motion.div>

          {/* ── Loading ────────────────────────────────────────────────── */}
          {isLoading && <PageSkeleton />}

          {/* ── Content ───────────────────────────────────────────────── */}
          {data && (
            <div className="space-y-8">

              {/* ── KPI cards ─────────────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                <KpiCard
                  index={0}
                  title="Attempts"
                  value={data.totalAttempts}
                  icon={<Activity size={17} />}
                  accent="text-sky-400"
                  iconBg="bg-sky-500/15"
                  ring="ring-sky-500/30"
                  glow="bg-sky-500/10"
                  border="border-sky-500/20"
                />
                <KpiCard
                  index={1}
                  title="Avg Score"
                  value={`${data.avgScore}%`}
                  icon={<Target size={17} />}
                  accent="text-emerald-400"
                  iconBg="bg-emerald-500/15"
                  ring="ring-emerald-500/30"
                  glow="bg-emerald-500/10"
                  border="border-emerald-500/20"
                />
                <KpiCard
                  index={2}
                  title="Suspicious"
                  value={data.suspiciousCount}
                  icon={<AlertTriangle size={17} />}
                  accent="text-red-400"
                  iconBg="bg-red-500/15"
                  ring="ring-red-500/30"
                  glow="bg-red-500/10"
                  border="border-red-500/20"
                  badge={data.suspiciousCount > 0 ? "!" : undefined}
                  badgeClass="bg-red-500/15 text-red-400 ring-red-500/30"
                />
                <KpiCard
                  index={3}
                  title="Trend"
                  value="+12%"
                  icon={<TrendingUp size={17} />}
                  accent="text-violet-400"
                  iconBg="bg-violet-500/15"
                  ring="ring-violet-500/30"
                  glow="bg-violet-500/10"
                  border="border-violet-500/20"
                  badge="↑"
                  badgeClass="bg-violet-500/15 text-violet-400 ring-violet-500/30"
                />
              </div>

              {/* ── Charts row ────────────────────────────────────────── */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                {/* Bar chart */}
                <motion.div
                  variants={makeFadeUp(4)}
                  initial="hidden"
                  animate="show"
                  className="shimmer-border overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] backdrop-blur-xl lg:col-span-2"
                >
                  <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 ring-1 ring-sky-500/30">
                        <BarChart3 size={14} className="text-sky-400" />
                      </div>
                      <div>
                        <p className="font-display text-sm font-bold text-white">Attempts per Quiz</p>
                        <p className="text-[11px] text-slate-500">All time</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-slate-500">
                      {data.attemptsPerQuiz?.length ?? 0} quizzes
                    </span>
                  </div>
                  <div className="h-[260px] p-4 sm:h-[320px]">
                    <AttemptsBarChart data={data.attemptsPerQuiz} />
                  </div>
                </motion.div>

                {/* Pie chart */}
                <motion.div
                  variants={makeFadeUp(5)}
                  initial="hidden"
                  animate="show"
                  className="shimmer-border overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3 border-b border-white/8 px-6 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 ring-1 ring-violet-500/30">
                      <PieChart size={14} className="text-violet-400" />
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold text-white">Score Distribution</p>
                      <p className="text-[11px] text-slate-500">By score bucket</p>
                    </div>
                  </div>
                  <div className="h-[260px] p-4 sm:h-[320px]">
                    <IncreaseSizePieChart data={data.scoreBuckets} />
                  </div>
                </motion.div>
              </div>

              {/* ── Insights ──────────────────────────────────────────── */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InsightCard
                  index={6}
                  title="Performance Insight"
                  text="Your average score is improving. Focus on consistency to push above 80%."
                  icon={<Lightbulb size={17} />}
                />
                <InsightCard
                  index={7}
                  title="Risk Alert"
                  text={`${data.suspiciousCount} suspicious attempt${data.suspiciousCount !== 1 ? "s" : ""} detected. Review flagged users immediately.`}
                  icon={<ShieldAlert size={17} />}
                  danger
                />
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}