"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import { DOCS_DATA } from "@/data/docsData";
import { CodeBox } from "@/components/CodeBox";
import { InteractivePlayground } from "@/components/InteractivePlayground";
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle, Cpu, Code2, ExternalLink, Calculator } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

// Builtin python types to official docs mapping
const PYTHON_DOC_LINKS: Record<string, string> = {
  float: "https://docs.python.org/3/builtins/functions.html#float",
  int: "https://docs.python.org/3/builtins/functions.html#int",
  str: "https://docs.python.org/3/builtins/stdtypes.html#str",
  bool: "https://docs.python.org/3/builtins/functions.html#bool",
  list: "https://docs.python.org/3/builtins/stdtypes.html#list",
  dict: "https://docs.python.org/3/builtins/stdtypes.html#dict",
  tuple: "https://docs.python.org/3/builtins/stdtypes.html#tuple"
};

import katex from "katex";

function KaTeXMath({ math, displayMode = false }: { math: string; displayMode?: boolean }) {
  try {
    const html = katex.renderToString(math, {
      displayMode,
      throwOnError: false,
    });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  } catch (err) {
    return <span>{math}</span>;
  }
}

function FormattedText({ text, onToggleSource }: { text: string; onToggleSource?: () => void }) {
  if (!text) return null;

  // Split by markdown elements: $$display_math$$, $inline_math$, **bold**, `code`, or [source]
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$.*?\$|\*\*.*?\*\*|`.*?`|\[source\])/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (part === "[source]" && onToggleSource) {
          return (
            <button
              key={index}
              onClick={onToggleSource}
              className="ml-2 inline-flex items-center gap-1 text-xs font-mono font-semibold text-purple-400 hover:text-purple-300 bg-purple-950/50 border border-purple-500/30 px-2 py-0.5 rounded hover:bg-purple-900/60 transition-all cursor-pointer"
            >
              <Code2 className="w-3 h-3" />
              <span>[source]</span>
            </button>
          );
        }

        if (part.startsWith("$$") && part.endsWith("$$")) {
          const inner = part.slice(2, -2).trim();
          return (
            <div key={index} className="my-2 overflow-x-auto rounded-md bg-zinc-950/80 border border-purple-500/30 py-1.5 px-2.5 text-center text-xs sm:text-sm text-purple-200 [&_.katex]:text-[0.88em] shadow-sm select-all">
              <KaTeXMath math={inner} displayMode={true} />
            </div>
          );
        }

        if (part.startsWith("$") && part.endsWith("$")) {
          const inner = part.slice(1, -1).trim();
          return (
            <span key={index} className="inline-block px-1 py-0.5 bg-purple-950/40 rounded border border-purple-500/25 text-purple-300 text-[0.95em]">
              <KaTeXMath math={inner} displayMode={false} />
            </span>
          );
        }

        if (part.startsWith("**") && part.endsWith("**")) {
          const inner = part.slice(2, -2);
          return (
            <strong key={index} className="text-purple-300 font-semibold">
              {inner}
            </strong>
          );
        }

        if (part.startsWith("`") && part.endsWith("`")) {
          const inner = part.slice(1, -1);
          return (
            <code
              key={index}
              className="rounded bg-zinc-900 border border-zinc-800/80 px-1.5 py-0.5 font-mono text-xs text-purple-300 font-medium"
            >
              {inner}
            </code>
          );
        }

        // Fallback check if text part itself has unescaped TeX macros like \mathbf or \mathcal
        if (/\\(mathcal|mathbb|mathbf|frac|sum|int|hat|widehat|sim|varepsilon|cdot|left|right|norm)/.test(part)) {
          return <KaTeXMath key={index} math={part} displayMode={false} />;
        }

        // Render type hints in parameter lines like (float) or (str)
        const subParts = part.split(/\((float|int|str|bool|list|dict|tuple)(?:\[.*?\])?\)/gi);

        return (
          <span key={index}>
            {subParts.map((sub, sIdx) => {
              const lowerSub = sub.toLowerCase();
              if (PYTHON_DOC_LINKS[lowerSub]) {
                return (
                  <a
                    key={sIdx}
                    href={PYTHON_DOC_LINKS[lowerSub]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline font-mono text-xs inline-flex items-center gap-0.5 mx-0.5"
                  >
                    <span>({sub})</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                );
              }
              return <span key={sIdx}>{sub}</span>;
            })}
          </span>
        );
      })}
    </span>
  );
}

export default function DocPage({ params }: PageProps) {
  const [showSource, setShowSource] = useState(false);

  // React.use for params promise
  const resolvedParams = React.use(params as any) as { id: string };
  const docId = resolvedParams.id;
  const doc = DOCS_DATA[docId];

  if (!doc) {
    notFound();
  }

  // Calculate prev and next doc pages
  const docKeys = Object.keys(DOCS_DATA);
  const currentIndex = docKeys.indexOf(docId);
  const prevDoc = currentIndex > 0 ? DOCS_DATA[docKeys[currentIndex - 1]] : null;
  const nextDoc = currentIndex < docKeys.length - 1 ? DOCS_DATA[docKeys[currentIndex + 1]] : null;

  return (
    <article className="space-y-8 animate-in fade-in duration-300 font-sans">
      {/* Doc Header */}
      <div className="border-b border-zinc-800/80 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-purple-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{doc.category.replace("-", " ")}</span>
          </div>

          {doc.sourceCode && (
            <button
              onClick={() => setShowSource(!showSource)}
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-950/40 px-3 py-1.5 text-xs font-mono font-semibold text-purple-300 hover:bg-purple-900/50 hover:text-purple-200 transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            >
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              <span>{showSource ? "Hide Source Code" : "View Source Code [source]"}</span>
            </button>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{doc.title}</h1>
        <p className="mt-2 text-zinc-400 text-sm sm:text-base leading-relaxed">
          <FormattedText text={doc.description} />
        </p>
      </div>

      {/* SOURCE CODE VIEWER MODAL / COLLAPSIBLE */}
      <AnimatePresence>
        {showSource && doc.sourceCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-2xl border border-purple-500/40 bg-zinc-950 p-4 shadow-[0_0_30px_rgba(168,85,247,0.25)]"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
              <span className="font-mono text-xs font-bold text-purple-300 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                Source Code for engressionts.models.{doc.title}
              </span>
              <button
                onClick={() => setShowSource(false)}
                className="text-xs font-mono text-zinc-400 hover:text-white"
              >
                Close [x]
              </button>
            </div>
            <CodeBox code={doc.sourceCode} language="python" title={`src/engressionts/models/${doc.title.toLowerCase()}.py`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Doc Content Blocks */}
      <div className="space-y-6">
        {doc.content.map((block, idx) => {
          if (block.type === "markdown" && block.text) {
            return (
              <p key={idx} className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                <FormattedText
                  text={block.text}
                  onToggleSource={doc.sourceCode ? () => setShowSource(!showSource) : undefined}
                />
              </p>
            );
          }

          if (block.type === "heading" && block.text) {
            return (
              <h2
                key={idx}
                className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-4 border-t border-zinc-900 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-purple-400 inline-block shadow-[0_0_8px_rgba(168,85,247,0.9)]" />
                <span>{block.text}</span>
              </h2>
            );
          }

          if (block.type === "math") {
            return (
              <div key={idx} className="my-3 rounded-lg border border-purple-500/30 bg-zinc-950/80 p-2.5 sm:p-3 shadow-[0_0_12px_rgba(168,85,247,0.1)]">
                {block.title && (
                  <div className="flex items-center space-x-1.5 mb-1.5 border-b border-zinc-800/80 pb-1">
                    <Calculator className="w-3 h-3 text-purple-400" />
                    <span className="text-purple-300 font-mono font-bold text-[10px] uppercase tracking-wider">
                      {block.title}
                    </span>
                  </div>
                )}
                {block.formula && (
                  <div className="my-1.5 overflow-x-auto rounded-md bg-zinc-900/80 border border-purple-900/40 py-1.5 px-2.5 text-center text-xs sm:text-sm text-purple-200 [&_.katex]:text-[0.88em] shadow-inner select-all">
                    <KaTeXMath math={block.formula.replace(/^\$\$|\$\$$/g, "").trim()} displayMode={true} />
                  </div>
                )}
                {block.text && (
                  <p className="mt-1.5 text-[11px] sm:text-xs text-zinc-300 leading-relaxed font-sans">
                    <FormattedText text={block.text} />
                  </p>
                )}
                {block.variables && block.variables.length > 0 && (
                  <div className="mt-2.5 pt-1.5 border-t border-zinc-900/80 space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-purple-400 font-semibold block mb-1">Variables & Mathematical Notation:</span>
                    {block.variables.map((v: any, vIdx: number) => (
                      <div key={vIdx} className="flex items-start space-x-1.5 text-[11px] text-zinc-300">
                        <span className="font-bold text-purple-300 bg-purple-950/70 border border-purple-500/30 px-1 py-0.5 rounded font-mono text-[10px] flex-shrink-0">
                          <FormattedText text={v.symbol.startsWith("$") || v.symbol.includes("\\") ? (v.symbol.startsWith("$") ? v.symbol : `$${v.symbol}$`) : `$${v.symbol}$`} />
                        </span>
                        <span className="text-zinc-400 font-sans leading-snug text-[11px]">
                          <FormattedText text={v.description} />
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          if (block.type === "list" && block.items) {
            return (
              <ul key={idx} className="space-y-3 my-4">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start space-x-3 text-sm text-zinc-300 leading-relaxed">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <FormattedText
                        text={item}
                        onToggleSource={doc.sourceCode ? () => setShowSource(!showSource) : undefined}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            );
          }

          if (block.type === "code" && block.code) {
            return (
              <div key={idx} className="relative group">
                {block.hasSource && doc.sourceCode && (
                  <div className="absolute top-3 right-20 z-10">
                    <button
                      onClick={() => setShowSource(!showSource)}
                      className="text-[11px] font-mono font-semibold text-purple-300 hover:text-purple-200 bg-purple-950/80 border border-purple-500/40 px-2.5 py-1 rounded-md transition-all shadow-md cursor-pointer"
                    >
                      [source]
                    </button>
                  </div>
                )}
                <CodeBox
                  code={block.code}
                  language={block.language || "python"}
                />
              </div>
            );
          }

          if (block.type === "grid" && block.links) {
            return (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                {block.links.map((linkItem, linkIdx) => (
                  <Link
                    key={linkIdx}
                    href={linkItem.href}
                    className="group flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-950 p-4 transition-all hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-2 text-purple-400 font-mono text-sm font-bold group-hover:text-purple-300">
                        <Cpu className="w-4 h-4" />
                        <span>{linkItem.title}</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{linkItem.desc}</p>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-purple-400 font-semibold group-hover:text-purple-300">
                      <span>View API Documentation</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            );
          }

          if (block.type === "image" && block.url) {
            return (
              <div key={idx} className="my-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-3 sm:p-5 shadow-2xl overflow-hidden">
                {block.title && (
                  <div className="flex items-center space-x-2 mb-3 text-xs font-mono font-semibold text-purple-400">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span>{block.title}</span>
                  </div>
                )}
                <div className="relative rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.url}
                    alt={block.alt || "Generated Plot"}
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>
                {block.caption && (
                  <p className="mt-2.5 text-center text-xs text-zinc-400 font-sans italic">
                    {block.caption}
                  </p>
                )}
              </div>
            );
          }

          if (block.type === "playground") {
            return <InteractivePlayground key={idx} />;
          }

          return null;
        })}
      </div>

      {/* Prev / Next Pagination */}
      <div className="pt-10 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevDoc ? (
          <Link
            href={`/docs/${prevDoc.id}`}
            className="w-full sm:w-auto flex items-center space-x-3 rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-xs font-semibold text-zinc-300 hover:border-purple-500/40 hover:bg-zinc-900 hover:text-purple-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-purple-400" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Previous</span>
              <span>{prevDoc.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextDoc ? (
          <Link
            href={`/docs/${nextDoc.id}`}
            className="w-full sm:w-auto flex items-center space-x-3 rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-xs font-semibold text-zinc-300 hover:border-purple-500/40 hover:bg-zinc-900 hover:text-purple-300 transition-all sm:ml-auto"
          >
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Next</span>
              <span>{nextDoc.title}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-400" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </article>
  );
}
