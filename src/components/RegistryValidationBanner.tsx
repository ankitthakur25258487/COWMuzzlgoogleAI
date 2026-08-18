import React from 'react';
import { ShieldCheck, CheckCircle2, UserPlus, ArrowRightLeft, Sparkles } from 'lucide-react';
import { CowAnalysisResult } from '../types';

interface RegistryValidationBannerProps {
  analysis: CowAnalysisResult;
  onOpenComparison: () => void;
  onSaveToRegistry: () => void;
  isSaved: boolean;
}

export const RegistryValidationBanner: React.FC<RegistryValidationBannerProps> = ({
  analysis,
  onOpenComparison,
  onSaveToRegistry,
  isSaved,
}) => {
  const validation = analysis.registryValidation;

  if (!validation) return null;

  if (validation.isMatch && validation.matchedScan) {
    return (
      <div className="backdrop-blur-xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-teal-950/70 border-2 border-emerald-500/60 rounded-3xl p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold bg-emerald-500 text-black uppercase tracking-wider">
                Identity Verified in Registry
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {validation.similarityScore}% Biometric Concordance
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Matched Registered Bovine: {validation.matchedCowName} ({validation.matchedCowId})
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Unique muzzle ridge biometric patterns match record registered on{' '}
              {new Date(validation.matchedTimestamp || Date.now()).toLocaleDateString()}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={onOpenComparison}
            className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Compare Multi-Spectral Images</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-gradient-to-r from-teal-950/50 via-slate-900/60 to-emerald-950/40 border border-white/15 rounded-3xl p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-400/30 text-teal-300 flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/10">
          <ShieldCheck className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/10 text-teal-300 border border-white/15 uppercase tracking-wider">
              New Bovine Scan
            </span>
            <span className="text-xs text-slate-400 font-mono">
              YOLOv8 Muzzle Biometric Extracted
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-1">
            New Unregistered Bovine — Ready for Herd Registration
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            No prior match found in herd registry. Save this scan to store all multi-spectral crops (RGB, Ridges, Contrast, Sobel) into the permanent herd registry.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
        <button
          onClick={onSaveToRegistry}
          disabled={isSaved}
          className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
            isSaved
              ? 'bg-white/10 text-emerald-300 border border-emerald-500/40 cursor-default'
              : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
          }`}
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Saved in Herd Registry</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Save to Herd Registry</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
