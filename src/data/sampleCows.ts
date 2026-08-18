export interface SampleCow {
  id: string;
  name: string;
  breedLabel: string;
  category: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  expectedBreed: string;
  expectedSpecies: string;
}

export const SAMPLE_COW_PRESETS: SampleCow[] = [
  {
    id: 'sample-gir',
    name: 'Desi Gir Dairy Cow',
    breedLabel: 'Gir (Bos indicus)',
    category: 'Indigenous Dairy',
    description: 'Distinctive dome forehead, pendulous leaf-like ears, and reddish-dun coat with high A2 milk yield.',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=1000&auto=format&fit=crop&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=200&auto=format&fit=crop&q=80',
    expectedBreed: 'Gir',
    expectedSpecies: 'Bos indicus (Zebu)'
  },
  {
    id: 'sample-holstein',
    name: 'Holstein Friesian Milker',
    breedLabel: 'Holstein Friesian (Bos taurus)',
    category: 'Commercial Dairy',
    description: 'Iconic black and white piebald markings, straight backline, and world-record milk volume capacity.',
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=1000&auto=format&fit=crop&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=200&auto=format&fit=crop&q=80',
    expectedBreed: 'Holstein Friesian',
    expectedSpecies: 'Bos taurus (Taurine)'
  },
  {
    id: 'sample-jersey',
    name: 'Purebred Jersey Heifer',
    breedLabel: 'Jersey (Bos taurus)',
    category: 'High-Fat Dairy',
    description: 'Golden-fawn coat, dark muzzle ring, large expressive eyes, and high butterfat milk production.',
    imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=1000&auto=format&fit=crop&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=200&auto=format&fit=crop&q=80',
    expectedBreed: 'Jersey',
    expectedSpecies: 'Bos taurus (Taurine)'
  },
  {
    id: 'sample-sahiwal',
    name: 'Sahiwal Red Zebu',
    breedLabel: 'Sahiwal (Bos indicus)',
    category: 'Tropical Dairy',
    description: 'Reddish-brown coat, loose skin with pendulous dewlap, robust tropical heat and tick resistance.',
    imageUrl: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=1000&auto=format&fit=crop&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=200&auto=format&fit=crop&q=80',
    expectedBreed: 'Sahiwal',
    expectedSpecies: 'Bos indicus (Zebu)'
  },
  {
    id: 'sample-angus',
    name: 'Black Angus Cattle',
    breedLabel: 'Aberdeen Angus (Bos taurus)',
    category: 'Prime Beef',
    description: 'Solid black coat, polled (hornless) head, blocky muscular conformation, and high marbling.',
    imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1000&auto=format&fit=crop&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=200&auto=format&fit=crop&q=80',
    expectedBreed: 'Aberdeen Angus',
    expectedSpecies: 'Bos taurus (Taurine)'
  },
  {
    id: 'sample-brahman',
    name: 'Brahman Zebu Bull',
    breedLabel: 'Brahman (Bos indicus)',
    category: 'Subtropical Beef',
    description: 'Pronounced shoulder hump, voluminous hanging dewlap, silvery grey coat, and desert heat tolerance.',
    imageUrl: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=1000&auto=format&fit=crop&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=200&auto=format&fit=crop&q=80',
    expectedBreed: 'Brahman',
    expectedSpecies: 'Bos indicus (Zebu)'
  }
];
