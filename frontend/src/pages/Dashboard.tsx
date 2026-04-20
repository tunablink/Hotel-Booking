import { useState } from 'react';
import { Calendar, MapPin, Users, Search, Star, ChevronRight, Phone, Mail, Instagram, Facebook, Twitter, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e27]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-serif text-white"
          >
            <span className="text-[#d4af37]">REGENCY</span> GRAND
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:flex items-center gap-8"
          >
            <a href="#rooms" className="text-white/80 hover:text-[#d4af37] transition-colors">Rooms</a>
            <a href="#deals" className="text-white/80 hover:text-[#d4af37] transition-colors">Deals</a>
            <a href="#amenities" className="text-white/80 hover:text-[#d4af37] transition-colors">Amenities</a>
            <a href="#contact" className="text-white/80 hover:text-[#d4af37] transition-colors">Contact</a>
            <button className="bg-[#d4af37] text-[#0a0e27] hover:bg-[#c4a037] px-4 py-2 font-medium rounded-md transition-colors">Book Now</button>
            <div className="flex items-center gap-3 ml-2">
              <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center">
                <User className="w-5 h-5 text-[#d4af37]" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-white/80 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1744782996368-dc5b7e697f4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcyNTE4NTQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Luxury hotel lobby"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/70 via-[#0a0e27]/50 to-[#0a0e27]" />
          </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6"
          >
            Experience True
            <span className="block text-[#d4af37]">Luxury & Elegance</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-white/80 mb-12"
          >
            Indulge in world-class hospitality at our exclusive 5-star properties
          </motion.p>

          {/* Booking Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="relative text-left">
                  <label className="text-xs text-white/60 mb-2 block">Location</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#d4af37]" />
                    <input
                      type="text"
                      placeholder="Where to?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 text-white focus:border-[#d4af37] focus:outline-none rounded-md px-3 py-2 transition-colors placeholder:text-white/40"
                    />
                  </div>
                </div>

                <div className="relative text-left">
                  <label className="text-xs text-white/60 mb-2 block">Check-in</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#d4af37]" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 text-white focus:border-[#d4af37] focus:outline-none rounded-md px-3 py-2 transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="relative text-left">
                  <label className="text-xs text-white/60 mb-2 block">Check-out</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#d4af37]" />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 text-white focus:border-[#d4af37] focus:outline-none rounded-md px-3 py-2 transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="relative text-left">
                  <label className="text-xs text-white/60 mb-2 block">Guests</label>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#d4af37]" />
                    <input
                      type="number"
                      min="1"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 text-white focus:border-[#d4af37] focus:outline-none rounded-md px-3 py-2 transition-colors"
                    />
                  </div>
                </div>

                <button className="w-full h-[42px] bg-[#d4af37] text-[#0a0e27] hover:bg-[#c4a037] font-semibold rounded-md flex items-center justify-center transition-colors">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-3 bg-[#d4af37] rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Luxury Hotel Cards */}
      <section id="rooms" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Our Premium <span className="text-[#d4af37]">Accommodations</span>
            </h2>
            <p className="text-white/60 text-lg">Discover the perfect sanctuary for your stay</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Deluxe Suite',
                image: 'https://images.unsplash.com/photo-1759223198981-661cadbbff36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHN1aXRlJTIwYmVkcm9vbXxlbnwxfHx8fDE3NzI0NDEzMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                price: '899',
                size: '65 m²',
                guests: '2-3 Guests',
                features: ['King Bed', 'City View', 'Private Balcony']
              },
              {
                title: 'Presidential Suite',
                image: 'https://images.unsplash.com/photo-1729673766571-2409a89a3f64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHBvb2wlMjByZXNvcnR8ZW58MXx8fHwxNzcyNDgyOTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                price: '1,899',
                size: '120 m²',
                guests: '4-6 Guests',
                features: ['Private Pool', 'Ocean View', 'Butler Service']
              },
              {
                title: 'Royal Penthouse',
                image: 'https://images.unsplash.com/photo-1758448756167-88dc934c58e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb2Z0b3AlMjBza3lsaW5lfGVufDF8fHx8MTc3MjUyNzMyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                price: '3,499',
                size: '250 m²',
                guests: '6-8 Guests',
                features: ['Rooftop Terrace', 'Panoramic Views', 'Private Chef']
              }
            ].map((room, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-[#151a3d] border border-white/10 rounded-xl overflow-hidden group hover:border-[#d4af37]/50 transition-all duration-500 shadow-lg">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-[#d4af37] text-[#0a0e27] px-3 py-1 rounded-full text-sm font-semibold">
                      From ${room.price}/night
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-serif text-white mb-3">{room.title}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {room.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {room.guests}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {room.features.map((feature, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 bg-white/5 text-white/80 rounded-full border border-white/10"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <button className="w-full bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0e27] py-2 rounded-md font-medium flex items-center justify-center transition-colors">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Deals Section */}
      <section id="deals" className="py-24 px-6 bg-gradient-to-b from-[#0a0e27] to-[#151a3d]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Exclusive <span className="text-[#d4af37]">Offers</span>
            </h2>
            <p className="text-white/60 text-lg">Limited time luxury experiences</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-[#d4af37]/20 to-[#151a3d] border border-[#d4af37]/30 rounded-xl p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="inline-block px-4 py-1 bg-[#d4af37] text-[#0a0e27] rounded-full text-sm font-semibold mb-4">
                    SAVE 30%
                  </div>
                  <h3 className="text-3xl font-serif text-white mb-4">Early Bird Special</h3>
                  <p className="text-white/70 mb-6">
                    Book 60 days in advance and enjoy 30% off your stay plus complimentary breakfast and spa access.
                  </p>
                  <ul className="space-y-2 mb-8">
                    {['Complimentary Breakfast', 'Spa Access', 'Late Checkout', 'Airport Transfer'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-white/80">
                        <Star className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className="bg-[#d4af37] text-[#0a0e27] hover:bg-[#c4a037] font-medium px-6 py-2 rounded-md transition-colors">
                    Claim Offer
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-[#d4af37]/20 to-[#151a3d] border border-[#d4af37]/30 rounded-xl p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="inline-block px-4 py-1 bg-[#d4af37] text-[#0a0e27] rounded-full text-sm font-semibold mb-4">
                    EXCLUSIVE
                  </div>
                  <h3 className="text-3xl font-serif text-white mb-4">Romance Package</h3>
                  <p className="text-white/70 mb-6">
                    Celebrate love with our curated romance package including champagne, roses, and couples spa treatment.
                  </p>
                  <ul className="space-y-2 mb-8">
                    {['Champagne & Roses', 'Couples Spa', 'Candlelit Dinner', 'Suite Upgrade'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-white/80">
                        <Star className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className="bg-[#d4af37] text-[#0a0e27] hover:bg-[#c4a037] font-medium px-6 py-2 rounded-md transition-colors">
                    Book Romance
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Amenities Showcase */}
      <section id="amenities" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
              World-Class <span className="text-[#d4af37]">Amenities</span>
            </h2>
            <p className="text-white/60 text-lg">Indulge in unparalleled luxury</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Luxury Spa & Wellness',
                image: 'https://images.unsplash.com/photo-1667235195726-a7c440bca9bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHNwYSUyMHdlbGxuZXNzfGVufDF8fHx8MTc3MjUyNzMyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                description: 'Rejuvenate your body and mind at our award-winning spa'
              },
              {
                title: 'Fine Dining Experience',
                image: 'https://images.unsplash.com/photo-1741852197045-cc35920a3aa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlc3RhdXJhbnQlMjBkaW5pbmd8ZW58MXx8fHwxNzcyNDc3ODQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                description: 'Michelin-starred restaurants with world-renowned chefs'
              }
            ].map((amenity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative h-96 rounded-xl overflow-hidden group shadow-lg"
              >
                <img
                  src={amenity.image}
                  alt={amenity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-3xl font-serif text-white mb-2">{amenity.title}</h3>
                  <p className="text-white/80">{amenity.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#0a0e27] to-[#151a3d]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Guest <span className="text-[#d4af37]">Testimonials</span>
            </h2>
            <p className="text-white/60 text-lg">Hear from our distinguished guests</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Victoria Sterling',
                location: 'London, UK',
                rating: 5,
                review: 'An absolutely divine experience. The attention to detail and impeccable service exceeded all expectations. The suite was magnificent.'
              },
              {
                name: 'James Morrison',
                location: 'New York, USA',
                rating: 5,
                review: 'Pure luxury from start to finish. The spa facilities are world-class and the dining experience was unforgettable. Highly recommended!'
              },
              {
                name: 'Sophie Laurent',
                location: 'Paris, France',
                rating: 5,
                review: 'The most elegant hotel I\'ve ever stayed at. Every moment felt special. The staff went above and beyond to make our anniversary perfect.'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-[#151a3d] border border-white/10 rounded-xl p-8 h-full shadow-lg">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#d4af37] fill-[#d4af37]" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-6 italic">"{testimonial.review}"</p>
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-white/60 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#0a0e27] border-t border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-serif text-white mb-4">
                <span className="text-[#d4af37]">REGENCY</span> GRAND
              </h3>
              <p className="text-white/60 mb-6">
                Experience the pinnacle of luxury hospitality at our exclusive properties worldwide.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0e27] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0e27] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0e27] transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-serif text-xl mb-4">About Us</h4>
              <p className="text-white/60 leading-relaxed mb-4">
                We are a modern hotel booking platform that helps travelers easily find and book the perfect stay. With smart search, verified reviews, and secure payments, we make the booking process fast, simple, and reliable.
              </p>
              <p className="text-white/60 leading-relaxed">
                Our goal is to provide a seamless experience so you can focus on enjoying your journey, not worrying about where to stay.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white/60">
                  <Phone className="w-5 h-5 text-[#d4af37]" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-3 text-white/60">
                  <Mail className="w-5 h-5 text-[#d4af37]" />
                  reservations@regencygrand.com
                </li>
                <li className="flex items-start gap-3 text-white/60">
                  <MapPin className="w-5 h-5 text-[#d4af37] mt-1 shrink-0" />
                  <span>123 Luxury Avenue<br />Metropolitan City, 10001</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © 2026 Regency Grand. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-[#d4af37] transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-[#d4af37] transition-colors">Terms of Service</a>
              <a href="#" className="text-white/60 hover:text-[#d4af37] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
