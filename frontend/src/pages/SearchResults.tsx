import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  MapPin, Calendar, Users, Search, SlidersHorizontal, X, Star,
  ChevronDown, Wifi, Waves, Car, Coffee, Dumbbell, Sparkles,
  ArrowUpDown, Check, Filter, ChevronLeft, Loader2,
} from 'lucide-react';
import api from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Hotel {
  id: number;
  image: string;
  name: string;
  location: string;
  starRating: number;
  description: string;
  amenities: string[];
  guestRating: number;
  guestRatingText: string;
  price: number;
  propertyType: string;
  urgencyText?: string;
  freeCancellation?: boolean;
  breakfastIncluded?: boolean;
}

// ─── Map backend hotel to component format ────────────────────────────────────

function mapApiHotel(h: any): Hotel {
  const firstRoom = h.rooms?.[0];
  const amenityNames = firstRoom?.amenities?.map((a: any) => a.name?.toLowerCase()) || [];
  const amenityMap: Record<string, string> = {
    'wifi': 'wifi', 'air conditioning': 'wifi', 'pool': 'pool', 'swimming pool': 'pool',
    'parking': 'parking', 'free parking': 'parking', 'restaurant': 'restaurant',
    'gym': 'gym', 'fitness center': 'gym', 'spa': 'spa',
    'room service': 'restaurant', 'minibar': 'restaurant',
  };
  const mappedAmenities = [...new Set(
    amenityNames.map((n: string) => amenityMap[n]).filter(Boolean)
  )];
  const lowestPrice = h.rooms?.length
    ? Math.min(...h.rooms.map((r: any) => r.price_per_night))
    : 0;
  const photoUrl = h.photos?.[0]?.url || firstRoom?.photos?.[0]?.url
    || 'https://images.unsplash.com/photo-1759223198981-661cadbbff36?w=1080';

  return {
    id: h.id,
    image: photoUrl,
    name: h.name,
    location: h.location,
    starRating: Math.round(h.rating),
    description: h.description || '',
    amenities: mappedAmenities as string[],
    guestRating: h.rating * 2,  // convert 5-scale to 10-scale
    guestRatingText: getRatingLabel(h.rating * 2),
    price: lowestPrice,
    propertyType: 'Hotel',
    freeCancellation: true,
    breakfastIncluded: amenityNames.includes('breakfast'),
  };
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const AMENITY_OPTIONS = [
  { key: 'wifi', label: 'Free WiFi', icon: Wifi },
  { key: 'pool', label: 'Pool', icon: Waves },
  { key: 'parking', label: 'Parking', icon: Car },
  { key: 'restaurant', label: 'Restaurant', icon: Coffee },
  { key: 'gym', label: 'Fitness Center', icon: Dumbbell },
  { key: 'spa', label: 'Spa', icon: Sparkles },
];

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'price_asc', label: 'Price (Low → High)' },
  { value: 'price_desc', label: 'Price (High → Low)' },
  { value: 'rating', label: 'Guest Rating' },
  { value: 'stars', label: 'Star Rating' },
];

const GUEST_RATING_OPTIONS = [
  { label: '9+ Exceptional', min: 9 },
  { label: '8+ Excellent', min: 8 },
  { label: '7+ Very Good', min: 7 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRatingLabel(r: number) {
  if (r >= 9) return 'Exceptional';
  if (r >= 8) return 'Excellent';
  if (r >= 7) return 'Very Good';
  return 'Good';
}

function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Amenity Icon Component ───────────────────────────────────────────────────

// ─── Hotel Result Card ────────────────────────────────────────────────────────

function HotelCard({ hotel, index }: { hotel: Hotel; index: number }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="bg-[#151a3d]/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden
                 hover:border-[#d4af37]/50 hover:shadow-2xl hover:shadow-[#d4af37]/10
                 transition-all duration-300 group"
    >
      <div className="grid md:grid-cols-3 gap-0">
        {/* Image */}
        <div className="relative overflow-hidden h-56 md:h-auto">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27]/80 to-transparent" />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {hotel.freeCancellation && (
              <span className="bg-green-500/90 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                Free Cancellation
              </span>
            )}
            {hotel.breakfastIncluded && (
              <span className="bg-[#d4af37]/90 text-[#0a0e27] text-xs px-2.5 py-1 rounded-full font-medium">
                Breakfast Included
              </span>
            )}
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/10 backdrop-blur-sm text-white/80 text-xs px-2 py-1 rounded-lg border border-white/10">
              {hotel.propertyType}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 p-5 md:p-7 flex flex-col justify-between">
          <div>
            {/* Name + Stars */}
            <div className="flex items-start justify-between gap-4 mb-1.5">
              <h3 className="text-xl text-white group-hover:text-[#d4af37] transition-colors leading-tight">
                {hotel.name}
              </h3>
              <div className="flex items-center gap-0.5 shrink-0">
                {[...Array(hotel.starRating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-white/50 mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-sm">{hotel.location}</span>
            </div>

            {/* Description */}
            <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">
              {hotel.description}
            </p>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-3">
              {hotel.amenities.slice(0, 5).map((a) => {
                const opt = AMENITY_OPTIONS.find((o) => o.key === a);
                if (!opt) return null;
                const Icon = opt.icon;
                return (
                  <div key={a} className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
                    <Icon className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span className="text-white/70 text-xs">{opt.label}</span>
                  </div>
                );
              })}
            </div>

            {hotel.urgencyText && (
              <p className="text-orange-400 text-xs font-medium">{hotel.urgencyText}</p>
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-4 border-t border-white/10 mt-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#d4af37] text-[#0a0e27] px-2.5 py-1.5 rounded-lg font-bold text-sm">
                {hotel.guestRating.toFixed(1)}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{hotel.guestRatingText}</p>
                <p className="text-white/40 text-xs">Guest rating</p>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <div className="text-right">
                <p className="text-white/50 text-xs mb-0.5">from / night</p>
                <p className="text-2xl text-[#d4af37] font-semibold">
                  ${hotel.price.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => navigate(`/hotels/${hotel.id}`)}
                className="px-5 py-3 bg-[#d4af37] text-[#0a0e27] font-semibold rounded-xl
                           hover:bg-[#c4a037] hover:shadow-lg hover:shadow-[#d4af37]/30
                           transition-all duration-300 text-sm whitespace-nowrap"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Filter Panel (reusable for sidebar + mobile drawer) ─────────────────────

function FilterPanel({
  priceRange, setPriceRange,
  selectedStars, toggleStar,
  selectedAmenities, toggleAmenity,
  selectedTypes, toggleType,
  minGuestRating, setMinGuestRating,
  onClear,
  activeCount,
}: {
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  selectedStars: number[];
  toggleStar: (s: number) => void;
  selectedAmenities: string[];
  toggleAmenity: (a: string) => void;
  selectedTypes: string[];
  toggleType: (t: string) => void;
  minGuestRating: number | null;
  setMinGuestRating: (v: number | null) => void;
  onClear: () => void;
  activeCount: number;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg text-white flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#d4af37]" />
          Filters
          {activeCount > 0 && (
            <span className="bg-[#d4af37] text-[#0a0e27] text-xs font-bold px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </h2>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-[#d4af37] hover:text-[#c4a037] text-sm transition-colors">
            Clear all
          </button>
        )}
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-white text-sm font-medium mb-3">Price per Night</h3>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-white/40 text-xs mb-1 block">Min ($)</label>
            <input
              type="number"
              min={0}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:border-[#d4af37] [appearance:textfield]"
            />
          </div>
          <div className="flex-1">
            <label className="text-white/40 text-xs mb-1 block">Max ($)</label>
            <input
              type="number"
              min={priceRange[0]}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:border-[#d4af37] [appearance:textfield]"
            />
          </div>
        </div>
        {/* Visual range bar */}
        <div className="mt-3 relative h-1.5 bg-white/10 rounded-full">
          <div
            className="absolute h-full bg-[#d4af37] rounded-full"
            style={{
              left: `${(priceRange[0] / 2000) * 100}%`,
              right: `${100 - (priceRange[1] / 2000) * 100}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-white/40 text-xs mt-1">
          <span>$0</span>
          <span>$2,000+</span>
        </div>
      </div>

      {/* Star Rating */}
      <div className="pt-5 border-t border-white/10">
        <h3 className="text-white text-sm font-medium mb-3">Star Rating</h3>
        <div className="space-y-2.5">
          {[5, 4, 3].map((s) => (
            <button
              key={s}
              onClick={() => toggleStar(s)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border transition-all duration-200
                ${selectedStars.includes(s)
                  ? 'bg-[#d4af37]/15 border-[#d4af37]/50 text-[#d4af37]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'}`}
            >
              <div className="flex gap-0.5">
                {[...Array(s)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-sm">{s} Stars</span>
              {selectedStars.includes(s) && <Check className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="pt-5 border-t border-white/10">
        <h3 className="text-white text-sm font-medium mb-3">Amenities</h3>
        <div className="space-y-2">
          {AMENITY_OPTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => toggleAmenity(key)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border transition-all duration-200
                ${selectedAmenities.includes(key)
                  ? 'bg-[#d4af37]/15 border-[#d4af37]/50 text-[#d4af37]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'}`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
              {selectedAmenities.includes(key) && <Check className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="pt-5 border-t border-white/10">
        <h3 className="text-white text-sm font-medium mb-3">Property Type</h3>
        <div className="space-y-2">
          {['Hotel', 'Resort', 'Apartment'].map((type) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border transition-all duration-200
                ${selectedTypes.includes(type)
                  ? 'bg-[#d4af37]/15 border-[#d4af37]/50 text-[#d4af37]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'}`}
            >
              <span className="text-sm">{type}</span>
              {selectedTypes.includes(type) && <Check className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Rating */}
      <div className="pt-5 border-t border-white/10">
        <h3 className="text-white text-sm font-medium mb-3">Guest Rating</h3>
        <div className="space-y-2">
          {GUEST_RATING_OPTIONS.map(({ label, min }) => (
            <button
              key={min}
              onClick={() => setMinGuestRating(minGuestRating === min ? null : min)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border transition-all duration-200
                ${minGuestRating === min
                  ? 'bg-[#d4af37]/15 border-[#d4af37]/50 text-[#d4af37]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'}`}
            >
              <span className="text-sm">{label}</span>
              {minGuestRating === min && <Check className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search bar state (populated from URL params on mount)
  const [locationInput, setLocationInput] = useState(searchParams.get('location') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');

  // Filter state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minGuestRating, setMinGuestRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('popularity');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch hotels from API
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        const loc = searchParams.get('location');
        if (loc) params.location = loc;
        const res = await api.get('/hotels', { params });
        const data = res.data;
        const items = data.items || data;
        setAllHotels(items.map(mapApiHotel));
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
        setAllHotels([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [searchParams.get('location')]);

  // Active filter count for badge
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (priceRange[0] > 0 || priceRange[1] < 2000) n++;
    n += selectedStars.length;
    n += selectedAmenities.length;
    n += selectedTypes.length;
    if (minGuestRating) n++;
    return n;
  }, [priceRange, selectedStars, selectedAmenities, selectedTypes, minGuestRating]);

  const toggleStar = (s: number) =>
    setSelectedStars((prev) => prev.includes(s) ? prev.filter((r) => r !== s) : [...prev, s]);
  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  const toggleType = (t: string) =>
    setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  const clearFilters = () => {
    setPriceRange([0, 2000]);
    setSelectedStars([]);
    setSelectedAmenities([]);
    setSelectedTypes([]);
    setMinGuestRating(null);
  };

  // ── Live filtering ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let hotels = allHotels.filter((h) => {
      // Location (from search bar)
      if (locationInput.trim()) {
        const q = locationInput.toLowerCase();
        if (!h.location.toLowerCase().includes(q) && !h.name.toLowerCase().includes(q)) return false;
      }
      // Price
      if (h.price < priceRange[0] || h.price > priceRange[1]) return false;
      // Stars
      if (selectedStars.length && !selectedStars.includes(h.starRating)) return false;
      // Amenities (must have ALL selected)
      if (selectedAmenities.length && !selectedAmenities.every((a) => h.amenities.includes(a))) return false;
      // Property type
      if (selectedTypes.length && !selectedTypes.includes(h.propertyType)) return false;
      // Guest rating
      if (minGuestRating && h.guestRating < minGuestRating) return false;
      return true;
    });

    // Sort
    switch (sortBy) {
      case 'price_asc':   hotels.sort((a, b) => a.price - b.price); break;
      case 'price_desc':  hotels.sort((a, b) => b.price - a.price); break;
      case 'rating':      hotels.sort((a, b) => b.guestRating - a.guestRating); break;
      case 'stars':       hotels.sort((a, b) => b.starRating - a.starRating); break;
      default:            hotels.sort((a, b) => b.id - a.id); // popularity = newest
    }
    return hotels;
  }, [allHotels, locationInput, priceRange, selectedStars, selectedAmenities, selectedTypes, minGuestRating, sortBy]);

  // ── Active Filter Chips ─────────────────────────────────────────────────────
  const activeChips: { label: string; onRemove: () => void }[] = useMemo(() => {
    const chips = [];
    if (priceRange[0] > 0 || priceRange[1] < 2000)
      chips.push({ label: `$${priceRange[0]}–$${priceRange[1]}`, onRemove: () => setPriceRange([0, 2000]) });
    selectedStars.forEach((s) =>
      chips.push({ label: `${s} Stars`, onRemove: () => toggleStar(s) }));
    selectedAmenities.forEach((a) => {
      const opt = AMENITY_OPTIONS.find((o) => o.key === a);
      chips.push({ label: opt?.label ?? a, onRemove: () => toggleAmenity(a) });
    });
    selectedTypes.forEach((t) =>
      chips.push({ label: t, onRemove: () => toggleType(t) }));
    if (minGuestRating)
      chips.push({ label: `${minGuestRating}+ Rating`, onRemove: () => setMinGuestRating(null) });
    return chips;
  }, [priceRange, selectedStars, selectedAmenities, selectedTypes, minGuestRating]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (locationInput) params.set('location', locationInput);
    if (checkIn)        params.set('checkIn', checkIn);
    if (checkOut)       params.set('checkOut', checkOut);
    if (guests)         params.set('guests', guests);
    navigate(`/search?${params.toString()}`);
  };

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    const diff = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000;
    return diff > 0 ? diff : null;
  }, [checkIn, checkOut]);

  // Close sort menu on outside click
  useEffect(() => {
    const handler = () => setShowSortMenu(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const filterPanelProps = {
    priceRange, setPriceRange,
    selectedStars, toggleStar,
    selectedAmenities, toggleAmenity,
    selectedTypes, toggleType,
    minGuestRating, setMinGuestRating,
    onClear: clearFilters,
    activeCount: activeFilterCount,
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] font-sans">

      {/* ── Sticky Top Search Bar ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-[#0a0e27]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-1.5 text-white/50 hover:text-[#d4af37] text-sm mb-3 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="bg-[#151a3d]/70 border border-white/10 rounded-2xl p-3">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {/* Location */}
              <div className="col-span-2 md:col-span-1 flex items-center gap-2 bg-white/5 px-3 py-2.5 rounded-xl border border-white/10 focus-within:border-[#d4af37] transition-colors">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0" />
                <input
                  type="text"
                  placeholder="Destination"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="bg-transparent text-white text-sm outline-none w-full placeholder:text-white/40"
                />
              </div>

              {/* Check-in */}
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2.5 rounded-xl border border-white/10 focus-within:border-[#d4af37] transition-colors">
                <Calendar className="w-4 h-4 text-[#d4af37] shrink-0" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent text-white text-sm outline-none w-full [color-scheme:dark]"
                />
              </div>

              {/* Check-out */}
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2.5 rounded-xl border border-white/10 focus-within:border-[#d4af37] transition-colors">
                <Calendar className="w-4 h-4 text-[#d4af37] shrink-0" />
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-white text-sm outline-none w-full [color-scheme:dark]"
                />
              </div>

              {/* Guests */}
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2.5 rounded-xl border border-white/10 focus-within:border-[#d4af37] transition-colors">
                <Users className="w-4 h-4 text-[#d4af37] shrink-0" />
                <input
                  type="number"
                  min={1}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="bg-transparent text-white text-sm outline-none w-full [appearance:textfield]"
                />
                <span className="text-white/40 text-xs shrink-0">guests</span>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 bg-[#d4af37] text-[#0a0e27] font-semibold
                           px-4 py-2.5 rounded-xl hover:bg-[#c4a037] hover:shadow-lg hover:shadow-[#d4af37]/30
                           transition-all duration-300"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search</span>
              </button>
            </div>

            {/* Stay summary */}
            {nights && (
              <p className="mt-2 text-center text-white/40 text-xs">
                {formatDate(checkIn)} → {formatDate(checkOut)} · {nights} night{nights !== 1 ? 's' : ''} · {guests} guest{Number(guests) !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl text-white">
                {locationInput ? `Hotels in ${locationInput}` : 'All Hotels'}
              </h1>
              <p className="text-white/50 mt-1">
                <span className="text-[#d4af37] font-semibold">{filtered.length}</span> properties found
                {activeFilterCount > 0 && (
                  <span className="ml-2 text-white/30">· {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile filter button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 bg-[#151a3d]/60 border border-white/10 text-white
                           px-4 py-2.5 rounded-xl hover:border-[#d4af37]/50 transition-all"
              >
                <Filter className="w-4 h-4 text-[#d4af37]" />
                <span className="text-sm">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-[#d4af37] text-[#0a0e27] text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 bg-[#151a3d]/60 border border-white/10 text-white
                             px-4 py-2.5 rounded-xl hover:border-[#d4af37]/50 transition-all min-w-[180px]"
                >
                  <ArrowUpDown className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-sm flex-1 text-left">
                    {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-52 bg-[#151a3d] border border-white/10 rounded-xl
                                 shadow-2xl z-20 overflow-hidden"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between
                            ${sortBy === opt.value
                              ? 'bg-[#d4af37]/15 text-[#d4af37]'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                        >
                          {opt.label}
                          {sortBy === opt.value && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeChips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-wrap gap-2 mt-4"
            >
              {activeChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={chip.onRemove}
                  className="flex items-center gap-2 bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]
                             px-3 py-1.5 rounded-full text-sm hover:bg-[#d4af37]/25 transition-colors"
                >
                  {chip.label}
                  <X className="w-3.5 h-3.5" />
                </button>
              ))}
              <button
                onClick={clearFilters}
                className="text-white/40 hover:text-white/70 text-sm transition-colors px-2"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-4 gap-8">

          {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
          <div className="hidden lg:block lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#151a3d]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-40"
            >
              <FilterPanel {...filterPanelProps} />
            </motion.div>
          </div>

          {/* ── Results ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-10 h-10 text-[#d4af37] animate-spin mb-4" />
                <p className="text-white/50">Searching for hotels...</p>
              </div>
            ) : (
            <>
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-[#d4af37]/50" />
                  </div>
                  <h2 className="text-2xl text-white mb-2">No hotels found</h2>
                  <p className="text-white/50 mb-6">Try adjusting your filters or search in a different location.</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-[#d4af37] text-[#0a0e27] font-semibold rounded-xl hover:bg-[#c4a037] transition-colors"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-5">
                  {filtered.map((hotel, i) => (
                    <HotelCard key={hotel.id} hotel={hotel} index={i} />
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Results count footer */}
            {filtered.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 text-center text-white/30 text-sm"
              >
                Showing all {filtered.length} properties
              </motion.p>
            )}
            </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#0f1330] border-l border-white/10
                         z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg text-white font-semibold">Filter Hotels</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterPanel {...filterPanelProps} />

                {/* Apply */}
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="mt-8 w-full py-3.5 bg-[#d4af37] text-[#0a0e27] font-semibold rounded-xl
                             hover:bg-[#c4a037] transition-colors"
                >
                  Show {filtered.length} Properties
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
