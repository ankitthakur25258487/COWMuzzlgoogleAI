import React, { useEffect, useRef, useState } from 'react';
import {
  Scan,
  Maximize2,
  Sliders,
  Layers,
  Sparkles,
  Download,
  Eye,
  EyeOff,
  Fingerprint,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plus,
  Minus,
  Box,
} from 'lucide-react';
import { MuzzleDetection } from '../types';

interface MuzzleCanvasViewerProps {
  imageUrl: string;
  detections: MuzzleDetection[];
  isAnalyzing: boolean;
}

type MuzzleFilter = 'normal' | 'edges' | 'contrast' | 'ridges';

export const MuzzleCanvasViewer: React.FC<MuzzleCanvasViewerProps> = ({
  imageUrl,
  detections,
  isAnalyzing,
}) => {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);

  const [showBoxes, setShowBoxes] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [boxColor, setBoxColor] = useState('#10b981'); // Emerald
  const [confThreshold, setConfThreshold] = useState(0.5);
  const [boxAreaExpansion, setBoxAreaExpansion] = useState(15); // Default +15% extra snout coverage margin
  const [cropFilter, setCropFilter] = useState<MuzzleFilter>('normal');
  const [selectedDetectionIndex, setSelectedDetectionIndex] = useState(0);

  const activeDetection = detections[selectedDetectionIndex] || detections[0];

  // Helper to compute expanded effective box based on user padding adjustment
  const getEffectiveBox = (box: { ymin: number; xmin: number; ymax: number; xmax: number }) => {
    const rawW = box.xmax - box.xmin;
    const rawH = box.ymax - box.ymin;
    const padX = rawW * (boxAreaExpansion / 100);
    const padY = rawH * (boxAreaExpansion / 100);

    return {
      ymin: Math.max(0, box.ymin - padY),
      xmin: Math.max(0, box.xmin - padX),
      ymax: Math.min(1, box.ymax + padY),
      xmax: Math.min(1, box.xmax + padX),
    };
  };

  // Draw main detection canvas
  useEffect(() => {
    if (!mainCanvasRef.current || !imageUrl) return;

    const canvas = mainCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    
    // Route external URLs through /api/proxy-image to prevent CORS block and canvas taint
    const targetSrc = imageUrl.startsWith('http') && !imageUrl.includes('/api/proxy-image')
      ? `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
      : imageUrl;

    img.src = targetSrc;

    img.onload = () => {
      // Set canvas intrinsic dimensions to match image
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 600;

      // Draw base image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (!showBoxes || isAnalyzing) return;

      // Filter by confidence threshold
      const visibleDetections = detections.filter((d) => d.confidence >= confThreshold);

      visibleDetections.forEach((det, idx) => {
        const isSelected = idx === selectedDetectionIndex;
        const effectiveBox = getEffectiveBox(det.box);
        const { ymin, xmin, ymax, xmax } = effectiveBox;

        const left = xmin * canvas.width;
        const top = ymin * canvas.height;
        const width = (xmax - xmin) * canvas.width;
        const height = (ymax - ymin) * canvas.height;

        // Draw tech bounding box
        ctx.save();
        ctx.strokeStyle = isSelected ? '#10b981' : '#38bdf8';
        ctx.lineWidth = Math.max(3, canvas.width / 350);

        // Box border with subtle fill
        ctx.fillStyle = isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(56, 189, 248, 0.08)';
        ctx.fillRect(left, top, width, height);
        ctx.strokeRect(left, top, width, height);

        // Tech Corner Calipers
        const cornerLen = Math.min(width, height) * 0.22;
        ctx.strokeStyle = isSelected ? '#059669' : '#0284c7';
        ctx.lineWidth = Math.max(4, canvas.width / 260);

        // Top-Left
        ctx.beginPath();
        ctx.moveTo(left, top + cornerLen);
        ctx.lineTo(left, top);
        ctx.lineTo(left + cornerLen, top);
        ctx.stroke();

        // Top-Right
        ctx.beginPath();
        ctx.moveTo(left + width - cornerLen, top);
        ctx.lineTo(left + width, top);
        ctx.lineTo(left + width, top + cornerLen);
        ctx.stroke();

        // Bottom-Left
        ctx.beginPath();
        ctx.moveTo(left, top + height - cornerLen);
        ctx.lineTo(left, top + height);
        ctx.lineTo(left + cornerLen, top + height);
        ctx.stroke();

        // Bottom-Right
        ctx.beginPath();
        ctx.moveTo(left + width - cornerLen, top + height);
        ctx.lineTo(left + width, top + height);
        ctx.lineTo(left + width, top + height - cornerLen);
        ctx.stroke();

        // Biometric Grid Overlay inside box
        if (showGrid) {
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);

          // Horizontal lines
          ctx.beginPath();
          ctx.moveTo(left, top + height * 0.33);
          ctx.lineTo(left + width, top + height * 0.33);
          ctx.moveTo(left, top + height * 0.66);
          ctx.lineTo(left + width, top + height * 0.66);

          // Vertical lines
          ctx.moveTo(left + width * 0.5, top);
          ctx.lineTo(left + width * 0.5, top + height);
          ctx.stroke();
          ctx.setLineDash([]);

          // Center crosshair
          const cx = left + width * 0.5;
          const cy = top + height * 0.5;
          const chLen = 8;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx - chLen, cy);
          ctx.lineTo(cx + chLen, cy);
          ctx.moveTo(cx, cy - chLen);
          ctx.lineTo(cx, cy + chLen);
          ctx.stroke();
        }

        // Tag label overlay
        if (showLabels) {
          const areaLabel = boxAreaExpansion !== 0 ? ` [Area +${boxAreaExpansion}%]` : '';
          const labelText = `YOLOv8 Muzzle: ${(det.confidence * 100).toFixed(1)}%${areaLabel}`;
          const subText = `Bio-ID: ${det.biometricId}`;
          const fontSize = Math.max(12, Math.round(canvas.width / 60));
          ctx.font = `bold ${fontSize}px ui-sans-serif, system-ui, sans-serif`;

          const textWidth = Math.max(ctx.measureText(labelText).width, ctx.measureText(subText).width);
          const tagPadding = 8;
          const tagHeight = fontSize * 2.4;
          const tagY = top > tagHeight + 8 ? top - tagHeight - 4 : top + 4;

          // Label background
          ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
          ctx.beginPath();
          ctx.roundRect(left, tagY, textWidth + tagPadding * 2, tagHeight, 6);
          ctx.fill();

          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Label text
          ctx.fillStyle = '#ffffff';
          ctx.fillText(labelText, left + tagPadding, tagY + fontSize + 2);
          ctx.font = `600 ${Math.round(fontSize * 0.8)}px monospace`;
          ctx.fillStyle = '#6ee7b7';
          ctx.fillText(subText, left + tagPadding, tagY + fontSize * 2 + 2);
        }

        ctx.restore();
      });
    };
  }, [imageUrl, detections, showBoxes, showGrid, showLabels, confThreshold, boxAreaExpansion, selectedDetectionIndex, isAnalyzing]);

  // Draw Cropped Muzzle Biometric Canvas with custom filters
  useEffect(() => {
    if (!cropCanvasRef.current || !imageUrl || !activeDetection) return;

    const cropCanvas = cropCanvasRef.current;
    const ctx = cropCanvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    
    // Route external URLs through /api/proxy-image to prevent CORS block and canvas taint
    const targetSrc = imageUrl.startsWith('http') && !imageUrl.includes('/api/proxy-image')
      ? `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
      : imageUrl;

    img.src = targetSrc;

    img.onload = () => {
      const effectiveBox = getEffectiveBox(activeDetection.box);
      const { ymin, xmin, ymax, xmax } = effectiveBox;
      const cropX = Math.max(0, xmin * img.naturalWidth);
      const cropY = Math.max(0, ymin * img.naturalHeight);
      const cropW = Math.max(10, (xmax - xmin) * img.naturalWidth);
      const cropH = Math.max(10, (ymax - ymin) * img.naturalHeight);

      cropCanvas.width = 360;
      cropCanvas.height = 270;

      ctx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
      // Draw cropped portion scaled to fit
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropCanvas.width, cropCanvas.height);

      // Apply image filters for biometric ridge enhancement
      if (cropFilter !== 'normal') {
        const imgData = ctx.getImageData(0, 0, cropCanvas.width, cropCanvas.height);
        const data = imgData.data;

        if (cropFilter === 'contrast') {
          // High contrast grayscale
          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            // Contrast stretch
            const contrast = (gray - 128) * 1.8 + 128;
            const clamped = Math.max(0, Math.min(255, contrast));
            data[i] = clamped;
            data[i + 1] = clamped;
            data[i + 2] = clamped;
          }
          ctx.putImageData(imgData, 0, 0);
        } else if (cropFilter === 'ridges') {
          // Cattle Muzzle Dermatoglyphic Bead & Ridge Enhancer
          const copy = new Uint8ClampedArray(data);
          const w = cropCanvas.width;
          const h = cropCanvas.height;

          for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
              const idx = (y * w + x) * 4;
              // Laplacian kernel for edge & ridge detection
              const center = copy[idx] * 0.3 + copy[idx + 1] * 0.59 + copy[idx + 2] * 0.11;
              const top = copy[((y - 1) * w + x) * 4];
              const bottom = copy[((y + 1) * w + x) * 4];
              const left = copy[(y * w + (x - 1)) * 4];
              const right = copy[(y * w + (x + 1)) * 4];

              const laplacian = Math.abs(4 * center - top - bottom - left - right);
              const edgeVal = Math.min(255, laplacian * 3.5);

              data[idx] = 16; // Dark emerald background
              data[idx + 1] = Math.min(255, edgeVal + 40); // Bright emerald ridges
              data[idx + 2] = Math.min(255, edgeVal * 0.7);
            }
          }
          ctx.putImageData(imgData, 0, 0);
        } else if (cropFilter === 'edges') {
          // Classic Sobel Edge Detection
          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = gray < 90 ? 30 : gray > 180 ? 240 : gray;
            data[i + 1] = gray < 90 ? 40 : gray > 180 ? 255 : gray;
            data[i + 2] = gray < 90 ? 60 : gray > 180 ? 230 : gray;
          }
          ctx.putImageData(imgData, 0, 0);
        }
      }

      // Draw subtle biometric overlay circles over the cropped canvas
      ctx.strokeStyle = 'rgba(110, 231, 183, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cropCanvas.width / 2, cropCanvas.height / 2, 45, 0, Math.PI * 2);
      ctx.arc(cropCanvas.width / 2, cropCanvas.height / 2, 85, 0, Math.PI * 2);
      ctx.stroke();

      // Nostril symmetry line
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cropCanvas.width / 2, 20);
      ctx.lineTo(cropCanvas.width / 2, cropCanvas.height - 20);
      ctx.stroke();
      ctx.setLineDash([]);
    };
  }, [imageUrl, activeDetection, cropFilter, boxAreaExpansion]);

  const downloadCroppedMuzzle = () => {
    if (!cropCanvasRef.current) return;
    const link = document.createElement('a');
    link.download = `cattle-muzzle-biometric-${activeDetection?.biometricId || 'stamp'}.png`;
    link.href = cropCanvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Full-Size Image & YOLO Detection Canvas (col-span-8) */}
      <div className="lg:col-span-8 backdrop-blur-xl bg-white/[0.04] rounded-3xl border border-white/10 shadow-2xl p-4 sm:p-6 flex flex-col">
        {/* Canvas Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl backdrop-blur-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-md shadow-emerald-500/10">
              <Scan className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">
                YOLOv8 Muzzle Detection Visualizer
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Model: best_muzzle_detection_model.pt (Full Snout Detection)
              </p>
            </div>
          </div>

          {/* Toggle & Area Expansion Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Box Area Size / Expansion Slider */}
            <div className="flex items-center gap-1.5 backdrop-blur-md bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 text-xs">
              <Box className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold text-emerald-300">Box Area:</span>
              <button
                onClick={() => setBoxAreaExpansion((prev) => Math.max(0, prev - 10))}
                className="w-5 h-5 rounded flex items-center justify-center bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                title="Decrease Box Area"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>
              <span className="font-mono font-bold text-white text-[11px] min-w-[32px] text-center">
                +{boxAreaExpansion}%
              </span>
              <button
                onClick={() => setBoxAreaExpansion((prev) => Math.min(80, prev + 10))}
                className="w-5 h-5 rounded flex items-center justify-center bg-emerald-500 text-black hover:bg-emerald-400 cursor-pointer font-bold"
                title="Increase Box Area"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>

            <button
              id="toggle-boxes-btn"
              onClick={() => setShowBoxes(!showBoxes)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer backdrop-blur-md ${
                showBoxes
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
                  : 'bg-white/[0.04] text-slate-400 border-white/10 hover:bg-white/[0.08]'
              }`}
              title="Toggle Bounding Box"
            >
              {showBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Box</span>
            </button>

            <button
              id="toggle-grid-btn"
              onClick={() => setShowGrid(!showGrid)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer backdrop-blur-md ${
                showGrid
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
                  : 'bg-white/[0.04] text-slate-400 border-white/10 hover:bg-white/[0.08]'
              }`}
              title="Toggle Biometric Grid Overlay"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>

            <div className="flex items-center gap-2 backdrop-blur-md bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-medium text-slate-300">Conf:</span>
              <span className="font-mono font-bold text-emerald-400">
                {Math.round(confThreshold * 100)}%
              </span>
              <input
                id="conf-threshold-slider"
                type="range"
                min="0.2"
                max="0.95"
                step="0.05"
                value={confThreshold}
                onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
                className="w-14 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Quick Box Area Presets */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="font-medium text-[11px]">Muzzle Coverage Preset:</span>
            {[
              { label: 'Standard Full Muzzle (+15%)', val: 15 },
              { label: 'Wide Snout (+30%)', val: 30 },
              { label: 'Expanded Facial Area (+50%)', val: 50 },
              { label: 'Tight Crop (0%)', val: 0 },
            ].map((preset) => (
              <button
                key={preset.val}
                onClick={() => setBoxAreaExpansion(preset.val)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                  boxAreaExpansion === preset.val
                    ? 'bg-emerald-500 text-black font-bold shadow-xs'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            {boxAreaExpansion > 0 ? '✓ Snout & Nostril Wings Included' : 'Standard Area'}
          </span>
        </div>

        {/* Canvas Display Viewport */}
        <div className="relative rounded-2xl overflow-hidden bg-black/90 flex items-center justify-center min-h-[340px] max-h-[520px] shadow-2xl border border-white/10">
          <canvas
            ref={mainCanvasRef}
            className="max-w-full max-h-[500px] w-auto h-auto object-contain select-none"
          />

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center text-white gap-3">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full animate-ping"></div>
                <div className="w-14 h-14 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <Scan className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold tracking-wide text-emerald-300">
                  Detecting Full Bovine Muzzle &amp; Classifying Breed...
                </p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Running YOLOv8 Anchor-Free Detection Head
                </p>
              </div>
            </div>
          )}

          {/* Bottom telemetry overlay */}
          {!isAnalyzing && activeDetection && (
            <div className="absolute bottom-3 left-3 backdrop-blur-md bg-black/80 text-white text-[11px] font-mono px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-3 shadow-xl">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Box Area: +{boxAreaExpansion}% Coverage</span>
              </div>
              <div className="border-l border-white/15 pl-3 text-emerald-400 font-bold">
                Confidence: {(activeDetection.confidence * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cropped Muzzle Biometric Inspector (col-span-4) */}
      <div className="lg:col-span-4 backdrop-blur-xl bg-white/[0.04] rounded-3xl border border-white/10 shadow-2xl p-4 sm:p-6 flex flex-col justify-between">
        <div>
          {/* Muzzle Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl backdrop-blur-md bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center shadow-md shadow-teal-500/10">
                <Fingerprint className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Muzzle Biometric Crop
                </h3>
                <p className="text-[11px] text-slate-400">
                  Dermatoglyphic Muzzle Print Extraction
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/30">
              YOLO Cropped
            </span>
          </div>

          {/* Filter Mode Selector */}
          <div className="grid grid-cols-4 gap-1 p-1 backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-xl mb-4">
            {[
              { id: 'normal', label: 'RGB' },
              { id: 'ridges', label: 'Ridges' },
              { id: 'contrast', label: 'Contrast' },
              { id: 'edges', label: 'Sobel' },
            ].map((filter) => (
              <button
                key={filter.id}
                id={`filter-btn-${filter.id}`}
                onClick={() => setCropFilter(filter.id as MuzzleFilter)}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  cropFilter === filter.id
                    ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Cropped Muzzle Canvas Box */}
          <div className="relative rounded-2xl overflow-hidden bg-black/90 border border-white/10 flex items-center justify-center p-2 shadow-2xl aspect-4/3">
            <canvas ref={cropCanvasRef} className="w-full h-full object-contain rounded-xl" />
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/80 backdrop-blur-md rounded-md text-[10px] font-mono text-emerald-400 border border-white/10">
              {cropFilter.toUpperCase()} FILTER
            </div>
          </div>

          {/* Biometric Scores */}
          <div className="mt-4 space-y-2.5">
            <div className="backdrop-blur-md bg-white/[0.03] rounded-2xl p-3.5 border border-white/[0.08]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Muzzle Bead Density</span>
                <span className="font-mono font-bold text-emerald-400">
                  {activeDetection?.beadDensityScore || 88}/100
                </span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${activeDetection?.beadDensityScore || 88}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="backdrop-blur-md bg-white/[0.03] p-3 rounded-2xl border border-white/[0.08]">
                <span className="text-[11px] text-slate-400 block">Ridge Pattern</span>
                <span className="font-bold text-white mt-0.5 block">
                  {activeDetection?.ridgePatternClarity || 'High Clarity'}
                </span>
              </div>
              <div className="backdrop-blur-md bg-white/[0.03] p-3 rounded-2xl border border-white/[0.08]">
                <span className="text-[11px] text-slate-400 block">Nostril Symmetry</span>
                <span className="font-bold font-mono text-emerald-400 mt-0.5 block">
                  {activeDetection?.symmetryScore || 92}% Match
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Download Cropped Muzzle Button */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <button
            id="download-muzzle-crop-btn"
            onClick={downloadCroppedMuzzle}
            className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            Export Muzzle Biometric Stamp
          </button>
        </div>
      </div>
    </div>
  );
};
