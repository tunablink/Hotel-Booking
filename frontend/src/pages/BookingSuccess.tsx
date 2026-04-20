import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function BookingSuccess() {
  const location = useLocation();
  const state = location.state as any;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { bookingId, hotelName, checkIn, checkOut, totalPrice, roomName } = state;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="bg-card w-full max-w-lg p-8 md:p-12 rounded-2xl border border-gold-500/30 text-center shadow-[0_0_50px_rgba(212,175,55,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />
        
        <div className="inline-flex bg-gold-500/10 p-4 rounded-full mb-6 text-gold-500">
           <CheckCircle className="w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-serif text-foreground mb-2">Reservation Confirmed</h1>
        <p className="text-muted-foreground mb-8">Thank you for choosing {hotelName}. We await your arrival.</p>
        
        <div className="bg-background rounded-lg border border-border p-6 text-left space-y-4 mb-8">
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-sm">Booking ID</span>
            <span className="font-mono text-gold-400">#{bookingId}</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-sm">Suite/Room</span>
            <span className="text-foreground">{roomName}</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-sm">Check-in</span>
            <span className="text-foreground">{new Date(checkIn).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-sm">Check-out</span>
            <span className="text-foreground">{new Date(checkOut).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-muted-foreground text-sm">Total Paid</span>
            <span className="text-xl font-serif text-gold-500">${totalPrice}</span>
          </div>
        </div>
        
        <Link 
          to="/"
          className="inline-block bg-gold-500 text-black px-8 py-3 rounded font-medium hover:bg-gold-400 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
