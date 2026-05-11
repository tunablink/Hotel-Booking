import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const processPayment = async () => {
      const resultCode = searchParams.get('resultCode');
      const message = searchParams.get('message');
      
      if (resultCode !== '0') {
        setStatus('error');
        setErrorMsg(message || 'Payment failed or was cancelled.');
        return;
      }

      const pendingBookingStr = localStorage.getItem('pendingBooking');
      if (!pendingBookingStr) {
        setStatus('error');
        setErrorMsg('Booking information not found. Please contact support.');
        return;
      }

      try {
        const pendingBooking = JSON.parse(pendingBookingStr);
        
        // Create actual booking now that payment is confirmed
        const res = await api.post('/bookings', {
          room_id: pendingBooking.room_id,
          check_in_date: pendingBooking.check_in_date,
          check_out_date: pendingBooking.check_out_date,
          total_price: pendingBooking.total_price,
        });

        // Clean up
        localStorage.removeItem('pendingBooking');
        setStatus('success');

        // Redirect to success page
        setTimeout(() => {
          navigate('/booking-success', {
            state: {
              bookingId: res.data.id,
              hotelName: pendingBooking.hotelName,
              roomName: pendingBooking.roomName,
              checkIn: pendingBooking.check_in_date,
              checkOut: pendingBooking.check_out_date,
              totalPrice: pendingBooking.total_price,
            },
          });
        }, 1500);

      } catch (err: any) {
        console.error(err);
        setStatus('error');
        setErrorMsg(err.response?.data?.detail || 'Failed to create booking after payment.');
      }
    };

    processPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center p-4">
      <div className="bg-[#151a3d]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-[#d4af37] animate-spin mb-4" />
            <h2 className="text-2xl font-serif text-white mb-2">Processing Payment</h2>
            <p className="text-white/60">Please wait while we confirm your payment and secure your booking...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-serif text-white mb-2">Payment Successful!</h2>
            <p className="text-white/60">Your booking is being finalized. Redirecting...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-serif text-white mb-2">Payment Failed</h2>
            <p className="text-white/60 mb-6">{errorMsg}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-colors w-full"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
