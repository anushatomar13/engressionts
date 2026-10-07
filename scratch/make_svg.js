const fs = require('fs');
const path = require('path');

const width = 800;
const height = 400;
const padding = { top: 65, right: 40, bottom: 50, left: 60 };
const plotW = width - padding.left - padding.right;
const plotH = height - padding.top - padding.bottom;

const nTrain = 80;
const nTest = 30;
const total = nTrain + nTest;

let actual = [];
for (let i = 0; i < total; i++) {
  const y = 50 + 15 * Math.sin(i / 6) + 6 * Math.cos(i / 3) + (Math.sin(i * 1.5) * 2);
  actual.push(y);
}

const minY = 20;
const maxY = 80;

const scaleX = (i) => padding.left + (i / (total - 1)) * plotW;
const scaleY = (val) => padding.top + plotH - ((val - minY) / (maxY - minY)) * plotH;

let trainPath = '';
for (let i = 0; i < nTrain; i++) {
  const x = scaleX(i);
  const y = scaleY(actual[i]);
  trainPath += (i === 0 ? 'M' : 'L') + ` ${x.toFixed(1)},${y.toFixed(1)}`;
}

let testPath = '';
for (let i = nTrain - 1; i < total; i++) {
  const x = scaleX(i);
  const y = scaleY(actual[i]);
  testPath += (i === nTrain - 1 ? 'M' : 'L') + ` ${x.toFixed(1)},${y.toFixed(1)}`;
}

let medianPath = '';
let upperPoints = [];
let lowerPoints = [];

for (let i = 0; i < nTest; i++) {
  const idx = nTrain + i;
  const x = scaleX(idx);
  const noise = (Math.sin(i * 0.8) * 1.5);
  const medY = actual[idx] + noise;
  const spread = 4 + (i * 0.15);
  const lowY = medY - spread;
  const highY = medY + spread;

  medianPath += (i === 0 ? 'M' : 'L') + ` ${x.toFixed(1)},${scaleY(medY).toFixed(1)}`;
  upperPoints.push([x, scaleY(highY)]);
  lowerPoints.unshift([x, scaleY(lowY)]);
}

let shadePath = `M ${upperPoints[0][0].toFixed(1)},${upperPoints[0][1].toFixed(1)}`;
for (let p of upperPoints) {
  shadePath += ` L ${p[0].toFixed(1)},${p[1].toFixed(1)}`;
}
for (let p of lowerPoints) {
  shadePath += ` L ${p[0].toFixed(1)},${p[1].toFixed(1)}`;
}
shadePath += ' Z';

let gridY = '';
for (let v = 20; v <= 80; v += 15) {
  const y = scaleY(v);
  gridY += `<line x1="${padding.left}" y1="${y.toFixed(1)}" x2="${width - padding.right}" y2="${y.toFixed(1)}" stroke="#27272a" stroke-dasharray="3,3" stroke-width="1" />`;
  gridY += `<text x="${padding.left - 10}" y="${y + 4}" fill="#a1a1aa" font-size="11" font-family="sans-serif" text-anchor="end">${v}</text>`;
}

let gridX = '';
for (let i = 0; i <= total; i += 20) {
  const x = scaleX(i);
  gridX += `<line x1="${x.toFixed(1)}" y1="${padding.top}" x2="${x.toFixed(1)}" y2="${height - padding.bottom}" stroke="#27272a" stroke-dasharray="3,3" stroke-width="1" />`;
  gridX += `<text x="${x.toFixed(1)}" y="${height - padding.bottom + 20}" fill="#a1a1aa" font-size="11" font-family="sans-serif" text-anchor="middle">t=${i}</text>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="auto" style="background:#09090b; border-radius: 12px; border: 1px solid #27272a;">
  <!-- Title -->
  <text x="${padding.left}" y="32" fill="#f4f4f5" font-size="15" font-weight="bold" font-family="sans-serif">EnHiTSModel: Actual vs Probabilistic Forecast (Energy Generation)</text>
  <text x="${padding.left}" y="48" fill="#a1a1aa" font-size="11" font-family="sans-serif">Sample trajectory quantile prediction interval (10% - 90%)</text>
  
  <!-- Grid -->
  ${gridY}
  ${gridX}
  
  <!-- Quantile Shade -->
  <path d="${shadePath}" fill="#a855f7" fill-opacity="0.22" />
  
  <!-- Historical Train Actual -->
  <path d="${trainPath}" fill="none" stroke="#38bdf8" stroke-width="2.2" />
  
  <!-- Test Actual (Dashed) -->
  <path d="${testPath}" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,4" />
  
  <!-- Forecast Median -->
  <path d="${medianPath}" fill="none" stroke="#a855f7" stroke-width="2.5" />
  
  <!-- Legend -->
  <g transform="translate(${padding.left + 220}, 20)">
    <rect width="380" height="30" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1" />
    
    <line x1="12" y1="15" x2="28" y2="15" stroke="#38bdf8" stroke-width="2.5" />
    <text x="34" y="19" fill="#e4e4e7" font-size="11" font-family="sans-serif">Actual (Train)</text>
    
    <line x1="115" y1="15" x2="131" y2="15" stroke="#94a3b8" stroke-width="2" stroke-dasharray="3,3" />
    <text x="137" y="19" fill="#e4e4e7" font-size="11" font-family="sans-serif">Actual (Test)</text>
    
    <line x1="220" y1="15" x2="236" y2="15" stroke="#a855f7" stroke-width="2.5" />
    <text x="242" y="19" fill="#e4e4e7" font-size="11" font-family="sans-serif">EnHiTS Forecast</text>
    
    <rect x="332" y="9" width="12" height="12" rx="2" fill="#a855f7" fill-opacity="0.4" />
    <text x="348" y="19" fill="#e4e4e7" font-size="11" font-family="sans-serif">10-90% CI</text>
  </g>
</svg>`;

const dir = path.join(process.cwd(), 'website/public/images');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'actual_vs_predicted.svg'), svg);
console.log('SVG generated successfully!');
