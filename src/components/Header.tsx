import React from 'react';
import { Sparkles, Cpu, BookOpen, History, ShieldCheck, ExternalLink, Scan } from 'lucide-react';
import { YOLOv8ModelInfo } from '../types';

interface HeaderProps {
  modelInfo: YOLOv8ModelInfo | null;
  onOpenModelModal: () => void;
  onOpenEncyclopediaModal: () => void;
  onOpenHistoryDrawer: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  modelInfo,
  onOpenModelModal,
  onOpenEncyclopediaModal,
  onOpenHistoryDrawer,
  savedCount,
}) => {
  return (
    <header className="backdrop-blur-xl bg-[#0a110a]/80 border-b border-white/10 sticky top-0 z-30 shadow-lg shadow-black/20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
              <Scan className="w-6 h-6 text-black" strokeWidth={2.3} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  AI-Based Cow <span className="text-emerald-400">Muzzle Identification</span>
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                  v8.2 ML
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                YOLOv8 Biometric Ridge Detection &amp; Cattle Identification System
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* YOLOv8 Model Status Button */}
            <button
              id="model-details-btn"
              onClick={onOpenModelModal}
              className="inline-flex items-center space-x-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold backdrop-blur-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all duration-150 cursor-pointer shadow-xs"
              title="View Integrated YOLOv8 Model Weights & Specifications"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="hidden sm:inline font-mono">YOLOv8:</span>
              <span className="font-mono text-emerald-400 font-bold">muzzle.pt</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            {/* Cattle Breed Encyclopedia */}
            <button
              id="breed-encyclopedia-btn"
              onClick={onOpenEncyclopediaModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold backdrop-blur-md bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-150 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Breed Catalog</span>
              <span className="md:hidden">Breeds</span>
            </button>

            {/* Scans Registry History */}
            <button
              id="scans-history-btn"
              onClick={onOpenHistoryDrawer}
              className="relative inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold backdrop-blur-md bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-150 cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Herd Registry</span>
              {savedCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-black">
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
