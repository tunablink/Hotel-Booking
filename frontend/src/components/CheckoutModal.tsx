import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { X } from 'lucide-react';

interface CheckoutModalProps {
  room: {
    id: number;
    name: string;
    price_per_night: number;
    hotel_name?: string;
  };
  onClose: () => void;
}

export default function CheckoutModal({ room, onClose }: CheckoutModalProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Basic calculation for total price
  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (nights <= 0) nights = 1; // min 1 night
    return (nights * room.price_per_night).toFixed(2);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      // Force them to login to book
      navigate('/login');
      return;
    }
    
    setLoading(true);
    setError('');

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    
    if (inDate >= outDate) {
      setError('Check-out must be after Check-in');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/bookings', {
        room_id: room.id,
        check_in: inDate.toISOString(),
        check_out: outDate.toISOString(),
      });
      
      const price = calculateTotalPrice();
      // Navigate to success passing state
      navigate('/booking-success', {
        state: {
          bookingId: res.data.id,
          hotelName: room.hotel_name || 'Antigravity Hotel',
          checkIn,
          checkOut,
          totalPrice: price,
          roomName: room.name,
        }
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md rounded-xl border border-border/50 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-serif text-gold-500 mb-2">Reserve Room</h2>
          <p className="text-muted-foreground text-sm mb-6">{room.name} — ${room.price_per_night} / night</p>
          
          {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded mb-4">{error}</div>}
          
          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Check-in Date</label>
              <input 
                type="date" 
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Check-out Date</label>
              <input 
                type="date" 
                required
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-gold-500"
              />
            </div>
            
            <div className="py-2 border-t border-border mt-4 flex justify-between items-center">
              <span className="text-muted-foreground">Total Price</span>
              <span className="text-xl font-medium text-gold-400">${calculateTotalPrice()}</span>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gold-500 text-black py-2.5 rounded-md font-semibold hover:bg-gold-400 transition-colors mt-2"
            >
               {loading ? 'Processing...' : (user ? 'Confirm Booking' : 'Sign in to Book')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
