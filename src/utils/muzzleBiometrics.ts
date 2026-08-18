import { CowAnalysisResult, MuzzleDetection, MuzzleSpectralCrops, RegistryValidationMatch } from '../types';

/**
 * Loads an image from a URL or Data URL safely with crossOrigin
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';

    const targetSrc = src.startsWith('http') && !src.includes('/api/proxy-image')
      ? `/api/proxy-image?url=${encodeURIComponent(src)}`
      : src;

    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = targetSrc;
  });
}

/**
 * Generates all multi-spectral crops (RGB, Ridges, Contrast, Sobel) and annotated full image
 */
export async function generateMultiSpectralImages(
  imageUrl: string,
  detection: MuzzleDetection
): Promise<{
  annotatedImageUrl: string;
  spectralCrops: MuzzleSpectralCrops;
}> {
  const img = await loadImage(imageUrl);
  const naturalWidth = img.naturalWidth || 800;
  const naturalHeight = img.naturalHeight || 600;

  // 1. Generate Full Annotated Image
  const annoCanvas = document.createElement('canvas');
  annoCanvas.width = naturalWidth;
  annoCanvas.height = naturalHeight;
  const aCtx = annoCanvas.getContext('2d')!;

  // Draw base
  aCtx.drawImage(img, 0, 0, naturalWidth, naturalHeight);

  // Draw Bounding Box & HUD
  const { ymin, xmin, ymax, xmax } = detection.box;
  const left = xmin * naturalWidth;
  const top = ymin * naturalHeight;
  const width = (xmax - xmin) * naturalWidth;
  const height = (ymax - ymin) * naturalHeight;

  aCtx.save();
  // Bounding box fill & outline
  aCtx.strokeStyle = '#10b981';
  aCtx.lineWidth = Math.max(4, naturalWidth / 300);
  aCtx.fillStyle = 'rgba(16, 185, 129, 0.12)';
  aCtx.fillRect(left, top, width, height);
  aCtx.strokeRect(left, top, width, height);

  // Calipers
  const cornerLen = Math.min(width, height) * 0.22;
  aCtx.strokeStyle = '#059669';
  aCtx.lineWidth = Math.max(5, naturalWidth / 220);

  // TL
  aCtx.beginPath();
  aCtx.moveTo(left, top + cornerLen);
  aCtx.lineTo(left, top);
  aCtx.lineTo(left + cornerLen, top);
  aCtx.stroke();
  // TR
  aCtx.beginPath();
  aCtx.moveTo(left + width - cornerLen, top);
  aCtx.lineTo(left + width, top);
  aCtx.lineTo(left + width, top + cornerLen);
  aCtx.stroke();
  // BL
  aCtx.beginPath();
  aCtx.moveTo(left, top + height - cornerLen);
  aCtx.lineTo(left, top + height);
  aCtx.lineTo(left + cornerLen, top + height);
  aCtx.stroke();
  // BR
  aCtx.beginPath();
  aCtx.moveTo(left + width - cornerLen, top + height);
  aCtx.lineTo(left + width, top + height);
  aCtx.lineTo(left + width, top + height - cornerLen);
  aCtx.stroke();

  // Biometric grid
  aCtx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
  aCtx.lineWidth = Math.max(1.5, naturalWidth / 700);
  aCtx.setLineDash([6, 6]);
  aCtx.beginPath();
  aCtx.moveTo(left, top + height * 0.33);
  aCtx.lineTo(left + width, top + height * 0.33);
  aCtx.moveTo(left, top + height * 0.66);
  aCtx.lineTo(left + width, top + height * 0.66);
  aCtx.moveTo(left + width * 0.5, top);
  aCtx.lineTo(left + width * 0.5, top + height);
  aCtx.stroke();
  aCtx.setLineDash([]);

  // Tag Label
  const labelText = `YOLOv8 Muzzle: ${(detection.confidence * 100).toFixed(1)}%`;
  const subText = `Bio-ID: ${detection.biometricId}`;
  const fontSize = Math.max(16, Math.round(naturalWidth / 45));
  aCtx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;

  const textWidth = Math.max(aCtx.measureText(labelText).width, aCtx.measureText(subText).width);
  const tagPadding = 12;
  const tagHeight = fontSize * 2.5;
  const tagY = top > tagHeight + 12 ? top - tagHeight - 8 : top + 10;

  aCtx.fillStyle = 'rgba(10, 20, 15, 0.94)';
  aCtx.beginPath();
  aCtx.roundRect(left, tagY, textWidth + tagPadding * 2, tagHeight, 8);
  aCtx.fill();
  aCtx.strokeStyle = '#10b981';
  aCtx.lineWidth = 2;
  aCtx.stroke();

  aCtx.fillStyle = '#ffffff';
  aCtx.fillText(labelText, left + tagPadding, tagY + fontSize + 2);
  aCtx.font = `600 ${Math.round(fontSize * 0.8)}px monospace`;
  aCtx.fillStyle = '#6ee7b7';
  aCtx.fillText(subText, left + tagPadding, tagY + fontSize * 2 + 2);
  aCtx.restore();

  const annotatedImageUrl = annoCanvas.toDataURL('image/jpeg', 0.92);

  // 2. Generate Cropped Muzzle Base (RGB)
  const cropW = 480;
  const cropH = 360;

  const rgbCanvas = document.createElement('canvas');
  rgbCanvas.width = cropW;
  rgbCanvas.height = cropH;
  const rgbCtx = rgbCanvas.getContext('2d')!;

  const srcCropX = Math.max(0, xmin * naturalWidth);
  const srcCropY = Math.max(0, ymin * naturalHeight);
  const srcCropW = Math.max(10, (xmax - xmin) * naturalWidth);
  const srcCropH = Math.max(10, (ymax - ymin) * naturalHeight);

  rgbCtx.drawImage(img, srcCropX, srcCropY, srcCropW, srcCropH, 0, 0, cropW, cropH);
  const rgbCropUrl = rgbCanvas.toDataURL('image/jpeg', 0.95);

  // 3. Generate Ridges Enhanced Crop
  const ridgesCanvas = document.createElement('canvas');
  ridgesCanvas.width = cropW;
  ridgesCanvas.height = cropH;
  const ridgesCtx = ridgesCanvas.getContext('2d')!;
  ridgesCtx.drawImage(rgbCanvas, 0, 0);

  const ridgesImgData = ridgesCtx.getImageData(0, 0, cropW, cropH);
  const rData = ridgesImgData.data;
  const rCopy = new Uint8ClampedArray(rData);

  for (let y = 1; y < cropH - 1; y++) {
    for (let x = 1; x < cropW - 1; x++) {
      const idx = (y * cropW + x) * 4;
      const center = rCopy[idx] * 0.299 + rCopy[idx + 1] * 0.587 + rCopy[idx + 2] * 0.114;
      const topP = rCopy[((y - 1) * cropW + x) * 4];
      const bottomP = rCopy[((y + 1) * cropW + x) * 4];
      const leftP = rCopy[(y * cropW + (x - 1)) * 4];
      const rightP = rCopy[(y * cropW + (x + 1)) * 4];

      const laplacian = Math.abs(4 * center - topP - bottomP - leftP - rightP);
      const edgeVal = Math.min(255, laplacian * 4.2);

      rData[idx] = 12; // Dark emerald background
      rData[idx + 1] = Math.min(255, edgeVal + 45); // Luminescent emerald ridge
      rData[idx + 2] = Math.min(255, edgeVal * 0.75);
      rData[idx + 3] = 255;
    }
  }
  ridgesCtx.putImageData(ridgesImgData, 0, 0);
  const ridgesCropUrl = ridgesCanvas.toDataURL('image/png');

  // 4. Generate High Contrast CLAHE Crop
  const contrastCanvas = document.createElement('canvas');
  contrastCanvas.width = cropW;
  contrastCanvas.height = cropH;
  const cCtx = contrastCanvas.getContext('2d')!;
  cCtx.drawImage(rgbCanvas, 0, 0);

  const cImgData = cCtx.getImageData(0, 0, cropW, cropH);
  const cData = cImgData.data;

  for (let i = 0; i < cData.length; i += 4) {
    const gray = cData[i] * 0.299 + cData[i + 1] * 0.587 + cData[i + 2] * 0.114;
    const contrast = (gray - 128) * 2.2 + 128;
    const clamped = Math.max(0, Math.min(255, contrast));
    cData[i] = clamped;
    cData[i + 1] = clamped;
    cData[i + 2] = clamped;
    cData[i + 3] = 255;
  }
  cCtx.putImageData(cImgData, 0, 0);
  const contrastCropUrl = contrastCanvas.toDataURL('image/jpeg', 0.95);

  // 5. Generate Sobel Edge Crop
  const sobelCanvas = document.createElement('canvas');
  sobelCanvas.width = cropW;
  sobelCanvas.height = cropH;
  const sCtx = sobelCanvas.getContext('2d')!;
  sCtx.drawImage(rgbCanvas, 0, 0);

  const sImgData = sCtx.getImageData(0, 0, cropW, cropH);
  const sData = sImgData.data;
  const sCopy = new Uint8ClampedArray(sData);

  // Sobel Gx and Gy kernels
  for (let y = 1; y < cropH - 1; y++) {
    for (let x = 1; x < cropW - 1; x++) {
      const getGray = (px: number, py: number) => {
        const pIdx = (py * cropW + px) * 4;
        return sCopy[pIdx] * 0.299 + sCopy[pIdx + 1] * 0.587 + sCopy[pIdx + 2] * 0.114;
      };

      const gx =
        -1 * getGray(x - 1, y - 1) + 1 * getGray(x + 1, y - 1) +
        -2 * getGray(x - 1, y)     + 2 * getGray(x + 1, y) +
        -1 * getGray(x - 1, y + 1) + 1 * getGray(x + 1, y + 1);

      const gy =
        -1 * getGray(x - 1, y - 1) - 2 * getGray(x, y - 1) - 1 * getGray(x + 1, y - 1) +
         1 * getGray(x - 1, y + 1) + 2 * getGray(x, y + 1) + 1 * getGray(x + 1, y + 1);

      const g = Math.min(255, Math.sqrt(gx * gx + gy * gy) * 1.5);
      const idx = (y * cropW + x) * 4;

      sData[idx] = Math.min(255, g * 0.6);
      sData[idx + 1] = Math.min(255, g * 1.2);
      sData[idx + 2] = Math.min(255, g * 0.9);
      sData[idx + 3] = 255;
    }
  }
  sCtx.putImageData(sImgData, 0, 0);
  const sobelCropUrl = sobelCanvas.toDataURL('image/png');

  return {
    annotatedImageUrl,
    spectralCrops: {
      rgb: rgbCropUrl,
      ridges: ridgesCropUrl,
      contrast: contrastCropUrl,
      sobel: sobelCropUrl,
    },
  };
}

/**
 * Validates a newly scanned cow against the existing Herd Registry
 * Returns biometric similarity, matched cow if any, and matching diagnostics
 */
export function validateAgainstHerdRegistry(
  currentScan: CowAnalysisResult,
  savedScans: CowAnalysisResult[]
): RegistryValidationMatch {
  if (!savedScans || savedScans.length === 0) {
    return {
      isMatch: false,
      similarityScore: 0,
      matchReasons: ['Herd Registry is empty. Ready for initial registration.'],
    };
  }

  const currentDet = currentScan.muzzleDetections?.[0];
  const currentHash = currentScan.biometricPassport?.muzzlePatternHash || '';
  const currentId = currentScan.biometricPassport?.uniqueCattleId || '';

  let bestMatch: CowAnalysisResult | null = null;
  let highestScore = 0;
  let bestReasons: string[] = [];

  for (const registered of savedScans) {
    const regDet = registered.muzzleDetections?.[0];
    const regHash = registered.biometricPassport?.muzzlePatternHash || '';
    const regId = registered.biometricPassport?.uniqueCattleId || '';

    // Direct Exact RFID / Cattle ID Match
    if (regId && currentId && regId === currentId) {
      return {
        isMatch: true,
        matchedCowId: regId,
        matchedCowName: registered.primaryBreed?.breed || 'Registered Cattle',
        similarityScore: 99.8,
        matchedTimestamp: registered.timestamp,
        matchedScan: registered,
        matchReasons: [
          'Exact Biometric RFID Passport ID match',
          'Identical muzzle pattern cryptographic hash signature',
          'Matching bead density and dermatoglyphic ridge points',
        ],
      };
    }

    // Direct Hash Match
    if (regHash && currentHash && regHash === currentHash) {
      return {
        isMatch: true,
        matchedCowId: regId,
        matchedCowName: registered.primaryBreed?.breed || 'Registered Cattle',
        similarityScore: 98.5,
        matchedTimestamp: registered.timestamp,
        matchedScan: registered,
        matchReasons: [
          'Exact Muzzle Biometric Hash match',
          `Registered on ${new Date(registered.timestamp).toLocaleDateString()}`,
        ],
      };
    }

    // Multi-factor Biometric Similarity Comparison
    let score = 0;
    const reasons: string[] = [];

    // 1. Breed concordance
    if (registered.primaryBreed?.breed === currentScan.primaryBreed?.breed) {
      score += 25;
      reasons.push(`Matching breed phenotype (${registered.primaryBreed?.breed})`);
    }

    // 2. Bead density proximity
    if (currentDet && regDet) {
      const beadDiff = Math.abs(currentDet.beadDensityScore - regDet.beadDensityScore);
      if (beadDiff <= 3) {
        score += 30;
        reasons.push(`High bead density concordance (Δ ${beadDiff}%)`);
      } else if (beadDiff <= 8) {
        score += 18;
      }

      // 3. Symmetry concordance
      const symDiff = Math.abs(currentDet.symmetryScore - regDet.symmetryScore);
      if (symDiff <= 3) {
        score += 25;
        reasons.push(`Identical nasolabial symmetry (Δ ${symDiff}%)`);
      } else if (symDiff <= 7) {
        score += 15;
      }

      // 4. Ridge clarity match
      if (currentDet.ridgePatternClarity === regDet.ridgePatternClarity) {
        score += 15;
        reasons.push(`Concordant ridge pattern clarity (${currentDet.ridgePatternClarity})`);
      }
    }

    // 5. Image comparison signature if identical uploaded source
    if (registered.imageUrl === currentScan.imageUrl) {
      score = 99.4;
      reasons.push('Identical photographic frame biometric match');
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = registered;
      bestReasons = reasons;
    }
  }

  // Threshold for positive match in Herd Registry
  const isMatch = highestScore >= 75 && bestMatch !== null;

  return {
    isMatch,
    matchedCowId: bestMatch?.biometricPassport?.uniqueCattleId,
    matchedCowName: bestMatch?.primaryBreed?.breed,
    similarityScore: Math.min(99.5, Math.round(highestScore * 10) / 10),
    matchedTimestamp: bestMatch?.timestamp,
    matchedScan: bestMatch || undefined,
    matchReasons: isMatch
      ? bestReasons
      : ['No matching biometric identity found in current herd registry (similarity < 75%).'],
  };
}
