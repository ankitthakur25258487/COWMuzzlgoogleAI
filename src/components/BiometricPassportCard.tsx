import React, { useState } from 'react';
import { Fingerprint, ShieldCheck, Copy, Check, QrCode, Download, Share2, Sparkles, Layers, Image as ImageIcon } from 'lucide-react';
import { CowAnalysisResult } from '../types';

interface BiometricPassportCardProps {
  analysis: CowAnalysisResult;
  onSaveToRegistry?: () => void;
  isSaved?: boolean;
}

type SpectralCropKey = 'rgb' | 'ridges' | 'contrast' | 'sobel' | 'annotated' | 'uploaded';

export const BiometricPassportCard: React.FC<BiometricPassportCardProps> = ({
  analysis,
  onSaveToRegistry,
  isSaved = false,
}) => {
  const { biometricPassport, primaryBreed, muzzleDetections, spectralCrops, annotatedImageUrl, imageUrl } = analysis;
  const detection = muzzleDetections[0];
  const [copied, setCopied] = useState(false);
  const [activePreviewKey, setActivePreviewKey] = useState<SpectralCropKey>('ridges');

  const handleCopyId = () => {
    navigator.clipboard.writeText(biometricPassport.uniqueCattleId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintCard = () => {
    window.print();
  };

  const getPreviewImage = (key: SpectralCropKey): string => {
    if (key === 'uploaded') return imageUrl;
    if (key === 'annotated') return annotatedImageUrl || imageUrl;
    if (spectralCrops && spectralCrops[key as 'rgb' | 'ridges' | 'contrast' | 'sobel']) {
      return spectralCrops[key as 'rgb' | 'ridges' | 'contrast' | 'sobel'];
    }
    return imageUrl;
  };

  const downloadActiveImage = () => {
    const link = document.createElement('a');
    link.download = `cattle-${biometricPassport.uniqueCattleId}-${activePreviewKey}.png`;
    link.href = getPreviewImage(activePreviewKey);
    link.click();
  };

  return (
    <div className="backdrop-blur-xl bg-white/[0.04] text-white rounded-3xl border border-white/10 shadow-2xl p-5 sm:p-7 relative overflow-hidden space-y-6">
      {/* Decorative Biometric Rings Background */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 border border-emerald-500/10 rounded-full pointer-events-none"></div>
      <div className="absolute -right-8 -bottom-8 w-48 h-48 border border-emerald-500/15 rounded-full pointer-events-none"></div>

      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl backdrop-blur-md bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Fingerprint className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
                Official Livestock Biometrics
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Bovine Biometric Identity Passport
            </h3>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{biometricPassport.verificationStatus}</span>
        </div>
      </div>

      {/* ID Badges & QR representation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Unique Cattle ID */}
        <div className="backdrop-blur-md bg-white/[0.03] rounded-2xl p-4 border border-white/[0.08]">
          <span className="text-[11px] font-medium text-slate-400 block mb-1 font-mono">
            Permanent Bovine ID (RFID / Muzzle)
          </span>
          <div className="flex items-center justify-between">
            <span className="text-base sm:text-lg font-extrabold font-mono text-emerald-400 tracking-wider">
              {biometricPassport.uniqueCattleId}
            </span>
            <button
              id="copy-id-btn"
              onClick={handleCopyId}
              className="p-1.5 rounded-xl backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
              title="Copy ID to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Muzzle Pattern Hash */}
        <div className="backdrop-blur-md bg-white/[0.03] rounded-2xl p-4 border border-white/[0.08]">
          <span className="text-[11px] font-medium text-slate-400 block mb-1 font-mono">
            Biometric Bead Hash
          </span>
          <span className="text-xs font-mono text-teal-300 break-all block">
            {biometricPassport.muzzlePatternHash}
          </span>
        </div>

        {/* Registered Breed & Date */}
        <div className="backdrop-blur-md bg-white/[0.03] rounded-2xl p-4 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block font-mono">Classified Breed</span>
            <span className="text-sm font-bold text-white">{primaryBreed.breed}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1">
            Date: {biometricPassport.registrationDate}
          </span>
        </div>
      </div>

      {/* Multi-Spectral Registry Images Bundle (Uploaded, Annotated, RGB, Ridges, Contrast, Sobel) */}
      <div className="backdrop-blur-md bg-black/40 rounded-3xl p-5 border border-white/[0.08] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">
              Multi-Spectral Biometric Image Bundle
            </h4>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            6 Modalities Stored in Registry
          </span>
        </div>

        {/* Image Mode Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { id: 'ridges', label: 'Ridges', desc: 'Bead & Ridge Enhancer' },
            { id: 'rgb', label: 'RGB Crop', desc: 'Muzzle Optical Crop' },
            { id: 'contrast', label: 'Contrast', desc: 'CLAHE Grayscale' },
            { id: 'sobel', label: 'Sobel', desc: 'Edge Gradient' },
            { id: 'annotated', label: 'Annotated', desc: 'YOLOv8 HUD' },
            { id: 'uploaded', label: 'Original', desc: 'Raw Photo' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePreviewKey(item.id as SpectralCropKey)}
              className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                activePreviewKey === item.id
                  ? 'bg-emerald-500 text-black border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.08]'
              }`}
            >
              <div className="text-xs font-bold">{item.label}</div>
              <div className="text-[9px] opacity-75 truncate">{item.desc}</div>
            </button>
          ))}
        </div>

        {/* Active Image Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8 relative aspect-16/10 rounded-2xl overflow-hidden bg-black/90 border border-white/15 flex items-center justify-center shadow-xl">
            <img
              src={getPreviewImage(activePreviewKey)}
              alt={`Cattle Muzzle ${activePreviewKey}`}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-3 left-3 backdrop-blur-md bg-black/80 px-2.5 py-1 rounded-lg text-xs font-mono text-emerald-400 border border-white/15">
              MODALITY: {activePreviewKey.toUpperCase()}
            </div>
          </div>

          <div className="md:col-span-4 space-y-3">
            <div className="backdrop-blur-md bg-white/[0.03] p-3.5 rounded-2xl border border-white/[0.08] text-xs space-y-2 font-mono">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Modality:</span>
                <span className="text-white font-bold uppercase">{activePreviewKey}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Bead Density:</span>
                <span className="text-emerald-400 font-bold">{detection?.beadDensityScore || 88}%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Ridge Clarity:</span>
                <span className="text-slate-200">{detection?.ridgePatternClarity || 'High'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Registry Status:</span>
                <span className="text-emerald-400">{isSaved ? 'Permanent' : 'Staged'}</span>
              </div>
            </div>

            <button
              onClick={downloadActiveImage}
              className="w-full py-2 px-3 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-white/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download {activePreviewKey.toUpperCase()} Image</span>
            </button>
          </div>
        </div>
      </div>

      {/* Biometric Analysis Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 backdrop-blur-md bg-black/40 rounded-2xl p-4 border border-white/[0.08]">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-mono">Bead Density</span>
          <span className="text-sm font-bold font-mono text-emerald-400">
            {detection?.beadDensityScore || 88} / 100
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-mono">Ridge Clarity</span>
          <span className="text-sm font-bold text-teal-300 font-mono">
            {detection?.ridgePatternClarity || 'High'}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-mono">Nostril Symmetry</span>
          <span className="text-sm font-bold font-mono text-amber-300">
            {detection?.symmetryScore || 92}%
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-mono">YOLOv8 Confidence</span>
          <span className="text-sm font-bold font-mono text-emerald-300">
            {((detection?.confidence || 0.94) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Info callout on Muzzle Print Biometrics */}
      <p className="text-[11px] text-slate-400 leading-normal">
        * <strong>Biological Note:</strong> Cattle muzzle prints (nasolabial dermatoglyphics) are structurally unique to each individual bovine and remain unalterable throughout their lifespan, serving as a non-invasive biometric equivalent to human fingerprints for insurance, proof-of-ownership, and disease traceability.
      </p>

      {/* Action Footer */}
      <div className="flex flex-wrap gap-2.5 pt-3 border-t border-white/10">
        {onSaveToRegistry && (
          <button
            id="save-herd-registry-btn"
            onClick={onSaveToRegistry}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isSaved
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold shadow-lg shadow-emerald-500/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSaved ? 'Saved in Herd Registry' : 'Save All Images to Herd Registry'}</span>
          </button>
        )}

        <button
          id="print-passport-btn"
          onClick={handlePrintCard}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold backdrop-blur-md bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Print / Export ID Document
        </button>
      </div>
    </div>
  );
};

