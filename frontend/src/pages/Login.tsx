import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = { email: '', password: '' };
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    
    if (!newErrors.email && !newErrors.password) {
      try {
        const formData = new URLSearchParams();
        // Since the api needs username, email acts as username in our system
        formData.append('username', email); 
        formData.append('password', password);
        
        const res = await api.post('/auth/login', formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
        });
        localStorage.setItem('token', res.data.access_token);
        // Redirect home
        window.location.href = "/";
      } catch (err) {
        setErrors({ ...newErrors, password: 'Login failed. Check credentials.' });
      }
    }
  };

  return (
    <div className="min-h-screen flex w-full h-full m-[-2rem]">
      {/* Left Side - Image Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden h-screen lg:sticky lg:top-0"
      >
        <img
          src="https://images.unsplash.com/photo-1765122670586-b5f22d95c17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGVudHJhbmNlJTIwbmlnaHR8ZW58MXx8fHwxNzcyNTI5NDgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Luxury hotel entrance"
          className="w-full h-full object-cover"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#0a0e27]/60" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-start px-16">
          {/* Decorative Gold Line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-[#d4af37] mb-8"
          />
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-6xl font-serif text-white mb-6"
          >
            Welcome Back
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xl text-white/80 mb-8"
          >
            Sign in to continue your luxury journey
          </motion.p>
          
          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
            <div className="w-2 h-2 rounded-full bg-[#d4af37]/60" />
            <div className="w-2 h-2 rounded-full bg-[#d4af37]/30" />
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-[#0a0e27] flex flex-col p-8 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md m-auto py-8"
        >
          {/* Login Card */}
          <div className="bg-[#151a3d]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Logo */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif text-[#d4af37] mb-2">Hotelify</h2>
              <div className="w-12 h-1 bg-[#d4af37] mx-auto" />
            </div>

            {/* Title */}
            <h3 className="text-2xl text-white text-center mb-8">Sign In</h3>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-white/80 text-sm mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4af37]/60" />
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`pl-12 w-full h-14 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 rounded-xl transition-all ${
                      errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-white/80 text-sm mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4af37]/60" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    className={`pl-12 pr-12 w-full h-14 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 rounded-xl transition-all ${
                      errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]/60 hover:text-[#d4af37] transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 text-[#d4af37] focus:ring-[#d4af37] bg-white/5 cursor-pointer accent-[#d4af37]"
                  />
                  <label
                    htmlFor="remember"
                    className="text-white/60 text-sm cursor-pointer"
                  >
                    Remember Me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-[#d4af37] text-sm hover:text-[#c4a037] transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full h-14 bg-[#d4af37] text-[#0a0e27] hover:bg-[#c4a037] text-lg font-semibold rounded-xl shadow-lg shadow-[#d4af37]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#d4af37]/30"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/40 text-sm">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#d4af37]/50 rounded-xl transition-all"
              >
                <Chrome className="w-5 h-5 mr-2" />
                Continue with Google
              </button>
              
              <button
                type="button"
                className="w-full flex items-center justify-center h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#d4af37]/50 rounded-xl transition-all"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-white/60 text-sm mt-8">
              Don't have an account?{' '}
              <a
                href="#"
                className="text-[#d4af37] hover:text-[#c4a037] font-semibold transition-colors"
              >
                Sign Up
              </a>
            </p>
          </div>

          <div className="lg:hidden mt-8 text-center">
            <p className="text-white/40 text-sm">
              Experience luxury at your fingertips
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
