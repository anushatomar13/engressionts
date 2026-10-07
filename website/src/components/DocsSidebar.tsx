"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_DATA } from "@/data/docsData";
import { BookOpen, Code2, Layers, Quote, ChevronDown, ChevronRight } from "lucide-react";

const MODEL_SUB_ITEMS = [
  { id: "api-model-enbeats", title: "EnBEATSModel" },
  { id: "api-model-enhits", title: "EnHiTSModel" },
  { id: "api-model-entft", title: "EnTFTModel" },
  { id: "api-model-entide", title: "EnTiDEModel" },
  { id: "api-model-entsmixer", title: "EnTSMixerModel" },
  { id: "api-model-entransformer", title: "EnTransformerModel" },
  { id: "api-model-enrnn", title: "EnRNNModel" },
  { id: "api-model-enblockrnn", title: "EnBlockRNNModel" },
  { id: "api-model-entcn", title: "EnTCNModel" },
  { id: "api-model-endlinear", title: "EnDLinearModel" },
  { id: "api-model-ennlinear", title: "EnNLinearModel" }
];

export const DocsSidebar: React.FC = () => {
  const pathname = usePathname();
  const [modelsOpen, setModelsOpen] = useState(true);

  const CATEGORY_MAP = [
    {
      name: "Getting Started",
      icon: BookOpen,
      items: ["overview", "installation"]
    },
    {
      name: "Guides & Examples",
      icon: Code2,
      items: ["usage"]
    },
    {
      name: "API Reference",
      icon: Layers,
      items: ["api-models", "api-losses", "api-metrics", "api-noise", "api-base"]
    },
    {
      name: "Resources",
      icon: Quote,
      items: ["citation"]
    }
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 border-r border-zinc-800/80 bg-zinc-950/60 p-6 md:min-h-[calc(100vh-73px)] font-sans">
      <div className="space-y-7 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-1 custom-scrollbar">
        {CATEGORY_MAP.map((cat, idx) => {
          const CatIcon = cat.icon;
          return (
            <div key={idx} className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold mb-1">
                <CatIcon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </div>
              <ul className="space-y-1 text-sm">
                {cat.items.map((docId) => {
                  const doc = DOCS_DATA[docId];
                  if (!doc) return null;
                  const href = `/docs/${docId}`;
                  const isActive = pathname === href;

                  if (docId === "api-models") {
                    const isAnyModelActive = pathname.startsWith("/docs/api-model");
                    return (
                      <li key={docId} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Link
                            href={href}
                            className={`flex-1 flex items-center justify-between rounded-xl px-3 py-2 transition-all font-medium ${
                              isActive
                                ? "bg-purple-950/60 text-purple-300 border border-purple-500/40 font-semibold shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                                : isAnyModelActive
                                ? "text-purple-300 font-semibold"
                                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                            }`}
                          >
                            <span className="truncate">{doc.title}</span>
                            {isActive && (
                              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.9)]" />
                            )}
                          </Link>

                          <button
                            onClick={() => setModelsOpen(!modelsOpen)}
                            className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                            aria-label="Toggle models list"
                          >
                            {modelsOpen ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Nested 11 Model items */}
                        {modelsOpen && (
                          <ul className="ml-3 pl-3 border-l border-zinc-800/80 space-y-1 my-1">
                            {MODEL_SUB_ITEMS.map((subItem) => {
                              const subHref = `/docs/${subItem.id}`;
                              const isSubActive = pathname === subHref;
                              return (
                                <li key={subItem.id}>
                                  <Link
                                    href={subHref}
                                    className={`block text-xs py-1 px-2 rounded-lg transition-all ${
                                      isSubActive
                                        ? "bg-purple-900/40 text-purple-300 font-semibold border border-purple-500/30"
                                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                                    }`}
                                  >
                                    {subItem.title}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  }

                  return (
                    <li key={docId}>
                      <Link
                        href={href}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 transition-all font-medium ${
                          isActive
                            ? "bg-purple-950/60 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.25)] font-semibold"
                            : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                        }`}
                      >
                        <span className="truncate">{doc.title}</span>
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.9)]" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
