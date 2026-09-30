import React from 'react';

export default function Header({ user, onOpenAuth, activeView = 'landing', onNavigate }) {
  const handleNav = (mode) => {
    if (onNavigate) {
      onNavigate(mode);
    } else if (onOpenAuth) {
      onOpenAuth(mode);
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-6 sm:px-12 py-6 flex items-center justify-between">
      
      {/* Brand Logo Left (Clickable to return to home/landing) */}
      <div 
        onClick={() => handleNav('landing')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/30 border border-cyan-300/30 transform group-hover:scale-105 transition-all">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M8 11h8"/>
            <path d="M12 8v6"/>
          </svg>
        </div>
        <span className="font-black text-2xl sm:text-3xl tracking-tight text-white font-sans drop-shadow-md group-hover:text-cyan-200 transition-colors">
          SevaSetu
        </span>
      </div>

      {/* Right Header Navigation Buttons */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Municipal Civic Portal Badge */}
        <div className="hidden md:flex items-center gap-2 bg-[#161c28]/90 border border-teal-500/30 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-teal-300 shadow-md backdrop-blur-md">
          <div className="w-4 h-4 rounded bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <span>Municipal Civic Portal</span>
        </div>

        {/* Login Button */}
        <button
          onClick={() => handleNav('login')}
          className={`px-6 py-2.5 sm:px-7 sm:py-3 text-sm sm:text-base font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all cursor-pointer ${
            activeView === 'login'
              ? 'text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-cyan-500/40 border border-cyan-300/40'
              : 'text-slate-100 bg-[#1b2130]/90 border border-slate-700 hover:border-cyan-400 hover:bg-[#252c3f]'
          }`}
        >
          Login
        </button>

        {/* Register Button */}
        <button
          onClick={() => handleNav('register')}
          className={`px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-extrabold rounded-xl shadow-xl transform hover:scale-105 transition-all cursor-pointer ${
            activeView === 'register'
              ? 'text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-cyan-500/40 border border-cyan-300/40'
              : 'text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-cyan-500/25 border border-cyan-300/30'
          }`}
        >
          Register
        </button>
      </div>

    </header>
  );
}



