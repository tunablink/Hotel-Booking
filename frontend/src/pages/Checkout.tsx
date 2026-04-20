import { Fragment, useState, type ChangeEvent } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, CreditCard, Shield, Lock, MapPin, Calendar,
  Users, Star, Clock, AlertCircle, CheckCircle2, Building2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

// --- Helper ---
function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

// --- Main Page ---
export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = location.state as any;

  // Form state
  const [guestName, setGuestName] = useState(user?.full_name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Redirect if no booking state
  if (!state || !state.selectedRoom) {
    return <Navigate to="/" replace />;
  }

  const { hotel, selectedRoom, checkIn, checkOut, guests, totalDays, totalPrice } = state;

  // Format card number with spaces
  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format expiry as MM/YY
  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiry(value);
  };

  const handleSubmit = async () => {
    setError('');

    if (!guestName.trim() || !guestEmail.trim()) {
      setError('Please fill in your name and email.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        setError('Please fill in all payment details.');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setError('Please enter a valid card number.');
        return;
      }
    }

    if (!agreeTerms) {
      setError('You must agree to the terms and conditions.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await api.post('/bookings', {
        room_id: selectedRoom.id,
        check_in_date: checkIn,
        check_out_date: checkOut,
        total_price: totalPrice,
      });
      navigate('/booking-success', {
        state: {
          bookingId: res.data.id,
          hotelName: hotel.name,
          roomName: selectedRoom.name,
          checkIn,
          checkOut,
          totalPrice,
        },
      });
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.detail || 'Booking failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const roomImage = selectedRoom.photos?.[0]?.url ||
    'https://images.unsplash.com/photo-1509647924673-bbb53e22eeb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

  const serviceFee = Math.round(totalPrice * 0.05);
  const taxes = Math.round(totalPrice * 0.1);
  const grandTotal = totalPrice + serviceFee + taxes;

  return (
    <div className="bg-[#0a0e27] min-h-screen">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0e27]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/60 hover:text-[#d4af37] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Back to hotel</span>
            </button>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Lock className="w-4 h-4 text-green-400" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center gap-4 mb-10">
          {[
            { step: 1, label: 'Select Room', done: true },
            { step: 2, label: 'Payment', done: false, active: true },
            { step: 3, label: 'Confirmation', done: false },
          ].map((s, i) => (
            <Fragment key={s.step}>
              {i > 0 && (
                <div className={`hidden sm:block w-16 h-px ${s.done ? 'bg-[#d4af37]' : 'bg-white/10'}`} />
              )}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                  ${s.done ? 'bg-[#d4af37] text-[#0a0e27]' : s.active ? 'bg-[#d4af37]/20 text-[#d4af37] border-2 border-[#d4af37]' : 'bg-white/5 text-white/30 border border-white/10'}`}
                >
                  {s.done ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                </div>
                <span className={`text-sm hidden sm:inline ${s.active ? 'text-[#d4af37] font-medium' : s.done ? 'text-white/80' : 'text-white/30'}`}>
                  {s.label}
                </span>
              </div>
            </Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* LEFT — Forms (3 cols) */}
          <div className="lg:col-span-3 space-y-6">

            {/* Guest Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#151a3d]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#d4af37]/10 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#d4af37]" />
                </div>
                Guest Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 block mb-1.5 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 h-12 text-white outline-none focus:border-[#d4af37] transition-colors placeholder:text-white/25"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 block mb-1.5 uppercase tracking-wider">Email *</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 h-12 text-white outline-none focus:border-[#d4af37] transition-colors placeholder:text-white/25"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 block mb-1.5 uppercase tracking-wider">Phone</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 h-12 text-white outline-none focus:border-[#d4af37] transition-colors placeholder:text-white/25"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 block mb-1.5 uppercase tracking-wider">Special Requests</label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Late check-in, extra pillows..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 h-12 text-white outline-none focus:border-[#d4af37] transition-colors placeholder:text-white/25"
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#151a3d]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#d4af37]/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#d4af37]" />
                </div>
                Payment Details
              </h2>

              {/* Payment method tabs */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-200 text-sm font-medium
                    ${paymentMethod === 'card'
                      ? 'bg-[#d4af37]/15 border-[#d4af37]/50 text-[#d4af37]'
                      : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'}`}
                >
                  <CreditCard className="w-4 h-4" />
                  Credit / Debit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-200 text-sm font-medium
                    ${paymentMethod === 'paypal'
                      ? 'bg-[#d4af37]/15 border-[#d4af37]/50 text-[#d4af37]'
                      : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'}`}
                >
                  <Building2 className="w-4 h-4" />
                  PayPal
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/60 block mb-1.5 uppercase tracking-wider">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 pr-14 h-12 text-white outline-none focus:border-[#d4af37] transition-colors placeholder:text-white/25 tracking-wider"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                        <div className="w-8 h-5 bg-gradient-to-br from-blue-500 to-blue-700 rounded text-[8px] text-white flex items-center justify-center font-bold">VISA</div>
                        <div className="w-8 h-5 bg-gradient-to-br from-red-500 to-orange-500 rounded text-[6px] text-white flex items-center justify-center font-bold">MC</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 block mb-1.5 uppercase tracking-wider">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="JOHN DOE"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 h-12 text-white outline-none focus:border-[#d4af37] transition-colors placeholder:text-white/25 uppercase tracking-wider"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-white/60 block mb-1.5 uppercase tracking-wider">Expiry Date</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 h-12 text-white outline-none focus:border-[#d4af37] transition-colors placeholder:text-white/25 tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60 block mb-1.5 uppercase tracking-wider">CVV</label>
                      <div className="relative">
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 h-12 text-white outline-none focus:border-[#d4af37] transition-colors placeholder:text-white/25 tracking-wider"
                        />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                  <Building2 className="w-12 h-12 text-[#d4af37] mx-auto mb-3" />
                  <p className="text-white/80 mb-1 font-medium">PayPal Checkout</p>
                  <p className="text-white/40 text-sm">You will be redirected to PayPal to complete the payment securely.</p>
                </div>
              )}

              {/* Security notice */}
              <div className="flex items-center gap-3 mt-6 p-3 bg-green-500/5 border border-green-500/15 rounded-xl">
                <Shield className="w-5 h-5 text-green-400 shrink-0" />
                <p className="text-green-400/80 text-xs">Your payment is secured with 256-bit SSL encryption. We never store your card details.</p>
              </div>
            </motion.div>

            {/* Terms & Confirm */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              {/* Terms checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
                    ${agreeTerms ? 'bg-[#d4af37] border-[#d4af37]' : 'border-white/30 group-hover:border-white/50'}`}
                  onClick={() => setAgreeTerms(!agreeTerms)}
                >
                  {agreeTerms && <CheckCircle2 className="w-3 h-3 text-[#0a0e27]" />}
                </div>
                <span className="text-white/60 text-sm leading-relaxed" onClick={() => setAgreeTerms(!agreeTerms)}>
                  I agree to the <span className="text-[#d4af37] underline underline-offset-2">Terms & Conditions</span> and{' '}
                  <span className="text-[#d4af37] underline underline-offset-2">Cancellation Policy</span>. I understand that my booking is subject to availability.
                </span>
              </label>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-4 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Confirm Button */}
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#c4a037] text-[#0a0e27] h-14 rounded-xl font-semibold text-lg 
                  transition-all shadow-lg shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40 hover:brightness-110
                  disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#0a0e27]/30 border-t-[#0a0e27] rounded-full animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Confirm & Pay ${grandTotal.toLocaleString()}
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* RIGHT — Booking Summary (2 cols) */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="sticky top-24 bg-[#151a3d]/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Room Image */}
              <div className="relative h-48 overflow-hidden">
                <img src={roomImage} alt={selectedRoom.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151a3d] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-serif text-lg">{hotel.name}</h3>
                  <div className="flex items-center gap-1.5 text-white/70 text-sm mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{hotel.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Room Info */}
                <div className="bg-[#0a0e27]/50 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                    <span className="text-white font-medium">{selectedRoom.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-white/60">
                      <Calendar className="w-4 h-4 text-[#d4af37]" />
                      <div>
                        <p className="text-white/40 text-xs">Check-in</p>
                        <p className="text-white/80">{formatDate(checkIn)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Calendar className="w-4 h-4 text-[#d4af37]" />
                      <div>
                        <p className="text-white/40 text-xs">Check-out</p>
                        <p className="text-white/80">{formatDate(checkOut)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm mt-3 pt-3 border-t border-white/5">
                    <Clock className="w-4 h-4 text-[#d4af37]" />
                    <span>{totalDays} night{totalDays !== 1 ? 's' : ''}</span>
                    <span className="text-white/20 mx-1">·</span>
                    <Users className="w-4 h-4 text-[#d4af37]" />
                    <span>{guests} guest{Number(guests) !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-white/60 text-xs uppercase tracking-wider font-medium">Price breakdown</h4>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-white/70">
                      <span>${selectedRoom.price_per_night} × {totalDays} night{totalDays !== 1 ? 's' : ''}</span>
                      <span className="text-white">${totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Service fee</span>
                      <span className="text-white">${serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Taxes & fees</span>
                      <span className="text-white">${taxes.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                    <span className="text-white font-semibold font-serif">Total</span>
                    <span className="text-2xl text-[#d4af37] font-semibold font-serif">${grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2.5 pt-2">
                  {[
                    { icon: CheckCircle2, text: 'Free cancellation up to 24h before' },
                    { icon: Shield, text: 'Best price guarantee' },
                    { icon: Lock, text: 'Secure & encrypted payment' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-white/50 text-xs">
                      <item.icon className="w-4 h-4 text-[#d4af37]" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
