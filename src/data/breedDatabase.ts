import { BreedDatabaseEntry } from '../types';

export const CATTLE_BREEDS_DATABASE: BreedDatabaseEntry[] = [
  {
    id: 'gir',
    name: 'Gir',
    species: 'Bos indicus (Zebu)',
    category: 'Dairy',
    origin: 'Gujarat, India (Gir Hills & Saurashtra)',
    milkYield: '2,500 - 4,500 kg / lactation',
    fatContent: '4.5% - 5.0% (A2 Beta-Casein)',
    climate: 'Tropical, high heat & humidity tolerance',
    description: 'Renowned indigenous dairy breed with distinctive convex forehead (dome-shaped), long pendulous drooping ears like folded leaves, and red to speckled coat.',
    characteristics: [
      'Convex prominent forehead shielding eyes from sun',
      'Long pendulous folded ears hanging down',
      'Horns curved backward and downward (half-moon shape)',
      'Large loose hump and well-developed dewlap',
      'High resistance to tropical diseases and tick infestation'
    ],
    imagePlaceholder: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80',
    muzzleCharacteristics: 'Broad, black or dark slate muzzle with pronounced biometric bead clusters and distinct nostril flare.'
  },
  {
    id: 'holstein_friesian',
    name: 'Holstein Friesian',
    species: 'Bos taurus (Taurine)',
    category: 'Dairy',
    origin: 'The Netherlands & Northern Germany',
    milkYield: '7,000 - 12,000+ kg / lactation',
    fatContent: '3.6% - 3.8%',
    climate: 'Temperate (susceptible to severe heat stress)',
    description: 'The highest-yielding dairy cattle breed in the world, distinguished by bold black-and-white (or red-and-white) piebald markings and large frame.',
    characteristics: [
      'Striking piebald black and white piebald coat',
      'No hump (straight dorsal topline)',
      'Large body frame with capacious, well-attached udder',
      'Short forward-curving horns (frequently polled)',
      'Outstanding milk volume production'
    ],
    imagePlaceholder: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&auto=format&fit=crop&q=80',
    muzzleCharacteristics: 'Pink with irregular black spots or solid black, wide flat upper lip with smooth fine bead ridges.'
  },
  {
    id: 'jersey',
    name: 'Jersey',
    species: 'Bos taurus (Taurine)',
    category: 'Dairy',
    origin: 'Island of Jersey, British Channel Islands',
    milkYield: '4,000 - 6,500 kg / lactation',
    fatContent: '4.8% - 5.6% (Rich butterfat & protein)',
    climate: 'Adaptable to temperate and warm climates',
    description: 'Small, refined dairy breed famed for golden-fawn coloration, large doe-like eyes, gentle temperament, and richest butterfat milk for cheese and butter.',
    characteristics: [
      'Fawn to mulberry or dark brown coat with pale muzzle ring',
      'Refined head with dished face and prominent expressive eyes',
      'Small to medium frame with high feed conversion efficiency',
      'Exceptional butterfat and protein content in milk',
      'Early maturing and easy calving'
    ],
    imagePlaceholder: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=800&auto=format&fit=crop&q=80',
    muzzleCharacteristics: 'Dark slate or black muzzle circled by a characteristic pale or creamy white ring.'
  },
  {
    id: 'sahiwal',
    name: 'Sahiwal',
    species: 'Bos indicus (Zebu)',
    category: 'Dairy',
    origin: 'Montgomery / Punjab region (India & Pakistan)',
    milkYield: '2,800 - 4,200 kg / lactation',
    fatContent: '4.5% - 5.2% (A2 Milk)',
    climate: 'Extreme heat, arid & semi-arid conditions',
    description: 'Premier milch zebu breed, brownish-red to pale red with loose skin, voluminous dewlap, calm nature, and high tick resistance.',
    characteristics: [
      'Reddish dun to pale red coat with darker shade around neck',
      'Voluminous loose dewlap and sheath (nicknamed "Lola" / loose)',
      'Medium curved horns stumpy at base',
      'Good heat and drought endurance with disease resilience',
      'Sweet and high-protein A2 milk'
    ],
    imagePlaceholder: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800&auto=format&fit=crop&q=80',
    muzzleCharacteristics: 'Dark brown to blackish muzzle, moist and broad with prominent lateral bead lines.'
  },
  {
    id: 'black_angus',
    name: 'Aberdeen Angus (Black Angus)',
    species: 'Bos taurus (Taurine)',
    category: 'Beef',
    origin: 'Aberdeenshire & Angus, Scotland',
    milkYield: '1,500 - 2,200 kg (Nurse calf)',
    fatContent: '4.0%',
    climate: 'Temperate to cool grasslands',
    description: 'World-renowned beef breed known for solid black (or red) coat, naturally polled (hornless) head, compact muscular carcass, and premium marbled meat.',
    characteristics: [
      'Naturally polled (polled dominant trait)',
      'Uniform solid black coat (or Red Angus variant)',
      'Blocky, cylindrical muscular beef conformation',
      'High intramuscular fat marbling for tender beef',
      'Excellent maternal instincts and vigorous calves'
    ],
    imagePlaceholder: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&auto=format&fit=crop&q=80',
    muzzleCharacteristics: 'Solid black broad muzzle, deep jawline, clean firm lips without hanging jowls.'
  },
  {
    id: 'brahman',
    name: 'Brahman',
    species: 'Bos indicus (Zebu)',
    category: 'Beef / Dual-Purpose',
    origin: 'United States (Bred from Gir, Guzerat, Ongole, Krishna Valley)',
    milkYield: '1,800 - 2,500 kg',
    fatContent: '4.4%',
    climate: 'Subtropical, high humidity, intense solar radiation',
    description: 'Iconic American zebu beef breed with massive shoulder hump, extensive drooping dewlap, silvery gray to red coat, and superior heat dissipating sweat glands.',
    characteristics: [
      'Large upright shoulder hump over withers',
      'Abundant loose folding skin and pendulous dewlap',
      'Sweat glands producing sebum repellent to insects',
      'Curved horns turning upward and backward',
      'High resistance to heat, eye cancer, and parasites'
    ],
    imagePlaceholder: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=800&auto=format&fit=crop&q=80',
    muzzleCharacteristics: 'Solid pigmented black muzzle with deep nostril grooves and pronounced sensory papillae.'
  },
  {
    id: 'red_sindhi',
    name: 'Red Sindhi',
    species: 'Bos indicus (Zebu)',
    category: 'Dairy',
    origin: 'Sindh region (Indus Valley)',
    milkYield: '2,200 - 3,500 kg / lactation',
    fatContent: '4.5% - 5.0%',
    climate: 'Arid, hot, tropical climates',
    description: 'Deep reddish-brown dairy cattle with compact muscular frame, intelligent alert eyes, high disease resistance, and adaptability to tropical feed.',
    characteristics: [
      'Deep red to brownish red coat with darker extremities',
      'Compact body frame with well-proportioned hump',
      'Thick short horns curving upward',
      'Hardy hooves suitable for tough rocky or sandy terrain',
      'High milk solids and heat resilience'
    ],
    imagePlaceholder: 'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?w=800&auto=format&fit=crop&q=80',
    muzzleCharacteristics: 'Dark brown to black muzzle with tight bead patterning and high symmetry.'
  },
  {
    id: 'hereford',
    name: 'Hereford',
    species: 'Bos taurus (Taurine)',
    category: 'Beef',
    origin: 'Herefordshire, England',
    milkYield: '1,600 - 2,200 kg',
    fatContent: '3.9%',
    climate: 'Temperate to cold pasture climates',
    description: 'Classic British beef cattle distinguished by rich red-brown coat with stark white face, white crest, dewlap, underline, and tail switch.',
    characteristics: [
      'Distinctive "white face" marking with red body coat',
      'Docile and calm temperament easy to handle',
      'Thick winter hair coat shedding in summer',
      'Excellent foraging efficiency on natural grass pasture',
      'High fertility and longevity'
    ],
    imagePlaceholder: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&auto=format&fit=crop&q=80',
    muzzleCharacteristics: 'Clean pinkish or flesh-colored muzzle blending smoothly into the white facial mask.'
  },
  {
    id: 'ongole',
    name: 'Ongole (Nellore)',
    species: 'Bos indicus (Zebu)',
    category: 'Dual-Purpose / Draft & Beef',
    origin: 'Prakasam / Andhra Pradesh, India',
    milkYield: '1,500 - 2,500 kg',
    fatContent: '4.2% - 4.8%',
    climate: 'Tropical coastal and savannah climates',
    description: 'Majestic white/light grey cattle with muscular build, short stumpy horns, prominent hump in bulls, and global progenitor of the Nellore beef breed.',
    characteristics: [
      'Glossy white to silvery grey coat with black switch and hooves',
      'Broad forehead with short elliptical horns',
      'Immense strength, endurance, and muscular draft power',
      'Ancestral founder of the Latin American Nellore breed',
      'Remarkable immunity to rinderpest and foot-and-mouth disease'
    ],
    imagePlaceholder: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80',
    muzzleCharacteristics: 'Jet black muzzle with sharp black eyeliner around eyelids, providing high contrast.'
  },
  {
    id: 'tharparkar',
    name: 'Tharparkar (White Sindhi)',
    species: 'Bos indicus (Zebu)',
    category: 'Dual-Purpose / Dairy & Draft',
    origin: 'Thar Desert (Rajasthan, India & Sindh)',
    milkYield: '2,000 - 3,200 kg',
    fatContent: '4.4% - 4.9%',
    climate: 'Severe desert heat, drought, sparse vegetation',
    description: 'The desert wonder cow, pearl-grey to white with ability to survive on desert scrub bushes and produce rich milk under extreme 48°C+ temperatures.',
    characteristics: [
      'Pure white or light grey coat reflecting solar radiation',
      'Medium-sized lyre-shaped horns pointing upward',
      'Medium hump and moderately loose dewlap',
      'Exceptional drought tolerance and water conservation',
      'Dual utility for desert ploughing and daily milking'
    ],
    imagePlaceholder: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800&auto=format&fit=crop&q=80',
    muzzleCharacteristics: 'Dark slate or black muzzle with fine granular beads and clean margins.'
  },
  {
    id: 'simmental',
    name: 'Simmental',
    species: 'Bos taurus (Taurine)',
    category: 'Dual-Purpose / Dairy & Beef',
    origin: 'Simme Valley, Bernese Oberland, Switzerland',
    milkYield: '5,000 - 7,500 kg',
    fatContent: '3.9% - 4.2%',
    climate: 'Alpine, temperate, and continental climates',
    description: 'Large versatile Swiss dual-purpose breed, reddish-gold with white patches, white head, robust bone structure, and high growth rate.',
    characteristics: [
      'Gold and white or reddish-brown coat with white face',
      'Heavy muscling combined with generous milk production',
      'Strong legs and tough hooves adapted to alpine terrain',
      'High weaning weights and feed efficiency',
      'Docile disposition'
    ],
    imagePlaceholder: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&auto=format&fit=crop&q=80',
    muzzleCharacteristics: 'Pink or flesh-toned broad muzzle with wide nostril openings.'
  },
  {
    id: 'highland',
    name: 'Highland Cattle',
    species: 'Bos taurus (Taurine)',
    category: 'Beef',
    origin: 'Scottish Highlands & Outer Hebrides',
    milkYield: '1,200 - 1,800 kg',
    fatContent: '4.2%',
    climate: 'Extreme cold, heavy rain, wind, mountain moors',
    description: 'Ancient hardy breed iconic for long shaggy double coat, long sweeping horns, and ability to thrive on poorest mountain pastures without housing.',
    characteristics: [
      'Long shaggy double hair coat (outer oily hair + soft underfur)',
      'Long majestic sweeping horns in both sexes',
      'Wide fringe ("dossan") covering eyes from rain and insects',
      'Extremely hardy and low-maintenance beef cattle',
      'Lean, low-cholesterol marbled beef'
    ],
    imagePlaceholder: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=800&auto=format&fit=crop&q=80',
    muzzleCharacteristics: 'Dark pigmented muzzle protected by surrounding long facial hair.'
  }
];
