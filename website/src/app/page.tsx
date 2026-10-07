"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, LayoutGroup } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { TerminalTypingIntro } from "@/components/TerminalTypingIntro";
import { Footer } from "@/components/Footer";
import { ArrowRight, BookOpen, Terminal, Code2, Layers, Quote, ExternalLink } from "lucide-react";

export default function HomePage() {
  const [isLanding, setIsLanding] = useState(false);

  const handleIntroComplete = () => {
    setIsLanding(true);
  };

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-[#050508] text-zinc-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">
        {/* Lightweight background ambient glow */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-transparent blur-[100px] rounded-full" />
        </div>

        {/* FULLSCREEN SPLASH STAGE (CENTERED COMPACT TERMINAL) */}
        {!isLanding ? (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030305] px-6 select-none">
            <div className="w-full max-w-xl text-center">
              <TerminalTypingIntro
                isLanding={false}
                onIntroComplete={handleIntroComplete}
              />

              {/* Skip prompt */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={() => setIsLanding(true)}
                className="mt-8 inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-purple-400 transition-colors cursor-pointer group"
              >
                <span>Click to skip intro</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        ) : (
          <>
            <Navbar />

            <main className="relative z-10 flex-1">
              {/* HERO SECTION */}
              <section className="pt-12 pb-16 px-6 max-w-7xl mx-auto text-center">
                {/* MAIN AESTHETIC PURPLE TITLE */}
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl sm:text-6xl md:text-6xl font-extrabold tracking-tight text-white leading-none max-w-4xl mx-auto"
                >
                  Probabilistic Time-Series Forecasting with{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(168,85,247,0.6)]">
                    engressionTS
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6 text-base sm:text-xl text-zinc-400 font-normal max-w-3xl mx-auto leading-relaxed"
                >
                  {/* Unifying state-of-the-art neural forecasting models from{" "}
                  <strong className="text-zinc-200">Darts</strong> with{" "}
                  <strong className="text-purple-300">Engression</strong> for calibrated, sample-based uncertainty quantification. */}
                </motion.p>

                {/* QUICK LINKS ACTION BUTTON BAR */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8 flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto"
                >
                  <Link
                    href="/docs/overview"
                    className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Explore Docs</span>
                  </Link>

                  <Link
                    href="/docs/installation"
                    className="flex items-center space-x-2 rounded-xl border border-zinc-800 bg-zinc-950/90 px-5 py-3 text-xs font-bold text-zinc-300 hover:border-purple-500/50 hover:bg-zinc-900 hover:text-white transition-all shadow-md"
                  >
                    <Terminal className="w-3.5 h-3.5 text-green-400" />
                    <span>Quickstart</span>
                  </Link>

                  <Link
                    href="/docs/usage"
                    className="flex items-center space-x-2 rounded-xl border border-zinc-800 bg-zinc-950/90 px-5 py-3 text-xs font-bold text-zinc-300 hover:border-purple-500/50 hover:bg-zinc-900 hover:text-white transition-all shadow-md"
                  >
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Examples</span>
                  </Link>

                  <Link
                    href="/docs/api-models"
                    className="flex items-center space-x-2 rounded-xl border border-zinc-800 bg-zinc-950/90 px-5 py-3 text-xs font-bold text-zinc-300 hover:border-purple-500/50 hover:bg-zinc-900 hover:text-white transition-all shadow-md"
                  >
                    <Layers className="w-3.5 h-3.5 text-pink-400" />
                    <span>API Models</span>
                  </Link>

                  <Link
                    href="/docs/citation"
                    className="flex items-center space-x-2 rounded-xl border border-zinc-800 bg-zinc-950/90 px-5 py-3 text-xs font-bold text-zinc-300 hover:border-purple-500/50 hover:bg-zinc-900 hover:text-white transition-all shadow-md"
                  >
                    <Quote className="w-3.5 h-3.5 text-purple-400" />
                    <span>Citation</span>
                  </Link>
                </motion.div>

                {/* PyPI PACKAGE LINK BADGE */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.28 }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/30 px-4 py-1.5 text-xs font-mono text-zinc-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                >
                  <span className="text-purple-400 font-semibold">Package link:</span>
                  <a
                    href="https://pypi.org/project/engressionts/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300 hover:text-purple-200 underline flex items-center gap-1 font-mono transition-colors"
                  >
                    <span>https://pypi.org/project/engressionts/</span>
                    <ExternalLink className="w-3 h-3 text-purple-400" />
                  </a>
                </motion.div>

                {/* TERMINAL SLIDING DOWN INTO HERO POSITION BELOW PyPI LINK */}
                <div className="mt-8 max-w-2xl mx-auto">
                  <TerminalTypingIntro isLanding={true} />
                </div>
              </section>
            </main>

            <Footer />
          </>
        )}
      </div>
    </LayoutGroup>
  );
}
