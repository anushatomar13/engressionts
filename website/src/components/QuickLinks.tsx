"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Terminal, Code2, Quote, ArrowRight } from "lucide-react";

export const QUICK_LINKS = [
  {
    title: "Quickstart",
    description: "Install via PyPI or source and set up Python dependencies in seconds.",
    href: "/docs/installation",
    icon: Terminal,
    color: "from-purple-500 to-indigo-600",
    glow: "hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]",
    badge: "Installation"
  },
  {
    title: "Examples",
    description: "Train EnTFTModel on multivariate data and evaluate with Energy Score.",
    href: "/docs/usage",
    icon: Code2,
    color: "from-emerald-500 to-teal-600",
    glow: "hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]",
    badge: "Usage"
  },
  {
    title: "API Reference",
    description: "Explore 11 neural architectures, metrics, loss functions, & noise models.",
    href: "/docs/api-models",
    icon: BookOpen,
    color: "from-cyan-500 to-blue-600",
    glow: "hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]",
    badge: "API Specs"
  },
  {
    title: "Citation",
    description: "BibTeX citation for engressionts research paper published at AAAI 2026.",
    href: "/docs/citation",
    icon: Quote,
    color: "from-pink-500 to-rose-600",
    glow: "hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]",
    badge: "BibTeX"
  }
];

export const QuickLinks: React.FC = () => {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-zinc-900">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <h2 className="text-xs uppercase font-mono tracking-widest text-purple-400 mb-2">Navigation Shortcuts</h2>
          <h3 className="text-2xl md:text-3xl font-bold text-white">Quick Links to Documentation</h3>
        </div>
        <p className="text-sm text-zinc-400 mt-2 md:mt-0">
          Jump straight into setup guides, model APIs, or code examples.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {QUICK_LINKS.map((link, idx) => {
          const Icon = link.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.15 } }}
            >
              <Link
                href={link.href}
                className={`group relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/90 p-6 transition-all ${link.glow}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${link.color} text-white shadow-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400">
                      {link.badge}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                    {link.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">{link.description}</p>
                </div>

                <div className="flex items-center text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                  <span>Explore {link.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
