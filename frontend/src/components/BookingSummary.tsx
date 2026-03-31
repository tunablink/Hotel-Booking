import { motion } from 'framer-motion';
import { Calendar, Users, Shield, CreditCard } from 'lucide-react';
import { Button } from './ui/button';

export function BookingSummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="sticky top-8"
    >
      <div className="bg-[#151a3d]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl text-white mb-6">Booking Summary</h2>

        {/* Check-in / Check-out */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/10">
            <Calendar className="w-5 h-5 text-[#d4af37]" />
            <div>
              <p className="text-white/40 text-xs">Check-in</p>
              <p className="text-white text-sm">Mar 25, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/10">
            <Calendar className="w-5 h-5 text-[#d4af37]" />
            <div>
              <p className="text-white/40 text-xs">Check-out</p>
              <p className="text-white text-sm">Mar 28, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/10">
            <Users className="w-5 h-5 text-[#d4af37]" />
            <div>
              <p className="text-white/40 text-xs">Guests</p>
              <p className="text-white text-sm">2 Adults</p>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="border-t border-white/10 pt-4 mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Duration</span>
            <span className="text-white">3 nights</span>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-white/10 pt-4 mb-6">
          <h3 className="text-white mb-3">Price Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Room rate (3 nights)</span>
              <span className="text-white">$1,350</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Taxes & fees</span>
              <span className="text-white">$189</span>
            </div>
            <div className="flex justify-between text-sm text-green-400">
              <span>Early bird discount</span>
              <span>-$135</span>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-white/10 pt-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-white text-lg">Total</span>
            <span className="text-[#d4af37] text-3xl font-semibold">$1,404</span>
          </div>
          <p className="text-white/40 text-xs mt-1 text-right">Includes all taxes</p>
        </div>

        {/* Book Button */}
        <Button className="w-full bg-[#d4af37] text-[#0a0e27] hover:bg-[#c4a037] py-6 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#d4af37]/30">
          Reserve Now
        </Button>

        {/* Trust Badges */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Shield className="w-4 h-4 text-green-400" />
            <span>Free cancellation until Mar 23</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <CreditCard className="w-4 h-4 text-[#d4af37]" />
            <span>No payment needed today</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
