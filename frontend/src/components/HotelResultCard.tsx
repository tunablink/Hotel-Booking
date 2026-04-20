import { MapPin, Star, Wifi, Waves, Car, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { ReactNode } from 'react';

interface HotelResultCardProps {
  image: string;
  name: string;
  location: string;
  starRating: number;
  description: string;
  amenities: string[];
  guestRating: number;
  guestRatingText: string;
  price: number;
  urgencyText?: string;
  freeCancellation?: boolean;
  breakfastIncluded?: boolean;
}

export function HotelResultCard({
  image,
  name,
  location,
  starRating,
  description,
  amenities,
  guestRating,
  guestRatingText,
  price,
  urgencyText,
  freeCancellation,
  breakfastIncluded,
}: HotelResultCardProps) {
  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: ReactNode } = {
      wifi: <Wifi className="w-4 h-4" />,
      pool: <Waves className="w-4 h-4" />,
      parking: <Car className="w-4 h-4" />,
      restaurant: <Coffee className="w-4 h-4" />,
    };
    return iconMap[amenity.toLowerCase()] || null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-[#151a3d]/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-[#d4af37]/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-[#d4af37]/10"
    >
      <div className="grid md:grid-cols-3 gap-0">
        {/* Hotel Image */}
        <div className="relative overflow-hidden h-64 md:h-auto">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27]/80 to-transparent" />
          
          {/* Badges on Image */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {freeCancellation && (
              <Badge className="bg-green-500/90 text-white border-none">
                Free Cancellation
              </Badge>
            )}
            {breakfastIncluded && (
              <Badge className="bg-[#d4af37]/90 text-[#0a0e27] border-none">
                Breakfast Included
              </Badge>
            )}
          </div>
        </div>

        {/* Hotel Details */}
        <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Hotel Name and Star Rating */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-2xl text-white group-hover:text-[#d4af37] transition-colors">
                {name}
              </h3>
              <div className="flex items-center gap-1 ml-4">
                {[...Array(starRating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#d4af37] text-[#d4af37]"
                  />
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-white/60 mb-3">
              <MapPin className="w-4 h-4 text-[#d4af37]" />
              <span className="text-sm">{location}</span>
            </div>

            {/* Description */}
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              {description}
            </p>

            {/* Amenities */}
            <div className="flex flex-wrap gap-3 mb-4">
              {amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
                >
                  <span className="text-[#d4af37]">{getAmenityIcon(amenity)}</span>
                  <span className="text-white/80 text-xs capitalize">{amenity}</span>
                </div>
              ))}
            </div>

            {/* Urgency Text */}
            {urgencyText && (
              <p className="text-orange-400 text-sm mb-4">{urgencyText}</p>
            )}
          </div>

          {/* Price and Rating Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-4 border-t border-white/10">
            {/* Guest Rating */}
            <div className="flex items-center gap-3">
              <div className="bg-[#d4af37] text-[#0a0e27] px-3 py-2 rounded-lg">
                <span className="font-semibold">{guestRating.toFixed(1)}</span>
              </div>
              <div>
                <p className="text-white text-sm">{guestRatingText}</p>
                <p className="text-white/40 text-xs">Based on guest reviews</p>
              </div>
            </div>

            {/* Price and Button */}
            <div className="flex items-end gap-4">
              <div className="text-right">
                <p className="text-white/60 text-xs mb-1">Price per night</p>
                <p className="text-3xl text-[#d4af37]">
                  ${price.toLocaleString()}
                </p>
              </div>
              <Button className="bg-[#d4af37] text-[#0a0e27] hover:bg-[#c4a037] px-6 py-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#d4af37]/30">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
