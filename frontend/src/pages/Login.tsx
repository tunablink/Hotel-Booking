import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Chrome, Hotel } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', form: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = { email: '', password: '', form: '' };
    let hasError = false;
    
    if (!email) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      hasError = true;
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }
    
    setErrors(newErrors);
    
    if (!hasError) {
      setIsSubmitting(true);
      try {
        const res = await api.post('/auth/login', { 
          username: email, 
          password 
        }, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        login(res.data.user, res.data.access_token);
        navigate('/');
      } catch (err: any) {
        setErrors({ ...newErrors, form: err.response?.data?.detail || 'Invalid email or password' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail || !/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      setForgotPasswordError('Please enter a valid email');
      return;
    }
    
    setIsSubmittingForgot(true);
    setForgotPasswordError('');
    setForgotPasswordMessage('');
    
    try {
      const res = await api.post('/auth/forgot-password', { email: forgotPasswordEmail });
      setForgotPasswordMessage(res.data.msg || 'If your email is registered, you will receive a reset link.');
    } catch (err: any) {
      setForgotPasswordError(err.response?.data?.detail || 'Failed to request password reset');
    } finally {
      setIsSubmittingForgot(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        <img
          src="https://images.unsplash.com/photo-1765122670586-b5f22d95c17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
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
      <div className="w-full lg:w-1/2 bg-[#0a0e27] flex items-center justify-center p-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Login Card */}
          <div className="bg-[#151a3d]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Logo */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif text-[#d4af37] mb-2 uppercase tracking-wider">Regency Grand</h2>
              <div className="w-12 h-1 bg-[#d4af37] mx-auto" />
            </div>

            {/* Title */}
            <h3 className="text-2xl text-white text-center mb-8">Sign In</h3>
            
            {errors.form && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
                {errors.form}
              </div>
            )}

            {/* Form Container */}
            {showForgotPassword ? (
              <div className="space-y-6">
                <p className="text-white/80 text-center mb-6 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                {forgotPasswordMessage ? (
                  <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-4 rounded-xl mb-6 text-center">
                    {forgotPasswordMessage}
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    {forgotPasswordError && (
                      <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                        {forgotPasswordError}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <label htmlFor="forgot-email" className="text-white/80 text-sm block">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4af37]/60" />
                        <input
                          id="forgot-email"
                          type="email"
                          placeholder="your@email.com"
                          value={forgotPasswordEmail}
                          onChange={(e) => {
                            setForgotPasswordEmail(e.target.value);
                            if (forgotPasswordError) setForgotPasswordError('');
                          }}
                          className="w-full pl-12 h-14 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#d4af37] focus:ring-[#d4af37]/20 rounded-xl transition-all outline-none"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingForgot}
                      className="w-full flex items-center justify-center h-14 bg-[#d4af37] text-[#0a0e27] hover:bg-[#c4a037] text-lg font-semibold rounded-xl shadow-lg shadow-[#d4af37]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#d4af37]/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmittingForgot ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>
                )}

                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordMessage('');
                    setForgotPasswordError('');
                  }}
                  className="w-full mt-4 text-white/60 hover:text-white transition-colors text-sm"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
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
                        placeholder="Enter your password"
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
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#d4af37] focus:ring-[#d4af37]/50 accent-[#d4af37] cursor-pointer"
                      />
                      <label
                        htmlFor="remember"
                        className="text-white/60 text-sm cursor-pointer select-none"
                      >
                        Remember Me
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[#d4af37] text-sm hover:text-[#c4a037] transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center h-14 bg-[#d4af37] text-[#0a0e27] hover:bg-[#c4a037] text-lg font-semibold rounded-xl shadow-lg shadow-[#d4af37]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#d4af37]/30 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/40 text-sm uppercase">OR</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center font-medium h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#d4af37]/50 rounded-xl transition-all"
                  >
                    <Chrome className="w-5 h-5 mr-3" />
                    Continue with Google
                  </button>
                  
                  <button
                    type="button"
                    className="w-full flex items-center justify-center font-medium h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#d4af37]/50 rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Continue with Facebook
                  </button>
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-white/60 text-sm mt-8">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-[#d4af37] hover:text-[#c4a037] font-semibold transition-colors"
                  >
                    Sign Up
                  </Link>
                </p>
              </>
            )}
          </div>

          {/* Bottom Text - Mobile Only */}
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
