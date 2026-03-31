import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReviewCardProps {
  avatar: string;
  name: string;
  rating: number;
  date: string;
  review: string;
}

export function ReviewCard({ avatar, name, rating, date, review }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-[#151a3d]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#d4af37]/30 transition-all duration-300"
    >
      {/* User Info */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border-2 border-[#d4af37]/30"
        />
        <div className="flex-1">
          <h4 className="text-white mb-1">{name}</h4>
          <p className="text-white/40 text-sm">{date}</p>
        </div>
        {/* Rating */}
        <div className="flex items-center gap-1 bg-[#d4af37]/20 px-3 py-1 rounded-full">
          <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
          <span className="text-[#d4af37] text-sm">{rating}</span>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-white/70 leading-relaxed">{review}</p>
    </motion.div>
  );
}
