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
  glowClass: string;
}

interface Stat {
  value: string;
  label: string;
}

interface Step {
  step: string;
  title: string;
  desc: string;
  accent: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const features: Feature[] = [
  {
    icon: Brain,
    label: "Smart Quizzes",
    desc: "Carefully structured quizzes with real-time scoring and performance tracking built in.",
    iconClass: "text-sky-600",
    ringClass: "ring-sky-400/40",
    bgClass: "bg-sky-50 border-sky-200",
    borderClass: "hover:border-sky-400",
    glowClass: "bg-sky-200/60",
  },
  {
    icon: Trophy,
    label: "Leaderboard",
    desc: "Compete with others and climb rankings based on accuracy, speed, and consistency.",
    iconClass: "text-amber-600",
    ringClass: "ring-amber-400/40",
    bgClass: "bg-amber-50 border-amber-200",
    borderClass: "hover:border-amber-400",
    glowClass: "bg-amber-200/60",
  },
  {
    icon: Zap,
    label: "Anti-Cheat System",
    desc: "Tab-switch detection, time tracking, and a rigorous fair evaluation engine.",
    iconClass: "text-rose-600",
    ringClass: "ring-rose-400/40",
    bgClass: "bg-rose-50 border-rose-200",
    borderClass: "hover:border-rose-400",
    glowClass: "bg-rose-200/60",
  },
];

const stats: Stat[] = [
  { value: "10K+", label: "Active Learners" },
  { value: "500+", label: "Quizzes Created" },
  { value: "99.9%", label: "Uptime" },
  { value: "#1", label: "Quiz Platform" },
];

const steps: Step[] = [
  { step: "01", title: "Pick a Quiz", desc: "Browse hundreds of topics curated by experts and community creators.", accent: "text-sky-600" },
  { step: "02", title: "Compete Live", desc: "Answer fast, score high, and beat the clock under fair conditions.", accent: "text-amber-600" },
  { step: "03", title: "Climb the Ranks", desc: "Watch your position rise on the global leaderboard in real time.", accent: "text-rose-500" },
];

// ─── Animation Helpers ────────────────────────────────────────────────────────

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:wght@300;400;500;600&display=swap');

        .font-display { font-family: 'Syne', sans-serif; }
        body { font-family: 'Instrument Sans', sans-serif; background: #faf8f4; }

        /* Gradient headline text */
        .text-gradient-hero {
          background: linear-gradient(135deg, #f97316 0%, #ef4444 40%, #ec4899 80%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .text-gradient-section {
          background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .text-gradient-steps {
          background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .text-gradient-stat {
          background: linear-gradient(135deg, #f97316, #ef4444);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Noise overlay for texture */
        .noise-overlay::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          border-radius: inherit;
        }

        /* Mesh gradient background */
        .mesh-bg {
          background-color: #faf8f4;
          background-image:
            radial-gradient(ellipse 80% 50% at 15% 0%, rgba(251,191,36,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 90% 10%, rgba(249,115,22,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 50% 100%, rgba(14,165,233,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 0% 60%, rgba(99,102,241,0.07) 0%, transparent 50%);
        }

        /* Decorative dashed grid */
        .dot-grid {
          background-image: radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* Card glass effect */
        .card-glass {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 4px 24px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.04);
        }
        .card-glass:hover {
          background: rgba(255,255,255,0.85);
          box-shadow: 0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05);
        }

        /* Stat card */
        .stat-card {
          background: white;
          border: 1.5px solid rgba(0,0,0,0.06);
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        /* Primary CTA */
        .btn-primary {
          background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
          box-shadow: 0 4px 18px rgba(249,115,22,0.3), 0 1px 4px rgba(0,0,0,0.1);
          transition: all 0.25s ease;
        }
        .btn-primary:hover {
          box-shadow: 0 8px 32px rgba(249,115,22,0.45), 0 4px 12px rgba(0,0,0,0.12);
          transform: translateY(-2px) scale(1.02);
        }

        /* Secondary CTA */
        .btn-secondary {
          background: white;
          border: 1.5px solid rgba(0,0,0,0.1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          color: #374151;
          transition: all 0.25s ease;
        }
        .btn-secondary:hover {
          border-color: rgba(249,115,22,0.4);
          box-shadow: 0 4px 16px rgba(249,115,22,0.15);
          transform: translateY(-1px);
        }

        /* Floating particles */
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) rotate(0deg);   opacity: 0.4; }
          50%       { transform: translateY(-20px) rotate(8deg); opacity: 0.9; }
        }

        /* Marquee badge  */
        .badge-pill {
          background: white;
          border: 1.5px solid rgba(249,115,22,0.25);
          color: #9a3412;
          box-shadow: 0 2px 10px rgba(249,115,22,0.1);
        }

        /* Step circle */
        .step-circle {
          background: white;
          border: 2px solid rgba(0,0,0,0.08);
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
        }

        /* CTA banner */
        .cta-banner {
          background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 40%, #fce7f3 100%);
          border: 1.5px solid rgba(249,115,22,0.2);
          box-shadow: 0 8px 48px rgba(249,115,22,0.12), 0 2px 12px rgba(0,0,0,0.05);
        }

        /* Avatar ring */
        .avatar-ring {
          border: 2.5px solid #faf8f4;
          box-shadow: 0 0 0 1.5px rgba(249,115,22,0.25);
        }

        /* Section label */
        .section-label {
          background: rgba(249,115,22,0.08);
          border: 1px solid rgba(249,115,22,0.2);
          color: #c2410c;
        }
        .section-label-blue {
          background: rgba(14,165,233,0.08);
          border: 1px solid rgba(14,165,233,0.2);
          color: #0369a1;
        }
        .section-label-amber {
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.25);
          color: #b45309;
        }

        /* Scroll indicator */
        .scroll-pill {
          background: white;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        /* Connector line */
        .connector {
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent);
        }
      `}</style>

      <div className="relative min-h-screen overflow-x-hidden mesh-bg text-gray-900 antialiased">

        {/* ── Dot grid overlay ──────────────────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 -z-10 dot-grid opacity-60" />

        {/* ── Decorative blobs (fixed, subtle) ─────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-amber-300/20 blur-[100px]" style={{ animation: "pulse 16s ease-in-out infinite" }} />
          <div className="absolute -right-32 top-1/4 h-[420px] w-[420px] rounded-full bg-orange-300/15 blur-[90px]" style={{ animation: "pulse 20s ease-in-out 2s infinite" }} />
          <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-sky-300/15 blur-[80px]" style={{ animation: "pulse 14s ease-in-out 4s infinite" }} />
        </div>

        {/* ── Floating geometric shapes ─────────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {[
            { l: "5%",  t: "8%",  size: 12, color: "#f97316", dur: "7s",  del: "0s",   shape: "rounded-md rotate-12"     },
            { l: "92%", t: "15%", size: 8,  color: "#0ea5e9", dur: "9s",  del: "1s",   shape: "rounded-full"              },
            { l: "20%", t: "72%", size: 10, color: "#f59e0b", dur: "6s",  del: "0.5s", shape: "rounded-sm rotate-45"      },
            { l: "75%", t: "60%", size: 7,  color: "#ef4444", dur: "11s", del: "2s",   shape: "rounded-full"              },
            { l: "50%", t: "5%",  size: 6,  color: "#6366f1", dur: "8s",  del: "1.5s", shape: "rounded-md -rotate-12"    },
            { l: "85%", t: "80%", size: 9,  color: "#f97316", dur: "10s", del: "3s",   shape: "rounded-sm rotate-30"      },
          ].map((p, i) => (
            <div
              key={i}
              className={`absolute ${p.shape} opacity-40`}
              style={{
                left: p.l,
                top: p.t,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                animation: `floatParticle ${p.dur} ease-in-out ${p.del} infinite`,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}60`,
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
              className="badge-pill mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            >
              <Sparkles size={13} className="text-orange-500" />
              The next-gen quiz platform is here
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-orange-500" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={makeFadeUp(1)} initial="hidden" animate="show"
              className="font-display max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            >
              Test Your Knowledge.
              <br />
              <span className="text-gradient-hero">Beat Everyone.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={makeFadeUp(2)} initial="hidden" animate="show"
              className="mt-7 max-w-lg text-sm font-normal leading-relaxed text-gray-500 sm:text-base"
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
                className="btn-primary group flex items-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold text-white sm:text-base"
              >
                Explore Quizzes
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/dashboard"
                className="btn-secondary flex items-center justify-center rounded-2xl px-8 py-4 text-sm font-semibold sm:text-base"
              >
                View Dashboard
              </Link>

              {session?.user?.role === "USER" && (
                <button
                  onClick={handleBecomeCreator}
                  className="flex items-center gap-2 rounded-2xl border border-violet-300 bg-violet-50 px-8 py-4 text-sm font-semibold text-violet-700 transition-all duration-300 hover:scale-105 hover:border-violet-400 hover:bg-violet-100 sm:text-base"
                >
                  <Sparkles size={15} className="text-violet-500" />
                  Become Creator
                </button>
              )}

              {session?.user?.role === "CREATOR" && (
                <Link
                  href="/quiz/create"
                  className="flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-8 py-4 text-sm font-bold text-emerald-700 transition-all duration-300 hover:scale-105 hover:bg-emerald-100 sm:text-base"
                >
                  <Zap size={16} />
                  Create Quiz
                </Link>
              )}
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={makeFadeUp(4)} initial="hidden" animate="show"
              className="mt-12 flex items-center gap-3 text-sm text-gray-400"
            >
              <div className="flex -space-x-2">
                {(["bg-sky-400", "bg-orange-400", "bg-violet-400", "bg-emerald-400"] as const).map((c, i) => (
                  <div key={i} className={`avatar-ring flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white ${c}`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-gray-500">Loved by <strong className="text-gray-700">10,000+</strong> learners</span>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
              className="scroll-pill absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 rounded-full px-3 py-2 text-[11px] uppercase tracking-widest text-gray-400"
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
            <div className="rounded-3xl bg-white/80 p-8 shadow-[0_4px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl border border-white">
              <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    variants={makeScaleIn(i)} initial="hidden" whileInView="show" viewport={{ once: true }}
                    className="group"
                  >
                    <p className="font-display text-4xl font-extrabold text-gradient-stat md:text-5xl">{s.value}</p>
                    <p className="mt-1.5 text-sm font-medium text-gray-400">{s.label}</p>
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
              <span className="section-label-blue mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em]">
                Why Choose Us
              </span>
              <h2 className="font-display mt-3 text-4xl font-extrabold text-gray-900 md:text-5xl">
                Built Different.{" "}
                <span className="text-gradient-section">By Design.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-500">
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
                  className={`card-glass relative overflow-hidden rounded-3xl border p-8 transition-all duration-300 cursor-default ${f.bgClass} ${f.borderClass}`}
                >
                  {/* Ambient blob */}
                  <div className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-2xl ${f.glowClass}`} />

                  {/* Icon */}
                  <div className={`relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white ring-2 ${f.ringClass} shadow-sm ${f.iconClass}`}>
                    <f.icon size={26} />
                  </div>

                  <h3 className="font-display mb-3 text-xl font-bold text-gray-800">{f.label}</h3>
                  <p className="relative text-sm leading-relaxed text-gray-500">{f.desc}</p>
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
              <span className="section-label-amber mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em]">
                Simple Process
              </span>
              <h2 className="font-display mt-3 text-4xl font-extrabold text-gray-900 md:text-5xl">
                Three Steps.{" "}
                <span className="text-gradient-steps">Infinite Growth.</span>
              </h2>
            </motion.div>

            <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
              {/* Connector line */}
              <div className="connector pointer-events-none absolute left-1/2 top-10 hidden h-px w-[55%] -translate-x-1/2 md:block" />

              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  variants={makeFadeUp(i)} initial="hidden" whileInView="show" viewport={{ once: true }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="step-circle relative mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                    <span className={`font-display text-2xl font-black ${s.accent}`}>{s.step}</span>
                    <div
                      className="absolute inset-0 animate-ping rounded-full bg-orange-400/10"
                      style={{ animationDuration: `${3 + i * 0.8}s` }}
                    />
                  </div>
                  <h3 className="font-display mb-2 text-xl font-bold text-gray-800">{s.title}</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-gray-500">{s.desc}</p>
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
            <div className="cta-banner relative overflow-hidden rounded-3xl px-8 py-20 text-center">
              {/* Decorative inner glow */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300/20 blur-3xl" />
              {/* Top-left accent */}
              <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-amber-300/30 blur-2xl" />
              {/* Bottom-right accent */}
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-pink-300/25 blur-2xl" />

              <motion.div
                initial={{ scale: 0.92, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                className="relative z-10"
              >
                <span className="section-label mb-5 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em]">
                  Join Thousands
                </span>
                <h2 className="font-display mb-4 mt-3 text-4xl font-extrabold text-gray-900 md:text-6xl">Ready to Start?</h2>
                <p className="mx-auto mb-10 max-w-sm text-sm leading-relaxed text-gray-500">
                  Jump into quizzes and see how you rank against the world's best.
                </p>
                <Link
                  href="/quizzes"
                  className="btn-primary group inline-flex items-center gap-3 rounded-2xl px-10 py-5 text-base font-bold text-white"
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