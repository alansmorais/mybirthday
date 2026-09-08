import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DadJokeTicker } from './components/DadJokeTicker';
import { DadRulesSection } from './components/DadRulesSection';
import { DadStatsSection } from './components/DadStatsSection';
import { DadAchievementsSection } from './components/DadAchievementsSection';
import { AgeComparisonSection } from './components/AgeComparisonSection';
import { RendezvousCoordinates } from './components/RendezvousCoordinates';
import { RsvpSection } from './components/RsvpSection';
import { WishlistSection } from './components/WishlistSection';
import { ComicPortraitModal } from './components/ComicPortraitModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { RsvpSubmission } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'invitation' | 'admin'>('invitation');
  const [isComicOpen, setIsComicOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Check saved admin session on mount
  useEffect(() => {
    try {
      const savedToken = sessionStorage.getItem('alans_admin_token');
      if (savedToken) {
        setAdminToken(savedToken);
      }
    } catch {}
  }, []);

  const handleScrollToSection = (id: string) => {
    if (activeTab !== 'invitation') {
      setActiveTab('invitation');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAdmin = () => {
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-[#FFF7E6] font-sans selection:bg-[#F5B942]/40 selection:text-[#FFF7E6]">
      {/* Retro Navigation Bar */}
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={!!adminToken}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenComic={() => setIsComicOpen(true)}
      />

      {/* Main Content Area */}
      <main>
        {activeTab === 'invitation' ? (
          <>
            {/* 1. Hero Section (1980s Dad Comedy Poster Style) */}
            <HeroSection
              onScrollToRsvp={() => handleScrollToSection('rsvp')}
              onScrollToWishlist={() => handleScrollToSection('wishlist')}
              onOpenComic={() => setIsComicOpen(true)}
            />

            {/* 2. Retro Animated Dad Joke Ticker */}
            <DadJokeTicker />

            {/* 3. Dad Rules (6 Cards + Interactive Joke Dispenser) */}
            <DadRulesSection />

            {/* 4. Dad Performance Report™ (Stats & Diagnostic Telemetry) */}
            <DadStatsSection />

            {/* 5. Dad Achievements Unlocked (Trophies & Badges) */}
            <DadAchievementsSection />

            {/* 6. Age Section (30+ vs 20s Comparison Matrix) */}
            <AgeComparisonSection />

            {/* 7. Rendezvous Coordinates (When, Where, Plan, Payment, Dress Code & Legal Disclaimer) */}
            <RendezvousCoordinates />

            {/* 8. Protocol Confirmation (Roll Call RSVP: Yes / Maybe / No) */}
            <RsvpSection
              onRsvpSubmitted={(rsvp) => {
                console.log('RSVP submitted successfully:', rsvp);
              }}
            />

            {/* 9. Optional Tribute (Daddy's Wishlist with Anonymous Reservations) */}
            <WishlistSection />

            {/* 10. Footer */}
            <Footer
              onOpenAdmin={handleOpenAdmin}
              onOpenComic={() => setIsComicOpen(true)}
            />
          </>
        ) : (
          /* Admin Dashboard (Password Protected: daddy2026) */
          <AdminDashboard
            onBackToInvite={() => {
              setActiveTab('invitation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            adminToken={adminToken}
            setAdminToken={setAdminToken}
          />
        )}
      </main>

      {/* Alan Comic Character Portrait Modal */}
      <ComicPortraitModal
        isOpen={isComicOpen}
        onClose={() => setIsComicOpen(false)}
      />
    </div>
  );
}
