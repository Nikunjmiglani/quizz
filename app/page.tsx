"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, type Variants, type Transition } from "framer-motion";
import { Brain, Trophy, Zap, ArrowRight, Sparkles, ChevronDown, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Feature {
  icon: React.ElementType;
  label: string;
  desc: string;
  iconClass: string;
  ringClass: string;
  bgClass: string;
  borderClass: string;
}

interface Stat {
  value: string;
  label: string;
}

interface Step {
  step: string;
  title: string;
  desc: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const features: Feature[] = [
  {
    icon: Brain,
    label: "Smart Quizzes",
    desc: "Carefully structured quizzes with real-time scoring and performance tracking built in.",
    iconClass: "text-sky-400",
    ringClass: "ring-sky-500/30",
    bgClass: "bg-sky-500/10 border-sky-500/20",
    borderClass: "hover:border-sky-500/40",
  },
  {
    icon: Trophy,
    label: "Leaderboard",
    desc: "Compete with others and climb rankings based on accuracy, speed, and consistency.",
    iconClass: "text-amber-400",
    ringClass: "ring-amber-500/30",
    bgClass: "bg-amber-500/10 border-amber-500/20",
    borderClass: "hover:border-amber-500/40",
  },
  {
    icon: Zap,
    label: "Anti-Cheat System",
    desc: "Tab-switch detection, time tracking, and a rigorous fair evaluation engine.",
    iconClass: "text-violet-400",
    ringClass: "ring-violet-500/30",
    bgClass: "bg-violet-500/10 border-violet-500/20",
    borderClass: "hover:border-violet-500/40",
  },
];

const stats: Stat[] = [
  { value: "10K+", label: "Active Learners" },
  { value: "500+", label: "Quizzes Created" },
  { value: "99.9%", label: "Uptime" },
  { value: "#1", label: "Quiz Platform" },
];

const steps: Step[] = [
  { step: "01", title: "Pick a Quiz", desc: "Browse hundreds of topics curated by experts and community creators." },
  { step: "02", title: "Compete Live", desc: "Answer fast, score high, and beat the clock under fair conditions." },
  { step: "03", title: "Climb the Ranks", desc: "Watch your position rise on the global leaderboard in real time." },
];

// ─── Animation Helpers ────────────────────────────────────────────────────────

/** Returns Variants for a fade-up entrance with a per-index stagger delay. */
function makeFadeUp(i: number = 0): Variants {
  const t: Transition = {
    duration: 0.65,
    delay: i * 0.12,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };
  return {
    hidden: { opacity: 0, y: 36 },
    show:   { opacity: 1, y: 0, transition: t },
  };
}

/** Returns Variants for a scale-in entrance with a per-index stagger delay. */
function makeScaleIn(i: number = 0): Variants {
  const t: Transition = {
    duration: 0.5,
    delay: i * 0.1,
    type: "spring",
    stiffness: 160,
  };
  return {
    hidden: { opacity: 0, scale: 0.85 },
    show:   { opacity: 1, scale: 1, transition: t },
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const { data: session } = useSession();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 72]);

  const handleBecomeCreator = async () => {
    const res = await fetch("/api/user/become-creator", { method: "POST" });
    if (res.ok) {
      alert("You are now a Creator 🚀");
      window.location.reload();
    }
  };

  return (
    <>
      {/* ── Global font + keyframes ─────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@300;400;500&display=swap');

        .font-display { font-family: 'Bricolage Grotesque', sans-serif; }
        body { font-family: 'DM Sans', sans-serif; }

        /* Shimmer text — amber/orange for hero */
        .text-shimmer {
          background: linear-gradient(90deg, #fbbf24, #f97316, #fb923c, #fbbf24);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        /* Shimmer text — cyan/indigo for section headings */
        .text-shimmer-cyan {
          background: linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 6s linear infinite;
        }
        /* Stat numbers */
        .text-shimmer-stat {
          background: linear-gradient(135deg, #38bdf8, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        /* Floating particle */
        @keyframes floatParticle {
          0%,100% { transform: translateY(0)   scale(1);    opacity: .55; }
          50%      { transform: translateY(-18px) scale(1.2); opacity: 1;   }
        }

        /* Shimmer border */
        .shimmer-border {
          position: relative;
        }
        .shimmer-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(56,189,248,.4),
            rgba(251,191,36,.25),
            rgba(139,92,246,.35),
            rgba(56,189,248,.15)
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        /* Primary button glow on hover */
        .btn-amber-glow:hover {
          box-shadow: 0 0 36px rgba(251,191,36,.4), 0 8px 24px rgba(0,0,0,.35);
        }
        .btn-emerald-glow:hover {
          box-shadow: 0 0 28px rgba(52,211,153,.35);
        }
      `}</style>

      <div className="relative min-h-screen overflow-x-hidden bg-[#030712] text-white antialiased">

        {/* ── Fixed background ────────────────────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
          {/* Top vignette radial */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-5%,rgba(56,189,248,0.08),transparent)]" />
          {/* Orb TL */}
          <div className="absolute -left-48 -top-48 h-[640px] w-[640px] animate-pulse rounded-full bg-sky-500/10 blur-[110px]" style={{ animationDuration: "14s" }} />
          {/* Orb BR */}
          <div className="absolute -bottom-48 -right-48 h-[700px] w-[700px] animate-pulse rounded-full bg-amber-400/8 blur-[130px]" style={{ animationDuration: "18s", animationDelay: "2s" }} />
          {/* Orb center-right */}
          <div className="absolute right-1/4 top-1/2 h-[400px] w-[400px] animate-pulse rounded-full bg-violet-500/8 blur-[90px]" style={{ animationDuration: "22s", animationDelay: "4s" }} />
        </div>

        {/* ── Fixed particles ─────────────────────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {(
            [
              { l: "8%",  t: "12%", c: "bg-sky-400",    s: "h-1 w-1",     dur: "6s",  del: "0s"   },
              { l: "22%", t: "30%", c: "bg-amber-400",  s: "h-[3px] w-[3px]", dur: "8s",  del: "1s"   },
              { l: "37%", t: "62%", c: "bg-violet-400", s: "h-1 w-1",     dur: "7s",  del: "0.5s" },
              { l: "54%", t: "14%", c: "bg-sky-300",    s: "h-[3px] w-[3px]", dur: "9s",  del: "2s"   },
              { l: "70%", t: "44%", c: "bg-amber-300",  s: "h-1 w-1",     dur: "5s",  del: "1.5s" },
              { l: "85%", t: "20%", c: "bg-violet-300", s: "h-[3px] w-[3px]", dur: "10s", del: "0.8s" },
              { l: "92%", t: "67%", c: "bg-sky-400",    s: "h-1 w-1",     dur: "7s",  del: "3s"   },
              { l: "16%", t: "77%", c: "bg-amber-400",  s: "h-[3px] w-[3px]", dur: "6s",  del: "2.5s" },
            ] as const
          ).map((p, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${p.s} ${p.c} shadow-[0_0_6px_currentColor]`}
              style={{
                left: p.l,
                top: p.t,
                animation: `floatParticle ${p.dur} ease-in-out ${p.del} infinite`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">

          {/* ══ HERO ════════════════════════════════════════════════════════ */}
          <motion.section
            ref={heroRef}
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center pb-16 pt-24 text-center"
          >
            {/* Badge */}
            <motion.div
              variants={makeFadeUp(0)} initial="hidden" animate="show"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-300 backdrop-blur-sm"
            >
              <Sparkles size={13} className="text-sky-400" />
              The next-gen quiz platform is here
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={makeFadeUp(1)} initial="hidden" animate="show"
              className="font-display max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            >
              Test Your Knowledge.
              <br />
              <span className="text-shimmer">Beat Everyone.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={makeFadeUp(2)} initial="hidden" animate="show"
              className="mt-7 max-w-lg text-sm font-light leading-relaxed text-slate-400 sm:text-base"
            >
              Take interactive quizzes, track your performance, and climb the leaderboard.
              Built for speed, fairness, and real competition.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={makeFadeUp(3)} initial="hidden" animate="show"
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            >
              <Link
                href="/quizzes"
                className="btn-amber-glow group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-sm font-bold text-black transition-all duration-300 hover:scale-105 sm:text-base"
              >
                Explore Quizzes
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/dashboard"
                className="shimmer-border flex items-center justify-center rounded-2xl bg-white/5 px-8 py-4 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:text-white sm:text-base"
              >
                View Dashboard
              </Link>

              {session?.user?.role === "USER" && (
                <button
                  onClick={handleBecomeCreator}
                  className="flex items-center gap-2 rounded-2xl border border-violet-500/40 bg-violet-500/15 px-8 py-4 text-sm font-semibold text-violet-200 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-violet-400/60 hover:bg-violet-500/25 sm:text-base"
                >
                  <Sparkles size={15} className="text-violet-300" />
                  Become Creator
                </button>
              )}

              {session?.user?.role === "CREATOR" && (
                <Link
                  href="/quiz/create"
                  className="btn-emerald-glow flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-bold text-black transition-all duration-300 hover:scale-105 sm:text-base"
                >
                  <Zap size={16} />
                  Create Quiz
                </Link>
              )}
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={makeFadeUp(4)} initial="hidden" animate="show"
              className="mt-12 flex items-center gap-3 text-sm text-slate-500"
            >
              <div className="flex -space-x-2">
                {(["bg-sky-500", "bg-amber-500", "bg-violet-500", "bg-emerald-500"] as const).map((c, i) => (
                  <div key={i} className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#030712] text-[10px] font-bold text-white ${c}`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
              </div>
              <span>Loved by <strong className="text-slate-300">10,000+</strong> learners</span>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
              className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[11px] uppercase tracking-widest text-slate-600"
            >
              scroll
              <ChevronDown size={13} className="animate-bounce" />
            </motion.div>
          </motion.section>

          {/* ══ STATS BAR ═══════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="py-10"
          >
            <div className="shimmer-border rounded-3xl bg-white/[0.025] p-8 backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    variants={makeScaleIn(i)} initial="hidden" whileInView="show" viewport={{ once: true }}
                  >
                    <p className="font-display text-4xl font-extrabold text-shimmer-stat md:text-5xl">{s.value}</p>
                    <p className="mt-1.5 text-sm font-medium text-slate-500">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ══ FEATURES ════════════════════════════════════════════════════ */}
          <section className="py-24">
            <motion.div
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Why Choose Us</p>
              <h2 className="font-display text-4xl font-extrabold md:text-5xl">
                Built Different.{" "}
                <span className="text-shimmer-cyan">By Design.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                Every feature engineered for competitive learning and maximum engagement.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  variants={makeFadeUp(i)} initial="hidden" whileInView="show" viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className={`shimmer-border relative overflow-hidden rounded-3xl border p-8 backdrop-blur-xl transition-colors duration-300 ${f.bgClass} ${f.borderClass}`}
                >
                  {/* Ambient blob */}
                  <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl ${f.bgClass}`} />

                  {/* Icon */}
                  <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 ring-1 ${f.ringClass} ${f.iconClass}`}>
                    <f.icon size={26} />
                  </div>

                  <h3 className="font-display mb-3 text-xl font-bold text-white">{f.label}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>

                  {/* Bottom hairline */}
                  <div className="absolute bottom-0 left-8 right-8 h-px opacity-30 bg-gradient-to-r from-transparent via-current to-transparent" />
                </motion.div>
              ))}
            </div>
          </section>

          {/* ══ HOW IT WORKS ════════════════════════════════════════════════ */}
          <section className="py-24">
            <motion.div
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Simple Process</p>
              <h2 className="font-display text-4xl font-extrabold md:text-5xl">
                Three Steps.{" "}
                <span className="text-shimmer">Infinite Growth.</span>
              </h2>
            </motion.div>

            <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
              {/* Connector line */}
              <div className="pointer-events-none absolute left-1/2 top-10 hidden h-px w-[55%] -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent md:block" />

              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  variants={makeFadeUp(i)} initial="hidden" whileInView="show" viewport={{ once: true }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="shimmer-border relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 backdrop-blur-sm">
                    <span className="font-display text-xl font-black text-shimmer-cyan">{s.step}</span>
                    <div
                      className="absolute inset-0 animate-ping rounded-full bg-sky-500/10"
                      style={{ animationDuration: `${3 + i * 0.8}s` }}
                    />
                  </div>
                  <h3 className="font-display mb-2 text-xl font-bold">{s.title}</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-slate-400">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ══ CTA BANNER ══════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="mb-8 py-24"
          >
            <div className="shimmer-border relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500/8 via-transparent to-amber-500/8 px-8 py-20 text-center backdrop-blur-xl">
              {/* Inner glow */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl" />

              <motion.div
                initial={{ scale: 0.92, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                className="relative z-10"
              >
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Join Thousands</p>
                <h2 className="font-display mb-4 text-4xl font-extrabold md:text-6xl">Ready to Start?</h2>
                <p className="mx-auto mb-10 max-w-sm leading-relaxed text-slate-400">
                  Jump into quizzes and see how you rank against the world's best.
                </p>
                <Link
                  href="/quizzes"
                  className="btn-amber-glow group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-10 py-5 text-base font-bold text-black transition-all duration-300 hover:scale-105"
                >
                  Start Now
                  <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </motion.div>
            </div>
          </motion.section>

        </div>
      </div>
    </>
  );
}