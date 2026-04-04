"use client";

import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
  type Transition,
} from "framer-motion";
import {
  Brain,
  Trophy,
  Zap,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Star,
  LayoutDashboard,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef } from "react";

interface Feature {
  icon: React.ElementType;
  label: string;
  desc: string;
  iconClass: string;
  ringClass: string;
  cardClass: string;
  glowClass: string;
}

interface Stat   { value: string; label: string }
interface Step   { step: string; title: string; desc: string; accent: string }
interface FloatingShape {
  left: string; top: string; size: number; color: string;
  dur: string; del: string; shape: string;
}

const features: Feature[] = [
  {
    icon: Brain, label: "Smart Quizzes",
    desc: "Carefully structured quizzes with real-time scoring and performance tracking built in.",
    iconClass: "text-sky-600", ringClass: "ring-sky-400/40",
    cardClass: "bg-sky-50 border-sky-200 hover:border-sky-400", glowClass: "bg-sky-200/60",
  },
  {
    icon: Trophy, label: "Leaderboard",
    desc: "Compete with others and climb rankings based on accuracy, speed, and consistency.",
    iconClass: "text-amber-600", ringClass: "ring-amber-400/40",
    cardClass: "bg-amber-50 border-amber-200 hover:border-amber-400", glowClass: "bg-amber-200/60",
  },
  {
    icon: Zap, label: "Anti-Cheat System",
    desc: "Tab-switch detection, time tracking, and a rigorous fair evaluation engine.",
    iconClass: "text-rose-600", ringClass: "ring-rose-400/40",
    cardClass: "bg-rose-50 border-rose-200 hover:border-rose-400", glowClass: "bg-rose-200/60",
  },
];

const stats: Stat[] = [
  { value: "50+",   label: "Active Learners" },
  { value: "10+",   label: "Quizzes Created" },
  { value: "99.9%", label: "Uptime"          },
  { value: "#1",    label: "Quiz Platform"   },
];

const steps: Step[] = [
  { step: "01", title: "Pick a Quiz",     desc: "Browse hundreds of topics curated by experts and community creators.", accent: "text-sky-600"   },
  { step: "02", title: "Compete Live",    desc: "Answer fast, score high, and beat the clock under fair conditions.",  accent: "text-amber-600" },
  { step: "03", title: "Climb the Ranks", desc: "Watch your position rise on the global leaderboard in real time.",    accent: "text-rose-500"  },
];

const floatingShapes: FloatingShape[] = [
  { left: "5%",  top: "8%",  size: 12, color: "#f97316", dur: "7s",  del: "0s",   shape: "rounded-md rotate-12"  },
  { left: "92%", top: "15%", size: 8,  color: "#0ea5e9", dur: "9s",  del: "1s",   shape: "rounded-full"          },
  { left: "20%", top: "72%", size: 10, color: "#f59e0b", dur: "6s",  del: "0.5s", shape: "rounded-sm rotate-45"  },
  { left: "75%", top: "60%", size: 7,  color: "#ef4444", dur: "11s", del: "2s",   shape: "rounded-full"          },
  { left: "50%", top: "5%",  size: 6,  color: "#6366f1", dur: "8s",  del: "1.5s", shape: "rounded-md -rotate-12" },
  { left: "85%", top: "80%", size: 9,  color: "#f97316", dur: "10s", del: "3s",   shape: "rounded-sm rotate-12"  },
];

const avatarColors = ["bg-sky-400", "bg-orange-400", "bg-violet-400", "bg-emerald-400"] as const;

function makeFadeUp(i = 0): Variants {
  const t: Transition = {
    duration: 0.65, delay: i * 0.12,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };
  return { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: t } };
}

function makeScaleIn(i = 0): Variants {
  const t: Transition = { duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 160 };
  return { hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1, transition: t } };
}

export default function Home() {
  const { data: session } = useSession();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 1],    [0, 72]);

  const handleBecomeCreator = async () => {
    const res = await fetch("/api/user/become-creator", { method: "POST" });
    if (res.ok) { alert("You are now a Creator 🚀"); window.location.reload(); }
  };

  const isCreator = session?.user?.role === "CREATOR";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Instrument+Sans:wght@300;400;500;600&display=swap');
        @keyframes floatShape {
          0%,100% { transform: translateY(0) rotate(0deg);     opacity: .4; }
          50%      { transform: translateY(-20px) rotate(8deg); opacity: .9; }
        }
      `}</style>

      <div
        className="relative min-h-screen overflow-x-hidden text-gray-900 antialiased"
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          backgroundColor: "#faf8f4",
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 15% 0%,   rgba(251,191,36,.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 90% 10%,  rgba(249,115,22,.12) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 50% 100%, rgba(14,165,233,.1)  0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 0%  60%,  rgba(99,102,241,.07) 0%, transparent 50%)
          `,
        }}
      >
        {/* Dot grid */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 opacity-60"
          style={{
            backgroundImage: "radial-gradient(circle,rgba(0,0,0,.07) 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Blobs */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] animate-pulse rounded-full bg-amber-300/20 blur-[100px]" style={{ animationDuration: "16s" }} />
          <div className="absolute -right-32 top-1/4 h-[420px] w-[420px] animate-pulse rounded-full bg-orange-300/[.15] blur-[90px]" style={{ animationDuration: "20s", animationDelay: "2s" }} />
          <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] animate-pulse rounded-full bg-sky-300/[.15] blur-[80px]" style={{ animationDuration: "14s", animationDelay: "4s" }} />
        </div>

        {/* Floating shapes — hidden on mobile */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden hidden sm:block">
          {floatingShapes.map((p, i) => (
            <div
              key={i}
              className={`absolute opacity-40 ${p.shape}`}
              style={{
                left: p.left, top: p.top,
                width: p.size, height: p.size,
                backgroundColor: p.color,
                animation: `floatShape ${p.dur} ease-in-out ${p.del} infinite`,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}60`,
              }}
            />
          ))}
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 lg:px-16">

          {/* ════════ HERO ════════════════════════════════════════════════ */}
          <motion.section
            ref={heroRef}
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative flex min-h-[calc(100dvh-72px)] flex-col items-center justify-center pb-12 pt-16 text-center sm:pt-24"
          >
            {/* Headline */}
            <motion.h1
              variants={makeFadeUp(1)} initial="hidden" animate="show"
              className="max-w-4xl text-[2.5rem] font-extrabold leading-[1.08] tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:text-[5.5rem]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Test Your Knowledge.
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg,#f97316 0%,#ef4444 40%,#ec4899 80%)" }}
              >
                Beat Everyone.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={makeFadeUp(2)} initial="hidden" animate="show"
              className="mt-5 max-w-sm px-1 text-sm leading-relaxed text-gray-500 sm:max-w-lg sm:px-0 sm:text-base"
            >
              Take interactive quizzes, track your performance, and climb the leaderboard.
              Built for speed, fairness, and real competition.
            </motion.p>

            {/* CTAs — stacked on mobile, row on sm+ */}
            <motion.div
              variants={makeFadeUp(3)} initial="hidden" animate="show"
              className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4"
            >
              <Link
                href="/quizzes"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] sm:w-auto sm:text-base"
                style={{
                  background: "linear-gradient(135deg,#f97316,#ef4444)",
                  boxShadow: "0 4px 18px rgba(249,115,22,.3),0 1px 4px rgba(0,0,0,.1)",
                }}
              >
                Explore Quizzes
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/dashboard"
                className="flex w-full items-center justify-center rounded-2xl border border-black/10 bg-white px-8 py-4 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/40 hover:shadow-[0_4px_16px_rgba(249,115,22,.15)] sm:w-auto sm:text-base"
              >
                View Dashboard
              </Link>

              {session?.user?.role === "USER" && (
                <button
                  onClick={handleBecomeCreator}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-300 bg-violet-50 px-8 py-4 text-sm font-semibold text-violet-700 transition-all duration-300 hover:scale-105 hover:border-violet-400 hover:bg-violet-100 sm:w-auto sm:text-base"
                >
                  <Sparkles size={15} className="text-violet-500" />
                  Become Creator
                </button>
              )}

              {isCreator && (
                <>
                  <Link
                    href="/quiz/create"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-8 py-4 text-sm font-bold text-emerald-700 transition-all duration-300 hover:scale-105 hover:bg-emerald-100 sm:w-auto sm:text-base"
                  >
                    <Zap size={16} />
                    Create Quiz
                  </Link>

                  <Link
                    href="/creator/dashboard"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] sm:w-auto sm:text-base"
                    style={{
                      background: "linear-gradient(135deg,#7c3aed,#6366f1)",
                      boxShadow: "0 4px 18px rgba(124,58,237,.28),0 1px 4px rgba(0,0,0,.1)",
                    }}
                  >
                    <LayoutDashboard size={16} />
                    Creator Dashboard
                  </Link>
                </>
              )}
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={makeFadeUp(4)} initial="hidden" animate="show"
              className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm"
            >
              <div className="flex -space-x-2">
                {avatarColors.map((c, i) => (
                  <div
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white ${c}`}
                    style={{ border: "2.5px solid #faf8f4", boxShadow: "0 0 0 1.5px rgba(249,115,22,.25)" }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-gray-500">
                Loved by <strong className="text-gray-700">learners</strong>
              </span>
            </motion.div>

            {/* Scroll pill — hidden on mobile (no room) */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
              className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 rounded-full border border-black/[.08] bg-white px-3 py-2 text-[11px] uppercase tracking-widest text-gray-400 shadow-sm sm:flex"
            >
              scroll
              <ChevronDown size={13} className="animate-bounce" />
            </motion.div>
          </motion.section>

          {/* ════════ STATS ═══════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="py-8 sm:py-10"
          >
            <div className="rounded-3xl border border-white bg-white/80 p-6 shadow-[0_4px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-8">
              <div className="grid grid-cols-2 gap-6 text-center sm:gap-8 md:grid-cols-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    variants={makeScaleIn(i)} initial="hidden" whileInView="show" viewport={{ once: true }}
                  >
                    <p
                      className="text-3xl font-extrabold bg-clip-text text-transparent sm:text-4xl md:text-5xl"
                      style={{ fontFamily: "'Syne', sans-serif", backgroundImage: "linear-gradient(135deg,#f97316,#ef4444)" }}
                    >
                      {s.value}
                    </p>
                    <p className="mt-1.5 text-xs font-medium text-gray-400 sm:text-sm">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ════════ FEATURES ════════════════════════════════════════════ */}
          <section className="py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="mb-10 text-center sm:mb-16"
            >
              <span className="mb-4 inline-block rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[.15em] text-sky-700">
                Why Choose Us
              </span>
              <h2
                className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Built Different.{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#0ea5e9,#6366f1)" }}
                >
                  By Design.
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-sm px-4 text-sm leading-relaxed text-gray-500 sm:max-w-md sm:px-0">
                Every feature engineered for competitive learning and maximum engagement.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  variants={makeFadeUp(i)} initial="hidden" whileInView="show" viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className={`relative cursor-default overflow-hidden rounded-3xl border p-6 backdrop-blur-xl transition-all duration-300 sm:p-8 ${f.cardClass}`}
                  style={{ background: "rgba(255,255,255,.7)", boxShadow: "0 4px 24px rgba(0,0,0,.05),0 1px 4px rgba(0,0,0,.04)" }}
                >
                  <div className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-2xl ${f.glowClass}`} />
                  <div className={`relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white ring-2 shadow-sm sm:mb-6 sm:h-14 sm:w-14 ${f.ringClass} ${f.iconClass}`}>
                    <f.icon size={22} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-800 sm:mb-3 sm:text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {f.label}
                  </h3>
                  <p className="relative text-sm leading-relaxed text-gray-500">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ════════ HOW IT WORKS ════════════════════════════════════════ */}
          <section className="py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="mb-10 text-center sm:mb-16"
            >
              <span className="mb-4 inline-block rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[.15em] text-amber-700">
                Simple Process
              </span>
              <h2
                className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Three Steps.{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#f59e0b,#f97316)" }}
                >
                  Infinite Growth.
                </span>
              </h2>
            </motion.div>

            <div className="relative grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-3 md:gap-8">
              {/* Connector line — desktop only */}
              <div
                className="pointer-events-none absolute left-1/2 top-10 hidden h-px w-[55%] -translate-x-1/2 md:block"
                style={{ background: "linear-gradient(90deg,transparent,rgba(249,115,22,.3),transparent)" }}
              />

              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  variants={makeFadeUp(i)} initial="hidden" whileInView="show" viewport={{ once: true }}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white sm:mb-6 sm:h-20 sm:w-20"
                    style={{ border: "2px solid rgba(0,0,0,.08)", boxShadow: "0 4px 20px rgba(0,0,0,.07)" }}
                  >
                    <span
                      className={`text-xl font-black sm:text-2xl ${s.accent}`}
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {s.step}
                    </span>
                    <div
                      className="absolute inset-0 animate-ping rounded-full bg-orange-400/10"
                      style={{ animationDuration: `${3 + i * 0.8}s` }}
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-800 sm:text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {s.title}
                  </h3>
                  <p className="max-w-xs text-sm leading-relaxed text-gray-500">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ════════ CTA BANNER ══════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="mb-8 py-16 sm:py-24"
          >
            <div
              className="relative overflow-hidden rounded-3xl px-5 py-14 text-center sm:px-8 sm:py-20"
              style={{
                background: "linear-gradient(135deg,#fff7ed 0%,#fef3c7 40%,#fce7f3 100%)",
                border: "1.5px solid rgba(249,115,22,.2)",
                boxShadow: "0 8px 48px rgba(249,115,22,.12),0 2px 12px rgba(0,0,0,.05)",
              }}
            >
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300/20 blur-3xl" />
              <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-amber-300/30 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-pink-300/25 blur-2xl" />

              <motion.div
                initial={{ scale: 0.92, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                className="relative z-10"
              >
                <span className="mb-5 inline-block rounded-full border border-orange-200 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[.15em] text-orange-700">
                  Join Thousands
                </span>
                <h2
                  className="mb-4 mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-6xl"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Ready to Start?
                </h2>
                <p className="mx-auto mb-8 max-w-xs px-2 text-sm leading-relaxed text-gray-500 sm:mb-10 sm:max-w-sm sm:px-0">
                  Jump into quizzes and see how you rank against the world&apos;s best.
                </p>

                {/* CTA buttons — stacked on mobile */}
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
                  <Link
                    href="/quizzes"
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl px-10 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] sm:w-auto sm:py-5 sm:text-base"
                    style={{
                      background: "linear-gradient(135deg,#f97316,#ef4444)",
                      boxShadow: "0 4px 18px rgba(249,115,22,.3),0 1px 4px rgba(0,0,0,.1)",
                    }}
                  >
                    Start Now
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </Link>

                  {isCreator && (
                    <Link
                      href="/creator/dashboard"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl px-10 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] sm:w-auto sm:py-5 sm:text-base"
                      style={{
                        background: "linear-gradient(135deg,#7c3aed,#6366f1)",
                        boxShadow: "0 4px 18px rgba(124,58,237,.28),0 1px 4px rgba(0,0,0,.1)",
                      }}
                    >
                      <LayoutDashboard size={17} />
                      Creator Dashboard
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.section>

        </div>
      </div>
    </>
  );
}