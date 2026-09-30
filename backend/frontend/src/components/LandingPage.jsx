import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import { AuthService } from '../api';

export default function LandingPage({ onFileComplaint, onOpenAuth, onLearnMore, onAuthSuccess }) {
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'login' | 'register'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'otp'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const videoRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    wardNumber: 'WARD-12',
    role: 'CITIZEN',
    otp: ''
  });

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay prevented:', err);
      });
    }
  }, []);

  const handleNavigate = (view) => {
    setMessage({ type: '', text: '' });
    if (view === 'login') {
      setAuthMode('login');
      setActiveView('login');
    } else if (view === 'register') {
      setAuthMode('register');
      setActiveView('register');
    } else {
      setActiveView('landing');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Backend Registration Handler
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
      setMessage({ 
        type: 'success', 
        text: typeof result === 'string' ? result : 'Account created! Enter OTP code to verify.' 
      });
      setAuthMode('otp');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Registration failed. Please check inputs.' });
    } finally {
      setLoading(false);
    }
  };

  // Backend OTP Verification Handler
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthService.verifyOtp({ email: formData.email, otp: formData.otp });
      const nameParts = formData.fullName.trim().split(' ');
      const userData = {
        email: formData.email,
        firstName: nameParts[0] ? nameParts[0].toUpperCase() : 'CITIZEN',
        lastName: nameParts.slice(1).join(' ').toUpperCase() || 'USER',
        role: formData.role,
        wardNumber: formData.wardNumber,
        id: Date.now()
      };
      if (onAuthSuccess) {
        onAuthSuccess(userData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Invalid OTP code. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Backend Login Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await AuthService.login({
        email: formData.email,
        password: formData.password
      });

      const userData = {
        email: formData.email,
        firstName: formData.email.split('@')[0].toUpperCase(),
        lastName: 'USER',
        role: formData.role,
        wardNumber: formData.wardNumber || 'WARD-12',
        id: Date.now()
      };

      if (onAuthSuccess) {
        onAuthSuccess(userData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Invalid email or password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full text-white flex flex-col justify-between items-center overflow-hidden font-sans select-none bg-slate-950">
      
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 -z-10 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] pointer-events-none"></div>
      </div>

      {/* Header Container */}
      <Header
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenAuth={(mode) => handleNavigate(mode)}
      />

      {/* Main View Transition Stage */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between items-center">
        
        {/* Spacer for Absolute Header */}
        <div className="h-24 sm:h-28"></div>

        {/* ======================================================== */}
        {/* VIEW 1: CENTERED HERO CONTENT (Fades & slides left/down) */}
        {/* ======================================================== */}
        <div
          className={`w-full max-w-5xl mx-auto px-4 my-auto transition-all duration-500 ease-in-out transform ${
            activeView === 'landing'
              ? 'opacity-100 translate-y-0 translate-x-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-12 -translate-x-16 scale-95 pointer-events-none absolute inset-0'
          }`}
        >
          <main className="text-center flex flex-col items-center justify-center my-auto py-10">
            
            {/* Center Logo Icon & Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-cyan-500/40 border border-cyan-300/40 transform hover:rotate-3 transition-transform">
                <svg className="w-8 h-8 sm:w-9 sm:h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M8 11h8"/>
                  <path d="M12 8v6"/>
                </svg>
              </div>
              <span className="font-black text-5xl sm:text-6xl md:text-7xl tracking-tight text-white font-sans drop-shadow-2xl">
                SevaSetu
              </span>
            </div>

            {/* Main Headline Centered */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.1] mb-6 max-w-5xl drop-shadow-2xl font-sans text-center">
              Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Communities</span>, <br className="hidden sm:inline" />
              Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">Better Cities</span>.
            </h1>

            {/* Subtitle Centered */}
            <p className="text-lg sm:text-2xl md:text-3xl text-slate-100 max-w-3xl mx-auto mb-10 font-medium leading-relaxed drop-shadow-lg opacity-95 text-center">
              Bridging Citizens and Municipal Administration for Faster Resolutions.
            </p>

            {/* Action Buttons Centered Horizontally */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-xs sm:max-w-none">
              {/* Primary CTA Button */}
              <button
                onClick={() => handleNavigate('register')}
                className="w-full sm:w-auto px-12 py-5 rounded-2xl text-lg sm:text-xl font-extrabold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-2xl shadow-cyan-500/40 transform hover:-translate-y-1 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 border border-cyan-300/30"
              >
                <span>File a Complaint Now</span>
                <ArrowRight className="w-6 h-6 text-white" />
              </button>

              {/* Secondary CTA Button */}
              <button
                onClick={onLearnMore}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl text-base sm:text-lg font-bold text-teal-200 bg-[#0f172a]/80 backdrop-blur-md border border-teal-500/40 hover:border-teal-300 hover:bg-teal-500/10 shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                Learn How It Works
              </button>
            </div>

          </main>
        </div>


        {/* ======================================================== */}
        {/* VIEW 2: 50/50 SPLIT AUTHENTICATION STAGE (Slides in from right) */}
        {/* ======================================================== */}
        <div
          className={`w-full max-w-7xl mx-auto my-auto px-4 sm:px-8 transition-all duration-500 ease-in-out transform ${
            activeView === 'login' || activeView === 'register'
              ? 'opacity-100 translate-x-0 pointer-events-auto'
              : 'opacity-0 translate-x-full pointer-events-none absolute inset-0'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[75vh] py-6">
            
            {/* LEFT SIDE: Fixed Video Background Highlight & Civic Banner (50%) */}
            <div className="hidden lg:flex lg:col-span-6 flex-col justify-center text-left space-y-6 pr-6">
              
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md w-max">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Verified Municipal Gateway</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                {activeView === 'login' ? (
                  <>
                    Welcome Back to <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-300">
                      SevaSetu Portal
                    </span>
                  </>
                ) : (
                  <>
                    Join the Civic <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                      Resolution Network
                    </span>
                  </>
                )}
              </h2>

              <p className="text-base text-slate-300 leading-relaxed max-w-md">
                {activeView === 'login'
                  ? 'Access real-time complaint tracking, receive instant updates from ward officers, and manage community resolutions.'
                  : 'Register your account to report civic issues, track ward maintenance progress, and build better infrastructure.'}
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>Instant Municipal Officer Notification</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>Photo & Geolocation Verified Issues</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>Transparent Public Resolution Pipeline</span>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE: Large Clean Authentication Form Card (50%) */}
            <div className="w-full lg:col-span-6 flex justify-center">
              <div className="w-full max-w-lg bg-[#0f172a]/90 border border-slate-700/80 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl shadow-cyan-950/60 transition-all">
                
                {/* Form Card Tab Controls */}
                <div className="flex items-center bg-[#1e293b]/90 rounded-2xl p-1.5 mb-8 border border-slate-700/80">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setActiveView('login');
                      setMessage({ type: '', text: '' });
                    }}
                    className={`flex-1 py-3 text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
                      activeView === 'login' && authMode !== 'otp'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setActiveView('register');
                      setMessage({ type: '', text: '' });
                    }}
                    className={`flex-1 py-3 text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
                      activeView === 'register' || authMode === 'otp'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Status Alert Banner */}
                {message.text && (
                  <div className={`p-4 mb-6 text-sm font-semibold rounded-xl border ${
                    message.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-red-500/15 border-red-500/40 text-red-300'
                  }`}>
                    {message.text}
                  </div>
                )}

                {/* LOGIN FORM */}
                {activeView === 'login' && authMode === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="citizen@sevasetu.gov.in"
                          className="w-full bg-[#1e293b]/90 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                          type="password"
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full bg-[#1e293b]/90 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer font-medium select-none">
                        <input 
                          type="checkbox" 
                          checked={formData.role === 'ADMIN'}
                          onChange={(e) => setFormData({ ...formData, role: e.target.checked ? 'ADMIN' : 'CITIZEN' })} 
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400"
                        />
                        <span>Login as Municipal Admin</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl text-base font-extrabold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-xl shadow-cyan-500/30 transform hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 border border-cyan-300/30"
                    >
                      {loading ? 'Authenticating...' : 'Sign In to Portal'}
                      <ArrowRight className="w-5 h-5 text-white" />
                    </button>
                  </form>
                )}

                {/* REGISTER FORM */}
                {activeView === 'register' && authMode === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Kasak Singh"
                          className="w-full bg-[#1e293b]/90 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="citizen@sevasetu.gov.in"
                          className="w-full bg-[#1e293b]/90 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Phone Number</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                          <input
                            type="text"
                            name="phoneNumber"
                            required
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="9876543210"
                            className="w-full bg-[#1e293b]/90 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Ward #</label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                          <input
                            type="text"
                            name="wardNumber"
                            required
                            value={formData.wardNumber}
                            onChange={handleChange}
                            placeholder="WARD-12"
                            className="w-full bg-[#1e293b]/90 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="password"
                          name="password"
                          required
                          minLength={8}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full bg-[#1e293b]/90 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 mt-2 rounded-xl text-base font-extrabold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-xl shadow-cyan-500/30 transform hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 border border-cyan-300/30"
                    >
                      {loading ? 'Registering Account...' : 'Complete Sign Up'}
                      <ArrowRight className="w-5 h-5 text-white" />
                    </button>
                  </form>
                )}

                {/* OTP VERIFICATION STEP */}
                {authMode === 'otp' && (
                  <form onSubmit={handleOtpVerify} className="space-y-6 text-center py-4">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                      <KeyRound className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Verify Your Account</h3>
                      <p className="text-sm text-slate-300">Enter the 6-digit OTP code sent to your registered email address.</p>
                    </div>
                    <input
                      type="text"
                      name="otp"
                      required
                      maxLength={6}
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="123456"
                      className="w-48 mx-auto text-center text-2xl tracking-widest font-mono bg-[#1e293b] border-2 border-cyan-400 rounded-xl py-3 text-white focus:outline-none shadow-lg"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl text-base font-extrabold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-xl cursor-pointer"
                    >
                      {loading ? 'Verifying...' : 'Verify OTP & Log In'}
                    </button>
                  </form>
                )}

                {/* Back to Home Link */}
                <div className="pt-6 border-t border-slate-800 text-center">
                  <button
                    onClick={() => handleNavigate('landing')}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to SevaSetu Home</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="pb-8 pt-4 px-4 text-center">
          <p className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wide drop-shadow-md">
            © 2026 SevaSetu Platform. Empowering Local Communities.
          </p>
        </footer>

      </div>

    </div>
  );
}






