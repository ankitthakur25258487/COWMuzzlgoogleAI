import React, { useState, useRef } from 'react';
import { Upload, Camera, Link, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface ImageUploadZoneProps {
  onImageSelected: (imageDataUrl: string, sourceName?: string) => void;
  isAnalyzing: boolean;
  activeImageUrl?: string | null;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onImageSelected,
  isAnalyzing,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onImageSelected(event.target.result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInputValue.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:')) {
      setUrlError('Please enter a valid web URL starting with https:// or http://');
      return;
    }

    setUrlError(null);
    onImageSelected(trimmed, 'Web Cattle Photo');
    setShowUrlInput(false);
    setUrlInputValue('');
  };

  // Camera integration
  const startCamera = async () => {
    setIsCameraActive(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please check browser permissions or upload an image.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      stopCamera();
      onImageSelected(dataUrl, 'Camera Snapshot');
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/[0.04] rounded-3xl border border-white/10 shadow-2xl p-5 sm:p-7 transition-all">
      {/* Upload Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Upload Cow Image for AI Classification &amp; YOLOv8 Detection
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify bovine breeds, analyze phenotypic traits, and detect muzzle biometrics with high accuracy.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="camera-open-btn"
            onClick={() => (isCameraActive ? stopCamera() : startCamera())}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isCameraActive ? 'Close Camera' : 'Live Camera'}</span>
          </button>

          <button
            id="url-toggle-btn"
            onClick={() => setShowUrlInput(!showUrlInput)}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Link className="w-3.5 h-3.5 text-slate-400" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {/* URL Input Bar */}
      {showUrlInput && (
        <div className="mb-4 space-y-2.5 backdrop-blur-md bg-white/[0.03] p-3.5 rounded-2xl border border-white/10">
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <input
              id="image-url-input"
              type="url"
              placeholder="Paste public cattle image URL (https://...)..."
              value={urlInputValue}
              onChange={(e) => setUrlInputValue(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl backdrop-blur-md bg-white/[0.06] border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!urlInputValue.trim() || isAnalyzing}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              Load &amp; Classify
            </button>
          </form>

          {urlError && (
            <p className="text-xs text-rose-400 mt-1">{urlError}</p>
          )}
        </div>
      )}

      {/* Live Camera View */}
      {isCameraActive && (
        <div className="mb-5 relative rounded-2xl overflow-hidden bg-black/80 border border-white/15 shadow-2xl">
          {cameraError ? (
            <div className="p-6 text-center text-rose-300 flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8 text-rose-400" />
              <p className="text-xs">{cameraError}</p>
              <button
                onClick={startCamera}
                className="mt-2 px-3 py-1.5 bg-rose-950/60 border border-rose-700/50 rounded-lg text-xs text-rose-200"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-h-80 object-cover bg-black"
              />
              <div className="absolute inset-0 pointer-events-none border-2 border-emerald-400/40 m-8 rounded-xl flex items-center justify-center">
                <div className="border border-dashed border-emerald-300/80 w-36 h-28 rounded-lg flex items-center justify-center">
                  <span className="text-[10px] text-emerald-200 bg-black/80 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                    Align Cow Muzzle
                  </span>
                </div>
              </div>
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer ring-4 ring-emerald-400/20"
                >
                  <Camera className="w-4 h-4" />
                  Capture Frame &amp; Detect
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-3.5 py-2 backdrop-blur-md bg-white/[0.1] hover:bg-white/[0.18] text-white text-xs font-medium rounded-full border border-white/10 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Drag & Drop Zone */}
      <div
        id="cow-dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-9 text-center transition-all cursor-pointer ${
          dragOver
            ? 'border-emerald-400 bg-emerald-500/10 scale-[0.99]'
            : 'border-white/15 hover:border-emerald-500/40 backdrop-blur-md bg-white/[0.02] hover:bg-emerald-500/[0.04]'
        } ${isAnalyzing ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl backdrop-blur-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            {isAnalyzing ? (
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
            ) : (
              <Upload className="w-6 h-6 text-emerald-400" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              {isAnalyzing ? (
                <span className="text-emerald-400">Running Machine Learning &amp; YOLOv8 Inference...</span>
              ) : (
                <>
                  <span className="text-emerald-400 font-bold">Click to upload</span> or drag and drop cattle image
                </>
              )}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports JPG, PNG, WEBP (Supports both close-up muzzle shots and full body cow photos)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
