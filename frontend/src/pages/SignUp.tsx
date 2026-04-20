import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Chrome, User, Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function SignUp() {
  // Sign up form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
    form: ''
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: '',
      form: ''
    };

    // Full name validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name';
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } 

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await api.post('/auth/register', {
          email,
          password,
          full_name: fullName,
        });

        // After successful registration, log the user in immediately
        const res = await api.post('/auth/login/json', {
          email,
          password,
        });
        login(res.data.access_token, res.data.user);
        navigate('/');
      } catch (err: any) {
        setErrors({
          ...errors,
          form: err.response?.data?.detail || 'Failed to register account',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Image Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 relative overflow-hidden min-h-[40vh] lg:min-h-screen"
      >
        <img
          src="https://images.unsplash.com/photo-1758778689622-b756560264ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Luxury resort infinity pool"
          className="w-full h-full object-cover absolute inset-0"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#0a0e27]/60" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-16 py-12 pt-24">
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
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4"
          >
            Start Your Luxury Journey
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-white/80 mb-12 max-w-lg"
          >
            Create an account to book the world's finest hotels and experience unparalleled luxury
          </motion.p>

          {/* Optional Small Hotel Search Preview Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-md hidden md:block"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-[#d4af37]/30 rounded-2xl p-6 shadow-2xl shadow-[#d4af37]/10">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-white font-semibold">Explore Destinations</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-[#d4af37]/50 transition-all cursor-pointer">
                  <MapPin className="w-4 h-4 text-[#d4af37] mb-2" />
                  <p className="text-white text-sm font-medium">Paris</p>
                  <p className="text-white/60 text-xs">256 Hotels</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-[#d4af37]/50 transition-all cursor-pointer">
                  <MapPin className="w-4 h-4 text-[#d4af37] mb-2" />
                  <p className="text-white text-sm font-medium">Dubai</p>
                  <p className="text-white/60 text-xs">189 Hotels</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-[#d4af37]/50 transition-all cursor-pointer">
                  <MapPin className="w-4 h-4 text-[#d4af37] mb-2" />
                  <p className="text-white text-sm font-medium">Maldives</p>
                  <p className="text-white/60 text-xs">92 Resorts</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-[#d4af37]/50 transition-all cursor-pointer">
                  <MapPin className="w-4 h-4 text-[#d4af37] mb-2" />
                  <p className="text-white text-sm font-medium">Bali</p>
                  <p className="text-white/60 text-xs">143 Hotels</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex gap-3 mt-12"
          >
            <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
            <div className="w-2 h-2 rounded-full bg-[#d4af37]/60" />
            <div className="w-2 h-2 rounded-full bg-[#d4af37]/30" />
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 bg-[#0a0e27] flex items-center justify-center p-8 lg:p-12 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Sign Up Card */}
          <div className="bg-[#151a3d]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Logo */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif text-[#d4af37] mb-2 uppercase tracking-wider">Regency Grand</h2>
              <div className="w-12 h-1 bg-[#d4af37] mx-auto" />
            </div>

            {/* Title */}
            <h3 className="text-2xl text-white text-center mb-6">Create Account</h3>

            {errors.form && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
                {errors.form}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Input */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-white/80 text-sm block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4af37]/60" />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    className={`w-full pl-12 h-14 bg-white/5 border text-white placeholder:text-white/40 focus:border-[#d4af37] focus:ring-[#d4af37]/20 rounded-xl transition-all outline-none ${
                      errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-white/10'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.fullName}
                  </motion.p>
                )}
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-white/80 text-sm block">
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
                    className={`w-full pl-12 h-14 bg-white/5 border text-white placeholder:text-white/40 focus:border-[#d4af37] focus:ring-[#d4af37]/20 rounded-xl transition-all outline-none ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10'
                    }`}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-white/80 text-sm block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4af37]/60" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    className={`w-full pl-12 pr-12 h-14 bg-white/5 border text-white placeholder:text-white/40 focus:border-[#d4af37] focus:ring-[#d4af37]/20 rounded-xl transition-all outline-none ${
                      errors.password ? 'border-red-500 focus:border-red-500' : 'border-white/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]/60 hover:text-[#d4af37] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-white/80 text-sm block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4af37]/60" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    className={`w-full pl-12 pr-12 h-14 bg-white/5 border text-white placeholder:text-white/40 focus:border-[#d4af37] focus:ring-[#d4af37]/20 rounded-xl transition-all outline-none ${
                      errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-white/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]/60 hover:text-[#d4af37] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => {
                      setAgreeToTerms(e.target.checked);
                      if (errors.terms) setErrors({ ...errors, terms: '' });
                    }}
                    className={`mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#d4af37] focus:ring-[#d4af37]/50 accent-[#d4af37] cursor-pointer ${
                      errors.terms ? 'border-red-500' : ''
                    }`}
                  />
                  <label
                    htmlFor="terms"
                    className="text-white/60 text-sm cursor-pointer hover:text-white/80 transition-colors leading-relaxed"
                  >
                    I agree to the{' '}
                    <a href="#" className="text-[#d4af37] hover:text-[#c4a037] transition-colors">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-[#d4af37] hover:text-[#c4a037] transition-colors">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.terms && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm ml-7"
                  >
                    {errors.terms}
                  </motion.p>
                )}
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-[#d4af37] text-[#0a0e27] hover:bg-[#c4a037] text-lg font-semibold rounded-xl shadow-lg shadow-[#d4af37]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#d4af37]/30 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/40 text-sm uppercase">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social Sign Up Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center font-medium h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#d4af37]/50 rounded-xl transition-all hover:scale-[1.02]"
              >
                <Chrome className="w-5 h-5 mr-3" />
                Continue with Google
              </button>
              
              <button
                type="button"
                className="w-full flex items-center justify-center font-medium h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#d4af37]/50 rounded-xl transition-all hover:scale-[1.02]"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </button>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-white/60 text-sm mt-8">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#d4af37] hover:text-[#c4a037] font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Bottom Text - Mobile Only */}
          <div className="lg:hidden mt-8 text-center">
            <p className="text-white/40 text-sm">
              Join thousands of luxury travelers worldwide
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
