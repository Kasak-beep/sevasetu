import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AuthService } from '../api';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'otp'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    wardNumber: 'WARD-12',
    role: 'CITIZEN',
    otp: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0] ? nameParts[0].toUpperCase() : 'CITIZEN';
      const lastName = nameParts.slice(1).join(' ').toUpperCase() || 'USER';

      const payload = {
        email: formData.email,
        password: formData.password,
        firstName,
        lastName,
        phoneNumber: formData.phoneNumber,
        ward: { wardNumber: formData.wardNumber }
      };

      const result = await AuthService.register(payload);
      setMessage({ type: 'success', text: typeof result === 'string' ? result : 'Account created! Please verify OTP.' });
      setMode('otp');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthService.verifyOtp({ email: formData.email, otp: formData.otp });
      const nameParts = formData.fullName.trim().split(' ');
      onAuthSuccess({
        email: formData.email,
        firstName: nameParts[0] ? nameParts[0].toUpperCase() : 'CITIZEN',
        lastName: nameParts.slice(1).join(' ').toUpperCase() || 'USER',
        role: formData.role,
        wardNumber: formData.wardNumber,
        id: Date.now()
      });
      onClose();
    } catch (err) {
      setMessage({ type: 'error', text: 'Invalid OTP.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const resMessage = await AuthService.login({
        email: formData.email,
        password: formData.password
      });

      onAuthSuccess({
        email: formData.email,
        firstName: formData.email.split('@')[0].toUpperCase(),
        lastName: 'USER',
        role: formData.role,
        wardNumber: formData.wardNumber || 'WARD-12',
        id: Date.now()
      });
      onClose();
    } catch (err) {
      setMessage({ type: 'error', text: 'Invalid email or password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#1c202b] p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          {mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Verify OTP'}
        </h2>

        {/* Status Alert */}
        {message.text && (
          <div className={`p-3 mb-4 text-xs font-semibold rounded-lg border ${
            message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-[#141720] border border-slate-700 rounded-lg py-2.5 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-[#141720] border border-slate-700 rounded-lg py-2.5 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.role === 'ADMIN'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.checked ? 'ADMIN' : 'CITIZEN' })} 
                  className="rounded border-slate-700 text-orange-600 focus:ring-orange-500"
                />
                Login as Municipal Admin
              </label>
              <button 
                type="button" 
                onClick={() => setMode('register')} 
                className="text-orange-400 hover:underline"
              >
                Need an account?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-lg text-sm font-bold btn-orange shadow-md"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-[#141720] border border-slate-700 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-[#141720] border border-slate-700 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full bg-[#141720] border border-slate-700 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ward #</label>
                <input
                  type="text"
                  name="wardNumber"
                  required
                  value={formData.wardNumber}
                  onChange={handleChange}
                  placeholder="Ward"
                  className="w-full bg-[#141720] border border-slate-700 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Create Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create Password"
                className="w-full bg-[#141720] border border-slate-700 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex justify-end text-xs text-slate-400 pt-1">
              <button 
                type="button" 
                onClick={() => setMode('login')} 
                className="text-orange-400 hover:underline"
              >
                Already registered? Sign In
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 rounded-lg text-sm font-bold btn-orange shadow-md"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        )}

        {/* OTP STEP */}
        {mode === 'otp' && (
          <form onSubmit={handleOtpVerify} className="space-y-4 text-center">
            <p className="text-xs text-slate-300">Enter 6-digit OTP code sent to your email.</p>
            <input
              type="text"
              name="otp"
              required
              maxLength={6}
              value={formData.otp}
              onChange={handleChange}
              placeholder="123456"
              className="w-40 mx-auto text-center text-xl font-mono bg-[#141720] border border-orange-500 rounded-lg py-2 text-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-bold btn-orange shadow-md"
            >
              Verify & Complete Sign Up
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
