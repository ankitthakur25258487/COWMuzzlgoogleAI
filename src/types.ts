export interface BoundingBox {
  ymin: number; // 0 to 1000 or 0 to 1
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface MuzzleDetection {
  id: string;
  box: BoundingBox; // normalized 0 to 1
  confidence: number;
  label: string;
  classId: number;
  cropUrl?: string;
  biometricId: string;
  beadDensityScore: number; // 0-100
  ridgePatternClarity: 'High' | 'Medium' | 'Low';
  symmetryScore: number; // 0-100
  nostrilDistanceNorm: number;
}

export interface BreedCandidate {
  breed: string;
  scientificName?: string;
  speciesType: 'Bos indicus (Zebu)' | 'Bos taurus (Taurine)' | 'Crossbred' | 'Bos grunniens' | 'Other';
  confidence: number;
  purpose: 'Dairy' | 'Beef' | 'Dual-Purpose' | 'Draft / Working';
  origin: string;
  keyFeatures: string[];
  description: string;
}

export interface PhysicalTraits {
  coatColor: string;
  hornType: string;
  humpSize: 'Prominent' | 'Moderate' | 'Absent' | 'Small';
  dewlapSize: 'Large / Pendulous' | 'Moderate' | 'Tight / Minimal';
  earStructure: string;
  statureAndBuild: string;
  facialProfile: string;
}

export interface ProductionAndHealth {
  estimatedMilkYieldPerLactation?: string;
  milkFatPercentage?: string;
  climateTolerance: string;
  tickDiseaseResistance: 'High' | 'Moderate' | 'Low';
  temperament: string;
  recommendedCare: string[];
}

export interface MuzzleSpectralCrops {
  rgb: string;       // high-res RGB muzzle crop
  ridges: string;    // dermatoglyphic bead & ridge enhancement
  contrast: string;  // high contrast / CLAHE grayscale
  sobel: string;     // Sobel edge filter map
}

export interface RegistryValidationMatch {
  isMatch: boolean;
  matchedCowId?: string;
  matchedCowName?: string;
  similarityScore: number; // 0-100
  matchedTimestamp?: number;
  matchedScan?: CowAnalysisResult;
  matchReasons: string[];
}

export interface CowAnalysisResult {
  id: string;
  timestamp: number;
  imageUrl: string;
  annotatedImageUrl?: string;
  spectralCrops?: MuzzleSpectralCrops;
  imageDimensions?: { width: number; height: number };
  primaryBreed: BreedCandidate;
  alternateBreeds: BreedCandidate[];
  muzzleDetections: MuzzleDetection[];
  physicalTraits: PhysicalTraits;
  productionAndHealth: ProductionAndHealth;
  registryValidation?: RegistryValidationMatch;
  biometricPassport: {
    uniqueCattleId: string;
    muzzlePatternHash: string;
    registrationDate: string;
    verificationStatus: 'Verified Biometric' | 'Review Recommended';
  };
  modelMetadata: {
    yoloModelName: string;
    weightsFile: string;
    driveLink: string;
    inferenceTimeMs: number;
    modelVersion: string;
  };
}

export interface BreedDatabaseEntry {
  id: string;
  name: string;
  species: 'Bos indicus (Zebu)' | 'Bos taurus (Taurine)' | 'Crossbred' | string;
  category: 'Dairy' | 'Beef' | 'Dual-Purpose' | 'Draft' | string;
  origin: string;
  milkYield: string;
  fatContent: string;
  climate: string;
  description: string;
  characteristics: string[];
  imagePlaceholder: string;
  muzzleCharacteristics: string;
}

export interface YOLOv8ModelInfo {
  name: string;
  filename: string;
  sizeBytes: number;
  sizeFormatted: string;
  googleDriveUrl: string;
  driveFileId: string;
  architecture: string;
  baseModel: string;
  inputShape: string;
  classes: string[];
  task: string;
  status: 'Loaded & Active' | 'Ready' | 'Standby';
  description: string;
}
