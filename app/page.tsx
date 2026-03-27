"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Brain, Trophy, Zap, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-[-200px] w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[400px] h-[400px] bg-yellow-400/20 rounded-full blur-3xl" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* HERO */}
        <section className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center text-center pt-20">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
          >
            Test Your Knowledge.
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Beat Everyone.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-gray-400 max-w-xl text-sm sm:text-base"
          >
            Take interactive quizzes, track your performance, and climb the leaderboard.
            Built for speed, fairness, and real competition.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/quizzes"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-full transition hover:scale-105"
            >
              Explore Quizzes
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center justify-center px-6 py-3 border border-white/20 rounded-full hover:bg-white/10 transition"
            >
              View Dashboard
            </Link>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="py-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why This Platform?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl"
            >
              <Brain className="text-yellow-400 mb-4" size={28} />
              <h3 className="text-xl font-semibold">Smart Quizzes</h3>
              <p className="text-gray-400 mt-2 text-sm">
                Carefully structured quizzes with real-time scoring and tracking.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl"
            >
              <Trophy className="text-green-400 mb-4" size={28} />
              <h3 className="text-xl font-semibold">Leaderboard</h3>
              <p className="text-gray-400 mt-2 text-sm">
                Compete with others and climb rankings based on performance.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl"
            >
              <Zap className="text-purple-400 mb-4" size={28} />
              <h3 className="text-xl font-semibold">Anti-Cheat System</h3>
              <p className="text-gray-400 mt-2 text-sm">
                Tab switch detection, time tracking, and fair evaluation system.
              </p>
            </motion.div>

          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-24">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start?
          </h2>
          <p className="text-gray-400 mb-6">
            Jump into quizzes and see how you rank.
          </p>

          <Link
            href="/quizzes"
            className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-full transition hover:scale-105"
          >
            Start Now
            <ArrowRight size={18} />
          </Link>
        </section>

      </div>
    </div>
  )
}