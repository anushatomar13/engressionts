"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-12 px-6 text-zinc-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white tracking-wide">engressionts</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">Probabilistic Time-Series Forecasting</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-zinc-400">
          <Link href="/docs/overview" className="hover:text-purple-400 transition-colors">
            Overview
          </Link>
          <Link href="/docs/installation" className="hover:text-purple-400 transition-colors">
            Installation
          </Link>
          <Link href="/docs/usage" className="hover:text-purple-400 transition-colors">
            Usage
          </Link>
          <Link href="/docs/api-models" className="hover:text-purple-400 transition-colors">
            API Models
          </Link>
          <Link href="/docs/citation" className="hover:text-purple-400 transition-colors">
            Citation
          </Link>
          <a
            href="https://github.com/anushatomar13/engressionts"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 hover:text-purple-400 transition-colors text-purple-400"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>

        <div className="text-zinc-500 text-[11px]">
          © 2026 Anusha Tomar. Released under MIT License.
        </div>
      </div>
    </footer>
  );
};
