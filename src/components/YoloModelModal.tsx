import React from 'react';
import { X, ExternalLink, Cpu, Database, CheckCircle2, Shield, Layers, FileCode2, Download } from 'lucide-react';
import { YOLOv8ModelInfo } from '../types';

interface YoloModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelInfo: YOLOv8ModelInfo | null;
}

export const YoloModelModal: React.FC<YoloModelModalProps> = ({
  isOpen,
  onClose,
  modelInfo,
}) => {
  if (!isOpen) return null;

  const driveUrl = modelInfo?.googleDriveUrl || "https://drive.google.com/file/d/1fRoOOv7zmERFV0iBJCnBHfqSek2_hc55/view?usp=drive_link";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="backdrop-blur-2xl bg-[#0a110a]/95 text-white rounded-3xl border border-white/15 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-[#0a110a]/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl backdrop-blur-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                YOLOv8 Cattle Muzzle Model Specifications
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Integrated Weights: best_muzzle_detection_model.pt
              </p>
            </div>
          </div>

          <button
            id="close-model-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-slate-200 text-xs sm:text-sm">
          {/* Status Banner */}
          <div className="backdrop-blur-md bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/30 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-emerald-300 block text-sm font-mono">
                Model Loaded &amp; Active
              </span>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                The custom trained YOLOv8 weights file has been synchronized and integrated for cattle muzzle localization and biometric segmentation.
              </p>
            </div>
          </div>

          {/* Model Attributes Table */}
          <div className="backdrop-blur-md bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-3.5 bg-white/[0.04] border-b border-white/10 font-bold text-xs text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Trained Model Architecture &amp; Parameters
            </div>
            <div className="divide-y divide-white/[0.08] text-xs">
              <div className="p-3.5 grid grid-cols-3 gap-2">
                <span className="font-semibold text-slate-400">Model Name:</span>
                <span className="col-span-2 font-mono font-bold text-white">
                  {modelInfo?.name || 'YOLOv8 Cattle Muzzle Detector'}
                </span>
              </div>

              <div className="p-3.5 grid grid-cols-3 gap-2">
                <span className="font-semibold text-slate-400">Weights File:</span>
                <span className="col-span-2 font-mono font-bold text-emerald-400">
                  best_muzzle_detection_model.pt ({modelInfo?.sizeFormatted || '6.22 MB'})
                </span>
              </div>

              <div className="p-3.5 grid grid-cols-3 gap-2">
                <span className="font-semibold text-slate-400">Google Drive Source:</span>
                <div className="col-span-2 flex items-center gap-2">
                  <a
                    href={driveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-bold font-mono underline inline-flex items-center gap-1"
                  >
                    <span>View on Google Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="p-3.5 grid grid-cols-3 gap-2">
                <span className="font-semibold text-slate-400">Architecture:</span>
                <span className="col-span-2 text-slate-300">
                  YOLOv8 Nano (CSPDarknet with C2f feature modules &amp; Decoupled Anchor-Free Detection Head)
                </span>
              </div>

              <div className="p-3.5 grid grid-cols-3 gap-2">
                <span className="font-semibold text-slate-400">Input Resolution:</span>
                <span className="col-span-2 font-mono text-slate-300">
                  640 x 640 x 3 (RGB Standard)
                </span>
              </div>

              <div className="p-3.5 grid grid-cols-3 gap-2">
                <span className="font-semibold text-slate-400">Detection Classes:</span>
                <span className="col-span-2 font-mono text-slate-300">
                  Class 0: <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-lg border border-emerald-500/30 font-bold">muzzle</span> (Cow Snout / Rhinarium)
                </span>
              </div>

              <div className="p-3.5 grid grid-cols-3 gap-2">
                <span className="font-semibold text-slate-400">Loss Functions:</span>
                <span className="col-span-2 text-slate-300 font-mono text-[11px]">
                  TaskAlignedAssigner (CIoU Box Loss + DFL Distribution Focal Loss + BCE Cls Loss)
                </span>
              </div>
            </div>
          </div>

          {/* Biological Background */}
          <div className="backdrop-blur-md bg-white/[0.03] rounded-2xl p-4.5 border border-white/[0.08] space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Shield className="w-4 h-4 text-teal-400" />
              Why Cattle Muzzle Biometrics?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Much like human fingerprints, the bead and groove patterns on a cow's muzzle (nasolabial dermatoglyphics) are 100% unique to each animal and remain invariant across its lifetime. Using YOLOv8 to automatically detect, crop, and normalize the muzzle region enables non-invasive, tamper-proof livestock identification, cattle insurance verification, and pedigree tracking without stressful ear tagging or branding.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5 bg-black/40 rounded-b-3xl">
          <div className="flex items-center gap-2">
            <a
              href="/api/download-model"
              download="best_muzzle_detection_model.pt"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              Download .pt Weights
            </a>

            <a
              href={driveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2.5 backdrop-blur-md bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              Google Drive
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2.5 backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
