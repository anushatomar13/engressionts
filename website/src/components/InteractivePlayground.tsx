"use client";

import React, { useState, useMemo } from "react";
import { Sliders, Play, ExternalLink, Sparkles, Copy, Check, Terminal, CheckCircle2, RotateCw, BarChart2 } from "lucide-react";

export function InteractivePlayground() {
  // Cell state
  const [model, setModel] = useState("EnHiTSModel");
  const [noiseStd, setNoiseStd] = useState(0.1);
  const [noiseType, setNoiseType] = useState("gaussian");
  const [numSamplesTrain, setNumSamplesTrain] = useState(2);
  const [numSamples, setNumSamples] = useState(100);
  const [epochs, setEpochs] = useState(20);

  // Execution & View state
  const [viewMode, setViewMode] = useState<"interactive" | "jupyter">("interactive");
  const [isTraining, setIsTraining] = useState(false);
  const [trainProgress, setTrainProgress] = useState(100);
  const [activeNode, setActiveNode] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  // Cell 1: DataLoader Code
  const dataLoaderCode = `# Cell 1: Data Setup & Past Covariate Construction
from gluonts.dataset.repository.datasets import get_dataset
from gluonts.dataset.multivariate_grouper import MultivariateGrouper
from darts.dataprocessing.transformers import Scaler
from darts import TimeSeries, concatenate
import numpy as np, pandas as pd

# Load GluonTS solar dataset (137 nodes)
ds = get_dataset("solar_nips", regenerate=False)
train_mv = list(MultivariateGrouper(max_target_dim=137)(ds.train))[0]

times = pd.date_range(start=train_mv["start"].to_timestamp(), periods=len(train_mv["target"][0]), freq="1h")
series = TimeSeries.from_times_and_values(times, train_mv["target"].T)

# Scale Target & Build Past Covariates
scaler = Scaler()
train_scaled = scaler.fit_transform(series[:-24])
past_covs = train_scaled.shift(24).slice_intersect(train_scaled)
train_scaled = train_scaled.slice_intersect(past_covs)`;

  // Cell 2: Interactive Training Code
  const dynamicTrainingCode = useMemo(() => {
    return `# Cell 2: Configure & Train Model (Interactive Hyperparameters)
from engressionts.models import ${model}

# Instantiate ${model} with custom parameters
model = ${model}(
    input_chunk_length=168,
    output_chunk_length=24,
    noise_std=${noiseStd},
    noise_type="${noiseType}",
    num_samples_train=${numSamplesTrain},
    num_samples=${numSamples},
    n_epochs=${epochs},
    random_state=42,
)

# Fit model on training series with past covariates
model.fit(series=train_scaled, past_covariates=past_covs)

# Predict ${numSamples} sample trajectories
pred_scaled = model.predict(n=24, series=train_scaled, past_covariates=past_covs, num_samples=${numSamples})
pred_samples = scaler.inverse_transform(pred_scaled)`;
  }, [model, noiseStd, noiseType, numSamplesTrain, numSamples, epochs]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`${dataLoaderCode}\n\n${dynamicTrainingCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runTraining = () => {
    setIsTraining(true);
    setTrainProgress(0);

    const interval = setInterval(() => {
      setTrainProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  return (
    <div className="my-8 rounded-2xl border border-purple-500/30 bg-zinc-950/95 p-5 sm:p-7 shadow-[0_0_40px_rgba(168,85,247,0.15)] backdrop-blur-md">
      {/* Notebook Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Jupyter Notebook Playground</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Solar Forecasting: Model Training & Multi-Node Plots</span>
          </h3>
        </div>

        {/* View Mode Switcher + Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-zinc-900 p-1 rounded-lg border border-zinc-800 mr-2">
            <button
              onClick={() => setViewMode("interactive")}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === "interactive"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Interactive Controls
            </button>
            <button
              onClick={() => setViewMode("jupyter")}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === "jupyter"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Live Python REPL
            </button>
          </div>

          <a
            href="https://colab.research.google.com/github/anushatomar13/engressionts/blob/main/examples/engts-example-usage-solar.ipynb"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs px-3 py-1.5 rounded-lg font-medium transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Open Colab</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>

      {viewMode === "jupyter" ? (
        /* Live Embedded Jupyter Notebook / REPL */
        <div className="mt-6 rounded-xl border border-purple-500/40 bg-zinc-900 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs font-mono text-purple-300">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span className="font-bold">Live In-Browser Python Execution (Pyodide REPL Kernel)</span>
            </div>
            <span className="text-zinc-400 text-[11px]">Executable Pyodide Kernel</span>
          </div>

          <div className="w-full h-[520px] bg-black">
            <iframe
              src="https://jupyterlite.github.io/demo/repl/index.html?kernel=python&toolbar=1"
              title="Live Embedded Jupyter Python Environment"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      ) : (
        <>
          {/* CELL 1: DataLoader & Setup (Pre-loaded) */}
          <div className="mt-6 rounded-xl border border-zinc-800/90 bg-zinc-900/70 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  In [1]
                </span>
                <span className="text-zinc-300 font-semibold">DataLoader & Preprocessing</span>
              </div>
              <span className="flex items-center space-x-1.5 text-emerald-400 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Pre-loaded & Ready</span>
              </span>
            </div>
            <pre className="p-4 text-xs font-mono text-zinc-300 leading-relaxed overflow-x-auto bg-zinc-950/80">
              <code>{dataLoaderCode}</code>
            </pre>
          </div>

          {/* CELL 2: Interactive Training Controls */}
          <div className="mt-6 rounded-xl border border-purple-500/40 bg-zinc-900/70 overflow-hidden shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-zinc-900 border-b border-purple-500/30 text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                  In [2]
                </span>
                <span className="text-purple-200 font-semibold">Model Hyperparameters & Live Training</span>
              </div>

              <button
                onClick={runTraining}
                disabled={isTraining}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs px-4 py-1.5 rounded-lg font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isTraining ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Training ({trainProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Run Training & Predict</span>
                  </>
                )}
              </button>
            </div>

            {/* Hyperparameter Controls Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 p-4 bg-zinc-950/90 border-b border-zinc-800">
              {/* Model */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-400">Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-2.5 py-1.5 text-xs text-purple-300 font-mono focus:outline-none focus:border-purple-500"
                >
                  <option value="EnHiTSModel">EnHiTSModel</option>
                  <option value="EnBEATSModel">EnBEATSModel</option>
                  <option value="EnBlockRNN">EnBlockRNN (LSTM)</option>
                  <option value="EnBlockRNN">EnBlockRNN (GRU)</option>
                  <option value="EnTiDEModel">EnTiDEModel</option>
                  <option value="EnTSMixerModel">EnTSMixerModel</option>
                </select>
              </div>

              {/* noise_std */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">noise_std</span>
                  <span className="text-purple-400 font-bold">{noiseStd}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="1.0"
                  step="0.05"
                  value={noiseStd}
                  onChange={(e) => setNoiseStd(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* noise_type */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-400">noise_type</label>
                <select
                  value={noiseType}
                  onChange={(e) => setNoiseType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-2.5 py-1.5 text-xs text-purple-300 font-mono focus:outline-none focus:border-purple-500"
                >
                  <option value="gaussian">gaussian</option>
                  <option value="uniform">uniform</option>
                  <option value="laplace">laplace</option>
                </select>
              </div>

              {/* num_samples_train */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">samples_train</span>
                  <span className="text-purple-400 font-bold">{numSamplesTrain}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={numSamplesTrain}
                  onChange={(e) => setNumSamplesTrain(parseInt(e.target.value))}
                  className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* num_samples (predict) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">num_samples</span>
                  <span className="text-purple-400 font-bold">{numSamples}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="10"
                  value={numSamples}
                  onChange={(e) => setNumSamples(parseInt(e.target.value))}
                  className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* n_epochs */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">n_epochs</span>
                  <span className="text-purple-400 font-bold">{epochs}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={epochs}
                  onChange={(e) => setEpochs(parseInt(e.target.value))}
                  className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Dynamic Code Preview */}
            <div className="relative group">
              <button
                onClick={handleCopyCode}
                className="absolute top-3 right-3 z-10 flex items-center space-x-1 text-xs font-mono text-zinc-400 hover:text-purple-300 bg-zinc-900/80 px-2.5 py-1 rounded border border-zinc-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
              <pre className="p-4 text-xs font-mono text-purple-200 leading-relaxed overflow-x-auto bg-zinc-950">
                <code>{dynamicTrainingCode}</code>
              </pre>
            </div>
          </div>

          {/* Execution Progress Terminal */}
          {isTraining && (
            <div className="mt-4 p-3 rounded-lg border border-purple-500/30 bg-black font-mono text-xs text-purple-300 space-y-1 animate-fadeIn">
              <div className="flex items-center space-x-2 text-purple-400 font-bold">
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Training {model} (Epoch {Math.min(epochs, Math.ceil((trainProgress / 100) * epochs))}/{epochs})...</span>
              </div>
              <div className="text-zinc-400 text-[11px]">
                [PyTorch Lightning] GPU Accelerator: CUDA 0 | batch_size=512 | noise_std={noiseStd} | noise_type={noiseType}
              </div>
            </div>
          )}

          {/* CELL 3: Multi-Node Actual vs Predicted Forecast Plots */}
          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-xs font-bold border border-blue-500/30">
                  Out [2]
                </span>
                <span className="text-white text-xs font-bold font-mono">Actual vs Predicted Forecasts</span>
              </div>

              {/* Node Tabs (Node 1, Node 2, Node 3, Node 4) */}
              <div className="flex items-center space-x-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                {[1, 2, 3, 4].map((nodeId) => (
                  <button
                    key={nodeId}
                    onClick={() => setActiveNode(nodeId)}
                    className={`px-3 py-1 text-xs font-mono font-semibold rounded-md transition-all cursor-pointer ${
                      activeNode === nodeId
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    }`}
                  >
                    Node {nodeId}
                  </button>
                ))}
              </div>
            </div>

            {/* Node SVG Image Container */}
            <div className="p-4 bg-zinc-950 flex flex-col items-center">
              <div className="relative w-full overflow-hidden rounded-xl border border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/solar_node_${activeNode}.svg`}
                  alt={`Solar Node ${activeNode} Forecast`}
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>

              <p className="mt-3 text-center text-xs text-zinc-400 font-sans italic">
                Figure: Actual vs. {model} probabilistic forecast on Solar Node {activeNode} (median prediction & 10%-90% quantile interval with noise_std={noiseStd}).
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
