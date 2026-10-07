"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, Sparkles, CheckCircle2 } from "lucide-react";

interface TerminalTypingIntroProps {
  isLanding: boolean;
  onIntroComplete?: () => void;
}

export const TerminalTypingIntro: React.FC<TerminalTypingIntroProps> = ({
  isLanding,
  onIntroComplete
}) => {
  const fullCommand = "!pip install engressionts";
  const [typedCommand, setTypedCommand] = useState("");
  const [commandIndex, setCommandIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [commandDone, setCommandDone] = useState(false);

  // 4 Feature sentences with '>' bullet points
  const featureSentences = [
    "> Deep Distributional Forecasting: Energy Score calibration with model-intrinsic uncertainty quantification.",
    "> 11 Built-in Neural Architectures: N-BEATS, N-HiTS, TFT, TiDE, Transformers, TSMixer, DLinear, NLinear, TCN, RNN, & BlockRNN.",
    "> Flexible Noise Modeling: Target noise injection with Gaussian, Uniform, & custom distributions.",
    "> PyTorch Lightning Engine: Scalable multi-GPU/CPU training pipelines & automated logging."
  ];

  const [visibleSentenceCount, setVisibleSentenceCount] = useState(0);

  const colors = [
    "text-green-400 drop-shadow-[0_0_12px_rgba(34,197,94,0.9)]",
    "text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]",
    "text-pink-400 drop-shadow-[0_0_12px_rgba(236,72,153,0.9)]",
    "text-purple-400 drop-shadow-[0_0_18px_rgba(168,85,247,1)]"
  ];

  // Command typing effect
  useEffect(() => {
    if (commandIndex < fullCommand.length) {
      const timeout = setTimeout(() => {
        setTypedCommand((prev) => prev + fullCommand[commandIndex]);
        setCommandIndex((prev) => prev + 1);
      }, 60);
      return () => clearTimeout(timeout);
    } else {
      setCommandDone(true);
    }
  }, [commandIndex, fullCommand]);

  // Color shifting effect after command typed
  useEffect(() => {
    if (!commandDone) return;
    const interval = setInterval(() => {
      setColorIndex((prev) => {
        if (prev < colors.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onIntroComplete) {
            setTimeout(() => {
              onIntroComplete();
            }, 450);
          }
          return prev;
        }
      });
    }, 400);

    return () => clearInterval(interval);
  }, [commandDone, colors.length, onIntroComplete]);

  // Feature sentences typing sequence after terminal expands & lands
  useEffect(() => {
    if (!isLanding) return;
    if (visibleSentenceCount < featureSentences.length) {
      const timer = setTimeout(() => {
        setVisibleSentenceCount((prev) => prev + 1);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [isLanding, visibleSentenceCount, featureSentences.length]);

  const prefixText = "!pip install ";

  const renderCommandWithColor = () => {
    if (typedCommand.length <= prefixText.length) {
      return (
        <span className="text-green-400 font-mono drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
          {typedCommand}
        </span>
      );
    }

    const typedPkg = typedCommand.slice(prefixText.length);
    const currentColorClass = colors[colorIndex];

    return (
      <span className="font-mono">
        <span className="text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">{prefixText}</span>
        <motion.span
          key={colorIndex}
          initial={{ opacity: 0.7, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className={`font-bold ${currentColorClass}`}
        >
          {typedPkg}
        </motion.span>
      </span>
    );
  };

  return (
    <motion.div
      layout
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full mx-auto transition-all ${
        isLanding ? "max-w-2xl" : "max-w-xl"
      }`}
    >
      <div className="relative rounded-2xl border border-purple-500/40 bg-zinc-950 p-1 shadow-[0_0_40px_rgba(168,85,247,0.25)]">
        {/* Sleek Terminal Titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/90 rounded-t-xl">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-red-500 inline-block shadow-[0_0_6px_rgba(239,68,68,0.7)]" />
            <span className="h-3 w-3 rounded-full bg-amber-500 inline-block shadow-[0_0_6px_rgba(245,158,11,0.7)]" />
            <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
            <span className="ml-3 text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-purple-400" />
              bash — engressionts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span className="text-[11px] font-mono text-purple-300 uppercase tracking-widest font-semibold">
              Neon Terminal
            </span>
          </div>
        </div>

        {/* Terminal Screen Body with dynamic height expansion */}
        <motion.div
          layout
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`p-6 font-mono text-sm sm:text-base flex flex-col justify-between bg-zinc-950/95 rounded-b-xl transition-all ${
            isLanding ? "min-h-[220px]" : "min-h-[90px]"
          }`}
        >
          {/* Line 1: Command */}
          <div className="flex items-center space-x-3">
            <span className="text-zinc-500 font-bold select-none text-base">$</span>
            <div className="flex-1 flex items-center">
              {renderCommandWithColor()}
              {/* Cursor */}
              {!isLanding && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                  className="inline-block w-2.5 h-5 ml-1 bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.9)]"
                />
              )}
            </div>
          </div>

          {/* Lines 2-5: 4 Feature Sentences with '>' Bullet Points after expanding & landing */}
          {isLanding && (
            <div className="mt-5 pt-4 border-t border-zinc-900/90 space-y-2.5 text-xs sm:text-sm text-left">
              <AnimatePresence>
                {featureSentences.slice(0, visibleSentenceCount).map((sentence, idx) => {
                  const parts = sentence.split(":");
                  const prefix = parts[0]; // e.g. "> Deep Distributional Forecasting"
                  const body = parts.slice(1).join(":"); // e.g. " Energy Score calibration..."

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start space-x-2 font-mono leading-relaxed"
                    >
                      <span className="text-purple-400 font-bold select-none flex-shrink-0">&gt;</span>
                      <div className="text-zinc-300">
                        <strong className="text-purple-300 font-semibold">{prefix.slice(2)}:</strong>
                        <span className="text-zinc-400">{body}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {visibleSentenceCount === featureSentences.length && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-3 text-emerald-400 flex items-center gap-1.5 font-bold text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>engressionts ready!</span>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
