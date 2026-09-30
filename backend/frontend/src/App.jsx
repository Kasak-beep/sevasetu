import React, { useState } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import HowItWorksModal from './components/HowItWorksModal';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';
import ComplaintDetailModal from './components/ComplaintDetailModal';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing');
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const handleOpenAuth = (mode) => {
    if (mode === 'logout') {
      setUser(null);
      setCurrentView('landing');
      return;
    }
    setAuthModal({ open: true, mode });
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'ADMIN') {
      setCurrentView('admin');
    } else {
      setCurrentView('citizen');
    }
  };

  const handleFileComplaintCTA = () => {
    if (!user) {
      setAuthModal({ open: true, mode: 'register' });
    } else {
      setCurrentView('citizen');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e14] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Absolute / Floating Header */}
      <Header
        user={user}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full">
        {currentView === 'landing' && (
          <LandingPage
            onFileComplaint={handleFileComplaintCTA}
            onOpenAuth={handleOpenAuth}
            onLearnMore={() => setShowHowItWorks(true)}
          />
        )}

        {currentView === 'citizen' && (
          <div className="pt-20">
            <CitizenDashboard
              user={user}
              onSelectComplaint={setSelectedComplaint}
            />
          </div>
        )}

        {currentView === 'admin' && (
          <div className="pt-20">
            <AdminDashboard
              onSelectComplaint={setSelectedComplaint}
            />
          </div>
        )}
      </main>

      {/* Auth Modal (Login / Register / OTP) */}
      <AuthModal
        isOpen={authModal.open}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ open: false, mode: 'login' })}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
        onFileComplaint={handleFileComplaintCTA}
      />

      {/* Complaint Detail Inspection Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
      />

    </div>
  );
}
