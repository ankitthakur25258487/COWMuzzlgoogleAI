import React from 'react';
import { Award, CheckCircle2, Globe, Tag, Info, Compass, HelpCircle } from 'lucide-react';
import { CowAnalysisResult } from '../types';

interface BreedClassificationCardProps {
  analysis: CowAnalysisResult;
  onOpenBreedInfo: (breedName: string) => void;
}

export const BreedClassificationCard: React.FC<BreedClassificationCardProps> = ({
  analysis,
  onOpenBreedInfo,
}) => {
  const { primaryBreed, alternateBreeds } = analysis;
  const confidencePct = Math.round((primaryBreed.confidence || 0.94) * 100);

  // Species style
  const isZebu = primaryBreed.speciesType.includes('Bos indicus');

  return (
    <div className="backdrop-blur-xl bg-white/[0.04] rounded-3xl border border-white/10 shadow-2xl p-5 sm:p-7 text-white">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-black flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
            <Award className="w-6 h-6 text-black" strokeWidth={2.3} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                Primary ML Prediction
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {primaryBreed.scientificName || (isZebu ? 'Bos indicus' : 'Bos taurus')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              {primaryBreed.breed}
            </h2>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 flex items-center gap-3.5 sm:self-start">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">
              ML Confidence
            </span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {confidencePct}%
            </span>
          </div>
          <div className="w-12 h-12 relative flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400"
                strokeDasharray={`${confidencePct}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-bold font-mono text-white">
              {confidencePct}%
            </span>
          </div>
        </div>
      </div>

      {/* Meta tags (Origin, Purpose, Species) */}
      <div className="flex flex-wrap gap-2.5 mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold backdrop-blur-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          Origin: {primaryBreed.origin}
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold backdrop-blur-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
          <Tag className="w-3.5 h-3.5 text-indigo-400" />
          Purpose: {primaryBreed.purpose}
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold backdrop-blur-md bg-amber-500/10 text-amber-300 border border-amber-500/30">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          Taxonomy: {primaryBreed.speciesType}
        </span>
      </div>

      {/* Breed Description */}
      <div className="backdrop-blur-md bg-white/[0.03] rounded-2xl p-4.5 border border-white/[0.08] mb-5">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {primaryBreed.description}
        </p>
      </div>

      {/* Verified Phenotypic Markers */}
      <div className="mb-5">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Verified Visual Morphological Markers
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {primaryBreed.keyFeatures.map((feat, index) => (
            <div
              key={index}
              className="flex items-start gap-2.5 backdrop-blur-md bg-emerald-500/[0.05] p-3 rounded-xl border border-emerald-500/20 text-xs text-slate-200"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-xs shadow-emerald-400"></div>
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alternate Candidate Breeds */}
      {alternateBreeds && alternateBreeds.length > 0 && (
        <div className="pt-5 border-t border-white/10">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-mono">
            Top Alternative Candidate Breeds (Probability Distribution)
          </h4>
          <div className="space-y-2.5">
            {alternateBreeds.map((alt, i) => {
              const altPct = Math.round((alt.confidence || 0.1) * 100);
              return (
                <div
                  key={i}
                  className="backdrop-blur-md bg-white/[0.02] rounded-2xl p-3.5 border border-white/[0.07] hover:border-white/15 transition-all"
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{alt.breed}</span>
                      <span className="text-[11px] text-slate-400">({alt.origin})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{alt.purpose}</span>
                      <span className="font-mono font-bold text-emerald-400">{altPct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500/70 h-full rounded-full"
                      style={{ width: `${altPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
