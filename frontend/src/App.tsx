import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { motion } from 'framer-motion';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Register from './pages/Register';
import HotelDetail from './pages/HotelDetail';
import BookingSuccess from './pages/BookingSuccess';
import Checkout from './pages/Checkout';
import SearchResults from './pages/SearchResults';
import ResetPassword from './pages/ResetPassword';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-gold-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e27]">
      {isHome && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e27]/90 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/" className="text-2xl font-serif text-white uppercase tracking-wider">
                <span className="text-[#d4af37]">Regency</span> Grand
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden md:flex items-center gap-8"
            >
              <Link to="/" className="text-white/80 hover:text-[#d4af37] transition-colors">Home</Link>
              <a href="/#rooms" className="text-white/80 hover:text-[#d4af37] transition-colors">Rooms</a>
              <a href="/#deals" className="text-white/80 hover:text-[#d4af37] transition-colors">Deals</a>
              <a href="/#amenities" className="text-white/80 hover:text-[#d4af37] transition-colors">Amenities</a>
              
              <div className="flex items-center gap-4 ml-4 border-l border-white/10 pl-6">
                {user ? (
                  <>
                    <span className="text-sm text-[#d4af37] font-medium">{user.full_name}</span>
                    <button 
                      onClick={logout} 
                      className="text-white/80 hover:text-white transition-colors text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="text-white/80 hover:text-white transition-colors font-medium">Sign Up</Link>
                    <Link to="/login" className="bg-[#d4af37] text-[#0a0e27] px-5 py-2 rounded-md font-semibold hover:bg-[#c4a037] transition-all">Log In</Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </nav>
      )}

      <main className={`flex-grow ${isHome ? 'pt-20' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking-success" 
            element={
              <ProtectedRoute>
                <BookingSuccess />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
