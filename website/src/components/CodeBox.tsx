"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Terminal } from "lucide-react";

interface CodeBoxProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBox: React.FC<CodeBoxProps> = ({ code, language = "python", title }) => {
  const [copied, setCopied] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 800);
  };

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      animate={
        isClicked
          ? {
              y: -6,
              scale: 1.01,
              boxShadow: "0 0 35px rgba(168, 85, 247, 0.6), 0 0 15px rgba(192, 132, 252, 0.4)",
              borderColor: "rgba(192, 132, 252, 0.9)"
            }
          : {
              y: 0,
              scale: 1,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              borderColor: "rgba(63, 63, 70, 0.5)"
            }
      }
      transition={{ duration: 0.3 }}
      className="relative my-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/90 shadow-2xl backdrop-blur-md cursor-pointer group select-none"
    >
      {/* Code Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-4 py-2.5">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="h-3 w-3 rounded-full bg-green-500/80 inline-block"></span>
          </div>
          <span className="ml-2 font-mono text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            {title || (language ? `${language.toUpperCase()}` : "CODE")}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/50 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-all hover:border-purple-500/50 hover:bg-purple-950/30 hover:text-purple-300 active:scale-95"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-zinc-400 group-hover:text-purple-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="relative overflow-x-auto p-4 font-mono text-sm leading-relaxed text-zinc-200">
        <pre className="selection:bg-purple-500/30 selection:text-purple-200">
          <code>
            {code.split("\n").map((line, idx) => {
              // Basic syntax highlight simulation
              const isComment = line.trim().startsWith("#") || line.trim().startsWith("//");
              const isImport = line.includes("import") || line.includes("from");
              const isClassOrDef = line.includes("class ") || line.includes("def ");
              
              let lineStyle = "text-zinc-300";
              if (isComment) lineStyle = "text-zinc-500 italic";
              else if (isImport) lineStyle = "text-purple-400 font-semibold";
              else if (isClassOrDef) lineStyle = "text-cyan-400 font-semibold";

              return (
                <div key={idx} className="table-row">
                  <span className="table-cell pr-4 select-none text-xs text-zinc-600 text-right">{idx + 1}</span>
                  <span className={`table-cell ${lineStyle}`}>
                    {line}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      {/* Glow highlight hint */}
      <div className="absolute inset-0 pointer-events-none rounded-xl border border-transparent group-hover:border-purple-500/30 transition-all duration-300" />
    </motion.div>
  );
};
