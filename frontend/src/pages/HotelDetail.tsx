import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Wifi, Waves, Dumbbell,
  UtensilsCrossed, Car, Sparkles, AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

// --- INLINE COMPONENTS ---

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'G';
};

const formatReviewDate = (date: string) => {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(parsedDate);
};

const ReviewCard = ({ avatar, name, rating, date, review }: any) => {
  const safeRating = Number(rating) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#151a3d]/40 backdrop-blur-xl border border-white/10 p-6 rounded-lg"
    >
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex items-center gap-4">
          {avatar ? (
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center font-semibold">
              {getInitials(name)}
            </div>
          )}
          <div>
            <h4 className="text-white font-medium">{name}</h4>
            <p className="text-white/60 text-sm">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#d4af37]/10 px-2 py-1 rounded-lg shrink-0">
          <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
          <span className="text-[#d4af37] text-sm font-semibold">{safeRating.toFixed(1)}</span>
        </div>
      </div>
      <p className="text-white/80 leading-relaxed italic">"{review}"</p>
    </motion.div>
  );
};

const RoomCard = ({ room, onSelect, isSelected }: any) => {
  return (
    <div className={`bg-[#151a3d]/40 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all flex flex-col md:flex-row ${
      isSelected ? 'border-[#d4af37] shadow-lg shadow-[#d4af37]/15' : 'border-white/10 hover:border-[#d4af37]/30'
    }`}>
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
          type="button"
          onClick={() => onSelect(room)}
          className={`mt-auto w-full border border-[#d4af37] py-2 rounded-lg font-medium transition-colors ${
            isSelected
              ? 'bg-[#d4af37] text-[#0a0e27]'
              : 'bg-transparent text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0e27]'
          }`}
        >
          {isSelected ? 'Selected Room' : 'Select Room'}
        </button>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Booking Form State
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [bookingError, setBookingError] = useState('');
  const [isBooking] = useState(false);

  useEffect(() => {
    const fetchHotelData = async () => {
      setLoading(true);
      setReviewsLoading(true);
      try {
        const hotelResponse = await api.get(`/hotels/${id}`);
        setHotel(hotelResponse.data);
        setCurrentPhotoIndex(0);

        try {
          const reviewsResponse = await api.get(`/hotels/${id}/reviews`);
          setReviews(reviewsResponse.data);
        } catch (reviewsError) {
          console.error(reviewsError);
          setReviews([]);
        }
      } catch (err) {
        console.error(err);
        setHotel(null);
      } finally {
        setLoading(false);
        setReviewsLoading(false);
      }
    };

    fetchHotelData();
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
  const activePhoto = galleryImages[currentPhotoIndex] || galleryImages[0];
  const hasMultiplePhotos = galleryImages.length > 1;
  const goToPreviousPhoto = () => {
    setCurrentPhotoIndex((index) => (index === 0 ? galleryImages.length - 1 : index - 1));
  };
  const goToNextPhoto = () => {
    setCurrentPhotoIndex((index) => (index + 1) % galleryImages.length);
  };
  const mapQuery = hotel.latitude != null && hotel.longitude != null
    ? `${hotel.latitude},${hotel.longitude}`
    : hotel.location;
  const mapEmbedUrl = hotel.map_embed_url || `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  const hasReviews = reviews.length > 0;
  const averageReviewRating = hasReviews
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
    : 0;
  const displayRating = averageReviewRating.toFixed(1);
  const canReview = Boolean(user?.id);
  const reviewUserName = user?.full_name || user?.email || 'Guest';

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
  const handleRoomSelect = (room: any) => {
    setSelectedRoom(room);
    setBookingError('');
  };

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

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!canReview) {
      setReviewError('Please log in before leaving a review.');
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError('Please write a short comment about your stay.');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const response = await api.post(`/hotels/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      const nextReviews = [response.data, ...reviews];
      const nextAverage = nextReviews.reduce(
        (sum, review) => sum + Number(review.rating || 0),
        0
      ) / nextReviews.length;

      setReviews(nextReviews);
      setHotel((currentHotel: any) => ({
        ...currentHotel,
        rating: Number(nextAverage.toFixed(1)),
      }));
      setReviewRating(5);
      setReviewComment('');
      setReviewSuccess('Thanks for sharing your review.');
    } catch (error: any) {
      if (error.response?.status === 401) {
        setReviewError('Please log in again before leaving a review.');
      } else {
        setReviewError(error.response?.data?.detail || 'Could not submit your review. Please try again.');
      }
    } finally {
      setIsSubmittingReview(false);
    }
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
      {/* Image Gallery Section */}
      <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden group">
        <img
          key={activePhoto}
          src={activePhoto}
          alt={`${hotel.name} view ${currentPhotoIndex + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-transparent to-transparent" />

        {hasMultiplePhotos && (
          <>
            <button
              type="button"
              onClick={goToPreviousPhoto}
              aria-label="Previous photo"
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg bg-[#0a0e27]/55 hover:bg-[#0a0e27]/80 border border-white/20 text-white backdrop-blur-md flex items-center justify-center transition-all duration-300"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              type="button"
              onClick={goToNextPhoto}
              aria-label="Next photo"
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg bg-[#0a0e27]/55 hover:bg-[#0a0e27]/80 border border-white/20 text-white backdrop-blur-md flex items-center justify-center transition-all duration-300"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </>
        )}

        <div className="absolute bottom-8 left-4 md:left-1/2 md:-translate-x-1/2 bg-[#0a0e27]/55 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/20 text-sm">
          {currentPhotoIndex + 1} / {galleryImages.length}
        </div>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-8 right-4 md:right-8 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-3 rounded-lg border border-white/20 transition-all duration-300"
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
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(averageReviewRating) ? 'fill-[#d4af37] text-[#d4af37]' : 'text-white/30'}`}
                  />
                ))}
                <span className="text-[#d4af37] ml-2">{displayRating}</span>
                <span className="text-white/60">
                  {hasReviews ? `(${reviews.length} reviews)` : '(No reviews yet)'}
                </span>
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
                    <RoomCard
                      key={room.id}
                      room={room}
                      onSelect={handleRoomSelect}
                      isSelected={selectedRoom?.id === room.id}
                    />
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
                  <span className="text-[#d4af37] font-semibold">
                    {hasReviews ? `${displayRating} / 5.0` : 'No reviews yet'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleReviewSubmit} className="bg-[#151a3d]/40 backdrop-blur-xl border border-white/10 rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-serif text-white">Share your stay</h3>
                    <p className="text-white/60 text-sm">
                      {canReview ? `Posting as ${reviewUserName}` : 'Log in to add your rating and comment.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1" aria-label="Select rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60"
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            star <= reviewRating
                              ? 'fill-[#d4af37] text-[#d4af37]'
                              : 'text-white/30 hover:text-[#d4af37]/70'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  placeholder="Tell future guests what stood out..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-[#d4af37] resize-none"
                  maxLength={1000}
                />

                {reviewError && (
                  <p className="mt-3 text-sm text-red-400">{reviewError}</p>
                )}
                {reviewSuccess && (
                  <p className="mt-3 text-sm text-emerald-400">{reviewSuccess}</p>
                )}

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-white/40 text-xs">{reviewComment.length}/1000 characters</span>
                  <button
                    type={canReview ? 'submit' : 'button'}
                    onClick={!canReview ? () => navigate('/login') : undefined}
                    disabled={isSubmittingReview}
                    className="bg-[#d4af37] text-[#0a0e27] hover:bg-[#c4a037] px-5 h-11 rounded-lg font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmittingReview ? 'Submitting...' : canReview ? 'Submit Review' : 'Log In to Review'}
                  </button>
                </div>
              </form>

              <div className="grid md:grid-cols-2 gap-6">
                {reviewsLoading ? (
                  <div className="md:col-span-2 bg-[#151a3d]/40 border border-white/10 rounded-lg p-6 text-white/60">
                    Loading guest reviews...
                  </div>
                ) : reviews.length > 0 ? (
                  reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      name={review.user_name}
                      rating={review.rating}
                      date={formatReviewDate(review.created_at)}
                      review={review.comment}
                    />
                  ))
                ) : (
                  <div className="md:col-span-2 bg-[#151a3d]/40 border border-white/10 rounded-lg p-6 text-white/60">
                    No guest reviews yet. Be the first to share your stay.
                  </div>
                )}
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
                    <button type="button" onClick={() => setSelectedRoom(null)} className="text-[#d4af37] text-xs underline">Change</button>
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
                type="button"
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
