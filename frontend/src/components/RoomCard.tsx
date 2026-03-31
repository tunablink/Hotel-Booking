import { Bed, Maximize, Wifi, Wind, Tv, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

interface RoomCardProps {
  image: string;
  roomType: string;
  bedType: string;
  roomSize: string;
  price: number;
  availability: string;
  amenities: string[];
}

export function RoomCard({
  image,
  roomType,
  bedType,
  roomSize,
  price,
  availability,
  amenities
}: RoomCardProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'ac':
        return <Wind className="w-4 h-4" />;
      case 'tv':
        return <Tv className="w-4 h-4" />;
      case 'minibar':
        return <Coffee className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-[#151a3d]/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-[#d4af37]/50 transition-all duration-300 group"
    >
      <div className="grid md:grid-cols-5 gap-0">
        {/* Room Image */}
        <div className="md:col-span-2 relative overflow-hidden h-64 md:h-auto">
          <img
            src={image}
            alt={roomType}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27]/60 to-transparent" />
        </div>

        {/* Room Details */}
        <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Room Type */}
            <h3 className="text-2xl text-white mb-2">{roomType}</h3>
            
            {/* Room Info */}
            <div className="flex flex-wrap gap-4 mb-4 text-white/60">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-[#d4af37]" />
                <span className="text-sm">{bedType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="w-4 h-4 text-[#d4af37]" />
                <span className="text-sm">{roomSize}</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-3 mb-4">
              {amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10"
                >
                  <span className="text-[#d4af37]">{getAmenityIcon(amenity)}</span>
                  <span className="text-white/80 text-sm">{amenity}</span>
                </div>
              ))}
            </div>

            {/* Availability Status */}
            <p className="text-orange-400 text-sm mb-6">{availability}</p>
          </div>

          {/* Price and Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/60 text-sm mb-1">Price per night</p>
              <p className="text-3xl text-[#d4af37]">
                ${price.toLocaleString()}
              </p>
            </div>
            <Button className="w-full sm:w-auto bg-[#d4af37] text-[#0a0e27] hover:bg-[#c4a037] px-8 py-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#d4af37]/30">
              Select Room
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
