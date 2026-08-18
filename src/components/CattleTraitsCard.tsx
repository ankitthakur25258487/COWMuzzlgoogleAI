import React, { useState } from 'react';
import {
  Activity,
  Milk,
  Sun,
  ShieldAlert,
  HeartPulse,
  Sparkles,
  Layers,
  Thermometer,
  Stethoscope,
} from 'lucide-react';
import { CowAnalysisResult } from '../types';

interface CattleTraitsCardProps {
  analysis: CowAnalysisResult;
}

export const CattleTraitsCard: React.FC<CattleTraitsCardProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<'morphology' | 'production' | 'health'>('morphology');
  const { physicalTraits, productionAndHealth, primaryBreed } = analysis;

  return (
    <div className="backdrop-blur-xl bg-white/[0.04] rounded-3xl border border-white/10 shadow-2xl p-5 sm:p-7 text-white">
      {/* Header with Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-white/10">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Cattle Morphological &amp; Production Profile
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed phenotypic evaluation, dairy/beef production capacity, and veterinary insights.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 backdrop-blur-md bg-white/[0.03] p-1 rounded-2xl border border-white/10">
          <button
            id="tab-morphology-btn"
            onClick={() => setActiveTab('morphology')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'morphology'
                ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            Physical Traits
          </button>

          <button
            id="tab-production-btn"
            onClick={() => setActiveTab('production')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'production'
                ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            Milk &amp; Yield
          </button>

          <button
            id="tab-health-btn"
            onClick={() => setActiveTab('health')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'health'
                ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            Climate &amp; Health
          </button>
        </div>
      </div>

      {/* Tab 1: Physical Morphology */}
      {activeTab === 'morphology' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          <div className="backdrop-blur-md bg-white/[0.03] rounded-2xl p-4 border border-white/[0.08]">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase font-mono mb-1">
              Coat Color &amp; Pattern
            </span>
            <span className="text-sm font-bold text-white block">
              {physicalTraits.coatColor || 'Standard Breed Pigmentation'}
            </span>
          </div>

          <div className="backdrop-blur-md bg-white/[0.03] rounded-2xl p-4 border border-white/[0.08]">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase font-mono mb-1">
              Horns Structure
            </span>
            <span className="text-sm font-bold text-white block">
              {physicalTraits.hornType || 'Curved Horns / Polled'}
            </span>
          </div>

          <div className="backdrop-blur-md bg-white/[0.03] rounded-2xl p-4 border border-white/[0.08]">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase font-mono mb-1">
              Shoulder Hump (Gibbosity)
            </span>
            <span className="text-sm font-bold text-emerald-400 block">
              {physicalTraits.humpSize || 'Moderate'}
            </span>
          </div>

          <div className="backdrop-blur-md bg-white/[0.03] rounded-2xl p-4 border border-white/[0.08]">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase font-mono mb-1">
              Dewlap &amp; Sheath Size
            </span>
            <span className="text-sm font-bold text-white block">
              {physicalTraits.dewlapSize || 'Moderate'}
            </span>
          </div>

          <div className="backdrop-blur-md bg-white/[0.03] rounded-2xl p-4 border border-white/[0.08]">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase font-mono mb-1">
              Ear Morphology
            </span>
            <span className="text-sm font-bold text-white block">
              {physicalTraits.earStructure || 'Medium horizontal ears'}
            </span>
          </div>

          <div className="backdrop-blur-md bg-white/[0.03] rounded-2xl p-4 border border-white/[0.08]">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase font-mono mb-1">
              Facial Profile &amp; Forehead
            </span>
            <span className="text-sm font-bold text-white block">
              {physicalTraits.facialProfile || 'Straight to slightly convex'}
            </span>
          </div>
        </div>
      )}

      {/* Tab 2: Production & Milk Metrics */}
      {activeTab === 'production' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="backdrop-blur-md bg-emerald-500/[0.06] rounded-2xl p-4.5 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Milk className="w-5 h-5 text-emerald-400" />
                <h4 className="text-xs font-bold text-emerald-300 uppercase font-mono">
                  Estimated Milk Yield (Per Lactation)
                </h4>
              </div>
              <p className="text-xl font-extrabold text-white font-mono">
                {productionAndHealth.estimatedMilkYieldPerLactation || '2,500 - 4,500 kg / lactation'}
              </p>
              <p className="text-[11px] text-emerald-300/80 mt-1">
                Typical lactation period: 305 days under standard farm management.
              </p>
            </div>

            <div className="backdrop-blur-md bg-amber-500/[0.06] rounded-2xl p-4.5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h4 className="text-xs font-bold text-amber-300 uppercase font-mono">
                  Milk Fat &amp; Solids Content
                </h4>
              </div>
              <p className="text-xl font-extrabold text-amber-300 font-mono">
                {productionAndHealth.milkFatPercentage || '4.2% - 4.8% Fat'}
              </p>
              <p className="text-[11px] text-amber-300/80 mt-1">
                {primaryBreed.speciesType.includes('Bos indicus')
                  ? 'Rich in A2 Beta-Casein protein variants, prized for easy digestion.'
                  : 'High protein to butterfat ratio suitable for fluid milk and cheese.'}
              </p>
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/[0.03] rounded-2xl p-4 border border-white/[0.08] text-xs text-slate-300 flex items-center justify-between">
            <span className="font-semibold text-slate-400">Primary Agricultural Purpose:</span>
            <span className="font-bold text-white px-3 py-1 bg-white/[0.08] rounded-xl border border-white/10 shadow-xs">
              {primaryBreed.purpose}
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: Climate Resilience & Health Care */}
      {activeTab === 'health' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="backdrop-blur-md bg-white/[0.03] p-4 rounded-2xl border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-2 text-slate-300">
                <Thermometer className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase font-mono">Climate Resilience</span>
              </div>
              <p className="text-xs font-medium text-slate-200">
                {productionAndHealth.climateTolerance}
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/[0.03] p-4 rounded-2xl border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-2 text-slate-300">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase font-mono">Tick / Pest Immunity</span>
              </div>
              <p className="text-xs font-bold text-emerald-400">
                {productionAndHealth.tickDiseaseResistance} Resistance
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/[0.03] p-4 rounded-2xl border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-2 text-slate-300">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold uppercase font-mono">Temperament</span>
              </div>
              <p className="text-xs font-medium text-slate-200">
                {productionAndHealth.temperament}
              </p>
            </div>
          </div>

          {/* Veterinary and feeding guidelines */}
          {productionAndHealth.recommendedCare && productionAndHealth.recommendedCare.length > 0 && (
            <div className="backdrop-blur-md bg-white/[0.03] rounded-2xl p-4.5 border border-white/[0.08]">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                Recommended Management &amp; Nutrition Guidelines
              </h4>
              <ul className="space-y-2">
                {productionAndHealth.recommendedCare.map((care, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{care}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
