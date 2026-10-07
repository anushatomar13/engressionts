"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, BookOpen, Cpu, FileText, Bookmark, Menu, X } from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-[0_0_20px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xl font-extrabold tracking-tight text-white group-hover:text-purple-300 transition-colors">
              engression<span className="text-purple-400">ts</span>
            </span>
            {/* <span className="text-[10px] uppercase font-mono tracking-widest text-purple-400/80">AAAI 2026</span> */}
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            href="/docs/overview"
            className="flex items-center space-x-2 text-zinc-300 hover:text-purple-400 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Docs</span>
          </Link>
          <Link
            href="/docs/installation"
            className="flex items-center space-x-2 text-zinc-300 hover:text-purple-400 transition-colors"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Quickstart</span>
          </Link>
          <Link
            href="/docs/usage"
            className="flex items-center space-x-2 text-zinc-300 hover:text-purple-400 transition-colors"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Examples</span>
          </Link>
          <Link
            href="/docs/api-models"
            className="flex items-center space-x-2 text-zinc-300 hover:text-purple-400 transition-colors"
          >
            <Bookmark className="w-4 h-4 text-pink-400" />
            <span>API Reference</span>
          </Link>
          <Link
            href="/docs/citation"
            className="flex items-center space-x-2 text-zinc-300 hover:text-purple-400 transition-colors"
          >
            <span>Citation</span>
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="https://github.com/anushatomar13/engressionts"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2 text-xs font-semibold text-zinc-200 transition-all hover:border-purple-500/50 hover:bg-purple-950/40 hover:text-purple-200 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            <GithubIcon className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-zinc-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-6 py-4 space-y-4">
          <Link
            href="/docs/overview"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-purple-400 text-sm font-medium"
          >
            Docs Overview
          </Link>
          <Link
            href="/docs/installation"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-purple-400 text-sm font-medium"
          >
            Quickstart
          </Link>
          <Link
            href="/docs/usage"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-purple-400 text-sm font-medium"
          >
            Examples
          </Link>
          <Link
            href="/docs/api-models"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-purple-400 text-sm font-medium"
          >
            API Reference
          </Link>
          <Link
            href="/docs/citation"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-purple-400 text-sm font-medium"
          >
            Citation
          </Link>
          <a
            href="https://github.com/anushatomar13/engressionts"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-purple-400 text-sm font-semibold pt-2"
          >
            <GithubIcon className="h-4 w-4" />
            <span>GitHub Repository</span>
          </a>
        </div>
      )}
    </header>
  );
};
