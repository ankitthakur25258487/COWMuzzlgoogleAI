import React, { useState, useMemo } from 'react';
import { X, Search, BookOpen, Globe, Milk, Thermometer, Filter, Sparkles } from 'lucide-react';
import { CATTLE_BREEDS_DATABASE } from '../data/breedDatabase';
import { BreedDatabaseEntry } from '../types';

interface BreedEncyclopediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearch?: string;
}

export const BreedEncyclopediaModal: React.FC<BreedEncyclopediaModalProps> = ({
  isOpen,
  onClose,
  initialSearch = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('ALL');
  const [selectedBreed, setSelectedBreed] = useState<BreedDatabaseEntry | null>(null);

  const filteredBreeds = useMemo(() => {
    return CATTLE_BREEDS_DATABASE.filter((b) => {
      const matchSearch =
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.characteristics.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCat = selectedCategory === 'ALL' || b.category.includes(selectedCategory);
      const matchSpecies =
        selectedSpecies === 'ALL' ||
        (selectedSpecies === 'ZEBU' && b.species.includes('indicus')) ||
        (selectedSpecies === 'TAURINE' && b.species.includes('taurus'));

      return matchSearch && matchCat && matchSpecies;
    });
  }, [searchTerm, selectedCategory, selectedSpecies]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="backdrop-blur-2xl bg-[#0a110a]/95 text-white rounded-3xl border border-white/15 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0a110a]/90 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl backdrop-blur-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Global Cattle Breeds Encyclopedia
              </h3>
              <p className="text-xs text-slate-400">
                Taxonomic database of Bos indicus (Zebu) &amp; Bos taurus dairy, beef, and draft breeds
              </p>
            </div>
          </div>

          <button
            id="close-encyclopedia-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 sm:p-5 bg-white/[0.02] border-b border-white/10 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="breed-search-input"
              type="text"
              placeholder="Search breeds by name (Gir, Sahiwal, Angus, Holstein), origin, or trait..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 backdrop-blur-md bg-white/[0.05] rounded-xl border border-white/15 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            {/* Purpose filters */}
            {['ALL', 'Dairy', 'Beef', 'Dual-Purpose'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer backdrop-blur-md ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-black font-extrabold shadow-md shadow-emerald-500/20'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="h-4 w-px bg-white/15 mx-1"></div>

            {/* Species filters */}
            {[
              { id: 'ALL', label: 'All Species' },
              { id: 'ZEBU', label: 'Bos indicus (Zebu)' },
              { id: 'TAURINE', label: 'Bos taurus (Taurine)' },
            ].map((sp) => (
              <button
                key={sp.id}
                onClick={() => setSelectedSpecies(sp.id)}
                className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer backdrop-blur-md ${
                  selectedSpecies === sp.id
                    ? 'bg-indigo-500 text-white font-extrabold shadow-md shadow-indigo-500/20'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/10'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Breeds List Grid */}
        <div className="p-5 overflow-y-auto flex-1 divide-y divide-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBreeds.map((breed) => (
              <div
                key={breed.id}
                className="backdrop-blur-md bg-white/[0.03] rounded-2xl border border-white/10 hover:border-emerald-500/50 p-4 transition-all shadow-lg hover:bg-white/[0.06] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-base font-bold text-white">{breed.name}</h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        {breed.species}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                      {breed.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                    {breed.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300 backdrop-blur-md bg-white/[0.03] p-3 rounded-xl border border-white/[0.08] mb-3">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate"><strong>Origin:</strong> {breed.origin}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Milk className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate"><strong>Milk:</strong> {breed.milkYield} ({breed.fatContent})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate"><strong>Climate:</strong> {breed.climate}</span>
                    </div>
                  </div>

                  {/* Key traits */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                      Key Morphological Traits:
                    </span>
                    <ul className="text-[11px] text-slate-300 space-y-0.5">
                      {breed.characteristics.slice(0, 2).map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono text-[10px]">
                    Muzzle: {breed.muzzleCharacteristics.slice(0, 38)}...
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredBreeds.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <p className="text-sm font-semibold text-white">No cattle breeds matched your query.</p>
              <p className="text-xs mt-1">Try searching for Gir, Sahiwal, Jersey, Angus, or Brahman.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Showing {filteredBreeds.length} of {CATTLE_BREEDS_DATABASE.length} curated cattle breeds
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-emerald-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
