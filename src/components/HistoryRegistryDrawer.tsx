import React, { useState } from 'react';
import { X, Trash2, Download, History, ExternalLink, ShieldCheck, ChevronRight, Layers, Eye } from 'lucide-react';
import { CowAnalysisResult } from '../types';

interface HistoryRegistryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedScans: CowAnalysisResult[];
  onSelectScan: (scan: CowAnalysisResult) => void;
  onDeleteScan: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryRegistryDrawer: React.FC<HistoryRegistryDrawerProps> = ({
  isOpen,
  onClose,
  savedScans,
  onSelectScan,
  onDeleteScan,
  onClearAll,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const exportRegistryJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedScans, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cattle_herd_biometric_registry_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg backdrop-blur-2xl bg-[#0a110a]/95 text-white border-l border-white/15 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl backdrop-blur-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Herd Biometric Registry</h3>
                <p className="text-xs text-slate-400 font-mono">
                  {savedScans.length} Registered Bovine Biometric Profiles
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {savedScans.map((scan) => {
              const isExpanded = expandedId === scan.id;
              const crops = scan.spectralCrops;

              return (
                <div
                  key={scan.id}
                  className="backdrop-blur-md bg-white/[0.03] rounded-2xl border border-white/10 p-4 hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all flex flex-col gap-3 shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={crops?.ridges || scan.imageUrl}
                      alt={scan.primaryBreed.breed}
                      className="w-16 h-16 rounded-xl object-cover bg-black/40 border border-emerald-500/30 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-white truncate">
                          {scan.primaryBreed.breed}
                        </h4>
                        <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          {Math.round((scan.primaryBreed.confidence || 0.9) * 100)}%
                        </span>
                      </div>

                      <p className="text-xs font-mono font-semibold text-emerald-300 truncate mt-0.5">
                        {scan.biometricPassport.uniqueCattleId}
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                        <span>{new Date(scan.timestamp).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-emerald-400">6 Multi-Spectral Images</span>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Spectral 4-Filter Thumbnails Row */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Saved Biometric Modalities:</span>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : scan.id)}
                        className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Gallery' : 'View All 6 Images'}</span>
                        <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div
                        onClick={() => setExpandedId(scan.id)}
                        className="relative aspect-4/3 rounded-lg overflow-hidden bg-black/80 border border-white/10 cursor-pointer group"
                      >
                        <img
                          src={crops?.rgb || scan.imageUrl}
                          alt="RGB"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] font-mono text-center text-slate-300 py-0.5">
                          RGB
                        </div>
                      </div>

                      <div
                        onClick={() => setExpandedId(scan.id)}
                        className="relative aspect-4/3 rounded-lg overflow-hidden bg-black/80 border border-emerald-500/40 cursor-pointer group"
                      >
                        <img
                          src={crops?.ridges || scan.imageUrl}
                          alt="Ridges"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] font-mono text-center text-emerald-400 py-0.5">
                          Ridges
                        </div>
                      </div>

                      <div
                        onClick={() => setExpandedId(scan.id)}
                        className="relative aspect-4/3 rounded-lg overflow-hidden bg-black/80 border border-white/10 cursor-pointer group"
                      >
                        <img
                          src={crops?.contrast || scan.imageUrl}
                          alt="Contrast"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] font-mono text-center text-slate-300 py-0.5">
                          Contrast
                        </div>
                      </div>

                      <div
                        onClick={() => setExpandedId(scan.id)}
                        className="relative aspect-4/3 rounded-lg overflow-hidden bg-black/80 border border-white/10 cursor-pointer group"
                      >
                        <img
                          src={crops?.sobel || scan.imageUrl}
                          alt="Sobel"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] font-mono text-center text-slate-300 py-0.5">
                          Sobel
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Multi-Spectral Inspector */}
                  {isExpanded && (
                    <div className="p-3 bg-black/60 rounded-xl border border-white/10 space-y-3 animate-in fade-in duration-200">
                      <div className="text-xs font-bold text-emerald-300 flex items-center justify-between">
                        <span>Stored Multi-Spectral Image Bundle</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          ID: {scan.biometricPassport.uniqueCattleId}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        {/* 1. Raw Uploaded */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono text-slate-400">1. Original Upload:</div>
                          <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-black/90 border border-white/10">
                            <img src={scan.imageUrl} alt="Raw" className="w-full h-full object-contain" />
                          </div>
                          <button
                            onClick={() => downloadImage(scan.imageUrl, `cattle-${scan.biometricPassport.uniqueCattleId}-raw.jpg`)}
                            className="w-full py-1 text-[10px] font-mono bg-white/5 hover:bg-white/10 rounded text-slate-300 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Download className="w-2.5 h-2.5" /> Raw Image
                          </button>
                        </div>

                        {/* 2. Annotated */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono text-slate-400">2. YOLOv8 Annotated:</div>
                          <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-black/90 border border-white/10">
                            <img src={scan.annotatedImageUrl || scan.imageUrl} alt="Annotated" className="w-full h-full object-contain" />
                          </div>
                          <button
                            onClick={() => downloadImage(scan.annotatedImageUrl || scan.imageUrl, `cattle-${scan.biometricPassport.uniqueCattleId}-annotated.jpg`)}
                            className="w-full py-1 text-[10px] font-mono bg-white/5 hover:bg-white/10 rounded text-slate-300 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Download className="w-2.5 h-2.5" /> Annotated
                          </button>
                        </div>

                        {/* 3. RGB Crop */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono text-slate-400">3. Cropped RGB:</div>
                          <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-black/90 border border-white/10">
                            <img src={crops?.rgb || scan.imageUrl} alt="RGB" className="w-full h-full object-contain" />
                          </div>
                          <button
                            onClick={() => downloadImage(crops?.rgb || scan.imageUrl, `cattle-${scan.biometricPassport.uniqueCattleId}-crop-rgb.jpg`)}
                            className="w-full py-1 text-[10px] font-mono bg-white/5 hover:bg-white/10 rounded text-slate-300 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Download className="w-2.5 h-2.5" /> RGB Crop
                          </button>
                        </div>

                        {/* 4. Ridges Crop */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono text-emerald-400 font-bold">4. Ridge Enhanced:</div>
                          <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-black/90 border border-emerald-500/40">
                            <img src={crops?.ridges || scan.imageUrl} alt="Ridges" className="w-full h-full object-contain" />
                          </div>
                          <button
                            onClick={() => downloadImage(crops?.ridges || scan.imageUrl, `cattle-${scan.biometricPassport.uniqueCattleId}-ridges.png`)}
                            className="w-full py-1 text-[10px] font-mono bg-emerald-500/20 hover:bg-emerald-500/30 rounded text-emerald-300 flex items-center justify-center gap-1 cursor-pointer font-bold"
                          >
                            <Download className="w-2.5 h-2.5" /> Ridges Stamp
                          </button>
                        </div>

                        {/* 5. Contrast Crop */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono text-slate-400">5. CLAHE Contrast:</div>
                          <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-black/90 border border-white/10">
                            <img src={crops?.contrast || scan.imageUrl} alt="Contrast" className="w-full h-full object-contain" />
                          </div>
                          <button
                            onClick={() => downloadImage(crops?.contrast || scan.imageUrl, `cattle-${scan.biometricPassport.uniqueCattleId}-contrast.jpg`)}
                            className="w-full py-1 text-[10px] font-mono bg-white/5 hover:bg-white/10 rounded text-slate-300 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Download className="w-2.5 h-2.5" /> Contrast
                          </button>
                        </div>

                        {/* 6. Sobel Crop */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono text-slate-400">6. Sobel Gradient:</div>
                          <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-black/90 border border-white/10">
                            <img src={crops?.sobel || scan.imageUrl} alt="Sobel" className="w-full h-full object-contain" />
                          </div>
                          <button
                            onClick={() => downloadImage(crops?.sobel || scan.imageUrl, `cattle-${scan.biometricPassport.uniqueCattleId}-sobel.png`)}
                            className="w-full py-1 text-[10px] font-mono bg-white/5 hover:bg-white/10 rounded text-slate-300 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Download className="w-2.5 h-2.5" /> Sobel Edge
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2.5 border-t border-white/10 text-xs">
                    <button
                      onClick={() => {
                        onSelectScan(scan);
                        onClose();
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Load into Biometric Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteScan(scan.id)}
                      className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {savedScans.length === 0 && (
              <div className="py-16 text-center text-slate-400">
                <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No Cattle Registered Yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Upload an image and click "Save All Images to Herd Registry" to maintain a permanent biometric cattle catalog with all 6 multi-spectral image modalities.
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {savedScans.length > 0 && (
            <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={exportRegistryJSON}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <Download className="w-3.5 h-3.5 text-black" />
                Export Full Registry (JSON)
              </button>

              <button
                onClick={onClearAll}
                className="px-3.5 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

