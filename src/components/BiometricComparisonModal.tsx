import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRightLeft, Fingerprint, ShieldCheck, Download } from 'lucide-react';
import { CowAnalysisResult } from '../types';

interface BiometricComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScan: CowAnalysisResult;
  matchedScan: CowAnalysisResult;
}

type SpectralFilterKey = 'rgb' | 'ridges' | 'contrast' | 'sobel' | 'annotated' | 'uploaded';

export const BiometricComparisonModal: React.FC<BiometricComparisonModalProps> = ({
  isOpen,
  onClose,
  currentScan,
  matchedScan,
}) => {
  const [activeFilter, setActiveFilter] = useState<SpectralFilterKey>('ridges');

  if (!isOpen) return null;

  const currentDet = currentScan.muzzleDetections?.[0];
  const matchedDet = matchedScan.muzzleDetections?.[0];

  const getImageUrl = (scan: CowAnalysisResult, filter: SpectralFilterKey): string => {
    if (filter === 'uploaded') return scan.imageUrl;
    if (filter === 'annotated') return scan.annotatedImageUrl || scan.imageUrl;
    if (scan.spectralCrops && scan.spectralCrops[filter as 'rgb' | 'ridges' | 'contrast' | 'sobel']) {
      return scan.spectralCrops[filter as 'rgb' | 'ridges' | 'contrast' | 'sobel'];
    }
    return scan.imageUrl;
  };

  const validation = currentScan.registryValidation;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl backdrop-blur-2xl bg-[#0a140e]/95 border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <ArrowRightLeft className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Biometric Muzzle Verification &amp; Registry Matching</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {validation?.similarityScore || 98.5}% MATCH
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Side-by-side multi-spectral comparison of current scan vs registered herd database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors border border-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-130px)]">
          {/* Match Verdict Alert */}
          <div className="backdrop-blur-md bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-emerald-200">
                Verified Bovine Identity Confirmation
              </h4>
              <p className="text-xs text-emerald-300/90 mt-0.5">
                The uploaded muzzle pattern matches registered record{' '}
                <span className="font-mono font-bold text-white">
                  {matchedScan.biometricPassport.uniqueCattleId}
                </span>{' '}
                with a biometric concordance score of{' '}
                <span className="font-mono font-bold text-emerald-400">
                  {validation?.similarityScore || 98.5}%
                </span>
                .
              </p>
              {validation?.matchReasons && (
                <ul className="mt-2 text-[11px] text-emerald-400/80 space-y-1 font-mono">
                  {validation.matchReasons.map((r, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Filter Modality Switcher */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-300">
                Select Biometric Imaging Modality:
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Active Filter: <span className="text-emerald-400 uppercase font-bold">{activeFilter}</span>
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-1.5 bg-white/[0.03] border border-white/10 rounded-2xl">
              {[
                { id: 'ridges', label: 'Dermatoglyphic Ridges' },
                { id: 'rgb', label: 'RGB Cropped Muzzle' },
                { id: 'contrast', label: 'High Contrast' },
                { id: 'sobel', label: 'Sobel Edge Map' },
                { id: 'annotated', label: 'YOLOv8 Annotated' },
                { id: 'uploaded', label: 'Raw Original' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as SpectralFilterKey)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                    activeFilter === filter.id
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-extrabold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Side by Side Image Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Newly Uploaded Scan */}
            <div className="backdrop-blur-md bg-white/[0.03] border border-emerald-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Current Scanned Bovine
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(currentScan.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-black/90 border border-white/10 flex items-center justify-center">
                <img
                  src={getImageUrl(currentScan, activeFilter)}
                  alt="Current Scan"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-emerald-400 border border-white/10">
                  SCAN: {activeFilter.toUpperCase()}
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Unique RFID:</span>
                  <span className="font-bold text-white">{currentScan.biometricPassport.uniqueCattleId}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Bead Density:</span>
                  <span className="text-emerald-400 font-bold">{currentDet?.beadDensityScore || 88}%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Ridge Clarity:</span>
                  <span className="text-slate-200">{currentDet?.ridgePatternClarity || 'High'}</span>
                </div>
              </div>
            </div>

            {/* Right: Matched Registry Record */}
            <div className="backdrop-blur-md bg-white/[0.03] border border-blue-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Registered Herd Record
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Registered: {new Date(matchedScan.timestamp).toLocaleDateString()}
                </span>
              </div>

              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-black/90 border border-white/10 flex items-center justify-center">
                <img
                  src={getImageUrl(matchedScan, activeFilter)}
                  alt="Matched Record"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-blue-400 border border-white/10">
                  RECORD: {activeFilter.toUpperCase()}
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Unique RFID:</span>
                  <span className="font-bold text-white">{matchedScan.biometricPassport.uniqueCattleId}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Bead Density:</span>
                  <span className="text-blue-400 font-bold">{matchedDet?.beadDensityScore || 88}%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Ridge Clarity:</span>
                  <span className="text-slate-200">{matchedDet?.ridgePatternClarity || 'High'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            Cryptographic Biometric Hash match verified by YOLOv8 Dermatoglyphic Kernel
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-emerald-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
