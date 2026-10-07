"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Layers, Activity, ShieldCheck, Cpu, Sliders } from "lucide-react";

export const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Probabilistic Calibration",
    description:
      "Integrated Energy Score loss and target noise injection for model-intrinsic uncertainty quantification.",
    accent: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30"
  },
  {
    icon: Layers,
    title: "11 Deep Learning Architectures",
    description:
      "Native support for N-BEATS, N-HiTS, TFT, TiDE, Transformers, TSMixer, DLinear, NLinear, TCN, RNN, and BlockRNN.",
    accent: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30"
  },
  {
    icon: Sliders,
    title: "Flexible Noise Distributions",
    description:
      "Target noise injection with parameterized Gaussian, Uniform, and custom mathematical distributions.",
    accent: "from-pink-500/20 to-purple-500/20 text-pink-400 border-pink-500/30"
  },
  {
    icon: Cpu,
    title: "PyTorch Lightning Core",
    description:
      "Multi-GPU/CPU training pipelines, automatic precision scaling, scalable DataLoaders, and automated logging.",
    accent: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30"
  },
  {
    icon: Activity,
    title: "Sample-Based Quantile Extraction",
    description:
      "Extract 5th, 50th, 95th percentiles and custom confidence intervals directly from sample-based prediction paths.",
    accent: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30"
  },
  {
    icon: Zap,
    title: "Seamless Darts Integration",
    description:
      "Inherits directly from PyTorch Darts models, preserving full API compatibility with standard time-series evaluation.",
    accent: "from-fuchsia-500/20 to-pink-500/20 text-fuchsia-400 border-fuchsia-500/30"
  }
];

export const FeaturesList: React.FC = () => {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-xs uppercase font-mono tracking-widest text-purple-400 mb-2">Architectural Overview</h2>
        <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Engineered for Distributional Time-Series
        </h3>
        <p className="mt-3 text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
          engressionts blends energy-based continuous regression with PyTorch forecasting models to deliver calibrated probabilistic bounds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
              className={`relative overflow-hidden rounded-2xl border bg-zinc-950/90 p-6 shadow-xl hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] transition-all ${feature.accent.split(" ")[3]}`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br mb-4 border border-zinc-800 ${feature.accent.split(" ")[0]} ${feature.accent.split(" ")[1]}`}
              >
                <Icon className={`w-6 h-6 ${feature.accent.split(" ")[2]}`} />
              </div>
              <h4 className="text-lg font-bold text-zinc-100 mb-2">{feature.title}</h4>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
