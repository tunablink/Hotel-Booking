import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Star, ChevronDown, ChevronUp, Wifi, Waves, Dumbbell,
  UtensilsCrossed, Car, Wind, Coffee, Shield, Clock, Sparkles, AlertCircle
} from 'lucide-react';
import api from '../services/api';

// --- INLINE COMPONENTS ---

const ReviewCard = ({ avatar, name, rating, date, review }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-[#151a3d]/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h4 className="text-white font-medium">{name}</h4>
          <p className="text-white/60 text-sm">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 bg-[#d4af37]/10 px-2 py-1 rounded-lg">
        <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
        <span className="text-[#d4af37] text-sm font-semibold">{rating.toFixed(1)}</span>
      </div>
    </div>
    <p className="text-white/80 leading-relaxed italic">"{review}"</p>
  </motion.div>
);

const RoomCard = ({ room, onSelect }: any) => {
  return (
    <div className="bg-[#151a3d]/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-[#d4af37]/30 transition-all flex flex-col md:flex-row">
      <div className="w-full md:w-2/5 h-48 md:h-auto relative">
        <img 
          src={room.photos?.[0]?.url || 'https://images.unsplash.com/photo-1509647924673-bbb53e22eeb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-[#0a0e27]/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 border border-white/10">
          <Sparkles className="w-3 h-3 text-[#d4af37]" /> Premium
        </div>
      </div>
      <div className="p-6 w-full md:w-3/5 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-serif text-white">{room.name}</h3>
          <div className="text-right">
            <span className="text-2xl font-semibold text-[#d4af37]">${room.price_per_night}</span>
            <span className="text-white/60 text-sm block">/ night</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-white/60 text-sm mb-4">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {room.capacity * 10} m²</span>
          <span className="flex items-center gap-1"><Star className="w-4 h-4" /> Up to {room.capacity} Guests</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {room.amenities?.map((am: any, i: number) => (
            <span key={i} className="text-xs px-2 py-1 bg-white/5 border border-white/10 text-white/80 rounded">
              {am.name}
            </span>
          ))}
        </div>
        <button 
          onClick={() => onSelect(room)}
          className="mt-auto w-full bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0e27] py-2 rounded-lg font-medium transition-colors"
        >
          Select Room
        </button>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // Booking Form State
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [bookingError, setBookingError] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    api.get(`/hotels/${id}`)
      .then(res => setHotel(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center text-[#d4af37] font-serif text-2xl">Loading luxury...</div>;
  }
  if (!hotel) {
    return <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center text-red-400">Hotel not found</div>;
  }

  // Derived data
  const hotelImages = hotel.photos?.map((p: any) => p.url).filter(Boolean) || [];
  const roomImages = hotel.rooms?.flatMap((r: any) => r.photos?.map((p: any) => p.url)).filter(Boolean) || [];
  const galleryImages = Array.from(new Set([...hotelImages, ...roomImages]));
  if (galleryImages.length === 0) {
    galleryImages.push('https://images.unsplash.com/photo-1762421028657-347de51e7707?q=80&w=2000');
    galleryImages.push('https://images.unsplash.com/photo-1738407283641-5e127f36f47d?q=80&w=2000');
  }
  const mapQuery = hotel.latitude != null && hotel.longitude != null
    ? `${hotel.latitude},${hotel.longitude}`
    : hotel.location;
  const mapEmbedUrl = hotel.map_embed_url || `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  const reviews = [
    {
      avatar: 'https://images.unsplash.com/photo-1770364019396-36ae51854520?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=256&h=256&q=80',
      name: 'Sarah Johnson',
      rating: 5.0,
      date: 'March 10, 2026',
      review: 'An absolutely stunning hotel with impeccable service. The rooms are spacious and luxurious, and the staff went above and beyond to make our stay memorable.'
    },
    {
      avatar: 'https://images.unsplash.com/photo-1605298046196-e205d0d699d7?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=256&h=256&q=80',
      name: 'Michael Chen',
      rating: 4.8,
      date: 'March 5, 2026',
      review: 'Perfect location in the heart of the city. The concierge service was excellent and helped us plan our entire trip. Will definitely return!'
    }
  ];

  const amenities = [
    { icon: Wifi, name: 'Free WiFi' },
    { icon: Waves, name: 'Swimming Pool' },
    { icon: Sparkles, name: 'Luxury Spa' },
    { icon: Dumbbell, name: 'Fitness Center' },
    { icon: UtensilsCrossed, name: 'Fine Dining' },
    { icon: Car, name: 'Valet Parking' },
  ];

  const shortDescription = hotel.description || `Experience unparalleled luxury at ${hotel.name}, a prestigious 5-star establishment in the heart of the city.`;
  const fullDescription = `${shortDescription} Our hotel combines timeless elegance with modern amenities, offering guests an unforgettable stay. Each of our meticulously designed rooms and suites features premium furnishings, marble bathrooms, and panoramic city views. Indulge in world-class dining at our Michelin-starred restaurant, rejuvenate at our award-winning spa, or take a refreshing dip in our rooftop infinity pool.`;

  // Booking Logic
  const handleBooking = () => {
    if (!selectedRoom) {
      setBookingError('Please select a room first.');
      return;
    }
    if (!checkIn || !checkOut) {
      setBookingError('Please select both Check-in and Check-out dates.');
      return;
    }
    const cin = new Date(checkIn);
    const cout = new Date(checkOut);
    if (cin >= cout) {
      setBookingError('Check-out must be after Check-in.');
      return;
    }

    setBookingError('');
    const days = Math.ceil((cout.getTime() - cin.getTime()) / (1000 * 60 * 60 * 24));
    const price = selectedRoom.price_per_night * days;

    navigate('/checkout', {
      state: {
        hotel,
        selectedRoom,
        checkIn,
        checkOut,
        guests,
        totalDays: days,
        totalPrice: price,
      },
    });
  };

  // Calculate pricing
  let totalDays = 0;
  let totalPrice = 0;
  if (checkIn && checkOut && selectedRoom) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end > start) {
      totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      totalPrice = totalDays * selectedRoom.price_per_night;
    }
  }

  return (
    <div className="bg-[#0a0e27] min-h-screen">
      {/* Image Gallery Section using Native Flex Scroll */}
      <div className="relative group">
        <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar h-[500px] md:h-[600px] w-full">
          {galleryImages.map((image: string, index: number) => (
            <div key={index} className="relative min-w-full h-full snap-start">
              <img src={image} alt={`${hotel.name} view ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-transparent to-transparent" />
            </div>
          ))}
        </div>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/20 transition-all duration-300"
        >
          View all {galleryImages.length} photos
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Hotel Information */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{hotel.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#d4af37] text-[#d4af37]" />)}
                <span className="text-[#d4af37] ml-2">{hotel.rating.toFixed(1)}</span>
                <span className="text-white/60">({reviews.length} reviews)</span>
              </div>

              <div className="flex items-center gap-2 text-white/80 mb-6 font-light">
                <MapPin className="w-5 h-5 text-[#d4af37]" />
                <span>{hotel.location}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {['Luxury', 'Free WiFi', 'Breakfast Included', 'Spa Access', 'Pool'].map((tag, index) => (
                  <div key={index} className="bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] px-4 py-2 rounded-full text-sm font-medium">
                    {tag}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Description Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-[#151a3d]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-serif text-white mb-4">About this hotel</h2>
              <p className="text-white/70 leading-relaxed mb-4 font-light">
                {isDescriptionExpanded ? fullDescription : shortDescription}
              </p>
              <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="flex items-center gap-2 text-[#d4af37] hover:text-[#c4a037] transition-colors font-medium">
                {isDescriptionExpanded ? <><span className="underline underline-offset-4">Show less</span><ChevronUp className="w-4 h-4" /></> : <><span className="underline underline-offset-4">Read more</span><ChevronDown className="w-4 h-4" /></>}
              </button>
            </motion.div>

            {/* Amenities Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-[#151a3d]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-serif text-white mb-6">Hotel Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {amenities.map((amenity, index) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={index} className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[#d4af37]/30">
                      <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#d4af37]" />
                      </div>
                      <span className="text-white/80 text-sm text-center font-medium">{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Room Selection Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="scroll-mt-24" id="rooms">
              <h2 className="text-3xl font-serif text-white mb-6">Choose Your Room</h2>
              <div className="space-y-6">
                {hotel.rooms?.length > 0 ? (
                  hotel.rooms.map((room: any) => (
                    <RoomCard key={room.id} room={room} onSelect={(r: any) => { setSelectedRoom(r); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                  ))
                ) : (
                  <p className="text-white/60">No rooms currently available.</p>
                )}
              </div>
            </motion.div>

            {/* Reviews Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-serif text-white">Guest Reviews</h2>
                <div className="flex items-center gap-2 bg-[#d4af37]/20 px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 fill-[#d4af37] text-[#d4af37]" />
                  <span className="text-[#d4af37] font-semibold">4.9 / 5.0</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {reviews.map((review, index) => <ReviewCard key={index} {...review} />)}
              </div>
            </motion.div>

            {/* Location Map Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-[#151a3d]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-serif text-white mb-4">Location</h2>
              <div className="mb-4">
                <p className="text-white/80 mb-2"><strong>Address:</strong> {hotel.location}</p>
                <p className="text-white/60 text-sm font-light">Perfectly located with easy access to main attractions, world-class shopping, and local dining favorites.</p>
              </div>
              <div className="relative h-96 bg-[#0a0e27]/60 rounded-xl overflow-hidden border border-white/10 shadow-inner">
                <iframe
                  title={`${hotel.name} map`}
                  src={mapEmbedUrl}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </motion.div>

          </div>

          {/* Right Column - Sticky Booking Summary inline */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-[#151a3d]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-2xl font-serif text-white mb-6 border-b border-white/10 pb-4">Reserve Your Stay</h3>
              
              {bookingError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{bookingError}</span>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-white/70 block mb-1.5 uppercase tracking-wider">Check-in</label>
                  <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-lg px-4 h-12 text-white outline-none focus:border-[#d4af37]" />
                </div>
                <div>
                  <label className="text-sm text-white/70 block mb-1.5 uppercase tracking-wider">Check-out</label>
                  <input type="date" value={checkOut} min={checkIn} onChange={e => setCheckOut(e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-lg px-4 h-12 text-white outline-none focus:border-[#d4af37]" />
                </div>
                <div>
                  <label className="text-sm text-white/70 block mb-1.5 uppercase tracking-wider">Guests</label>
                  <input type="number" min="1" value={guests} onChange={e => setGuests(e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-lg px-4 h-12 text-white outline-none focus:border-[#d4af37]" />
                </div>
              </div>

              {selectedRoom ? (
                <div className="bg-[#0a0e27]/50 rounded-xl p-4 mb-6 border border-[#d4af37]/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{selectedRoom.name}</span>
                    <button onClick={() => setSelectedRoom(null)} className="text-[#d4af37] text-xs underline">Change</button>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className="text-white/60">${selectedRoom.price_per_night} x {totalDays || 1} nights</span>
                    <span className="text-white">${totalPrice || selectedRoom.price_per_night}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-white/10 font-serif">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-2xl text-[#d4af37] font-semibold">${totalPrice || selectedRoom.price_per_night}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0a0e27]/50 rounded-xl p-4 mb-6 border border-white/5 text-center">
                  <p className="text-white/50 text-sm">Please select a room below to see pricing details.</p>
                  <a href="#rooms" className="text-[#d4af37] text-sm mt-2 inline-block underline underline-offset-4">Browse Rooms</a>
                </div>
              )}

              <button 
                onClick={handleBooking}
                disabled={isBooking}
                className="w-full bg-[#d4af37] text-[#0a0e27] hover:bg-[#c4a037] h-14 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isBooking ? 'Processing...' : 'Complete Booking'}
              </button>
              
              <p className="text-center text-white/40 text-xs mt-4">You won't be charged yet</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
