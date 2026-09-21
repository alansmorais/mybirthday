import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CompactInvitationCard } from './components/CompactInvitationCard';
import { RsvpModal } from './components/RsvpModal';
import { WishlistModal } from './components/WishlistModal';
import { ComicPortraitModal } from './components/ComicPortraitModal';
import { DadExtrasModal } from './components/DadExtrasModal';
import { AdminDashboard } from './components/AdminDashboard';
import { LanguageSelectionModal } from './components/LanguageSelectionModal';
import { Footer } from './components/Footer';
import { RsvpSubmission } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'invitation' | 'admin'>('invitation');
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpInitialView, setRsvpInitialView] = useState<'form' | 'roster'>('form');
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isComicOpen, setIsComicOpen] = useState(false);
  const [isExtrasOpen, setIsExtrasOpen] = useState(false);
  const [extrasInitialTab, setExtrasInitialTab] = useState<'jokes' | 'rules' | 'stats' | 'trophies' | 'comparison' | 'dress'>('jokes');
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

  const handleOpenRsvp = (initialView: 'form' | 'roster' = 'form') => {
    setRsvpInitialView(initialView);
    setIsRsvpOpen(true);
  };

  const handleOpenWishlist = () => {
    setIsWishlistOpen(true);
  };

  const handleOpenExtras = (tab?: 'jokes' | 'rules' | 'stats' | 'trophies' | 'comparison' | 'dress') => {
    if (tab) setExtrasInitialTab(tab);
    setIsExtrasOpen(true);
  };

  const handleOpenAdmin = () => {
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-[#FFF7E6] font-sans selection:bg-[#F5B942]/40 selection:text-[#FFF7E6] flex flex-col justify-between">
      {/* Language Selection Modal */}
      <LanguageSelectionModal />

      {/* Navigation Bar */}
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={!!adminToken}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenComic={() => setIsComicOpen(true)}
        onOpenExtras={() => handleOpenExtras('jokes')}
        onOpenRsvp={handleOpenRsvp}
        onOpenWishlist={handleOpenWishlist}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center">
        {activeTab === 'invitation' ? (
          <>
            {/* Compact, non-long invitation screen for guests */}
            <CompactInvitationCard
              onOpenRsvp={handleOpenRsvp}
              onOpenWishlist={handleOpenWishlist}
              onOpenExtras={() => handleOpenExtras('jokes')}
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

      {/* Footer */}
      {activeTab === 'invitation' && (
        <Footer
          onOpenAdmin={handleOpenAdmin}
          onOpenComic={() => setIsComicOpen(true)}
        />
      )}

      {/* 1. Modal de Confirmação de Presença (RSVP & Lista de Confirmados) */}
      <RsvpModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        initialView={rsvpInitialView}
        onRsvpSubmitted={(rsvp) => {
          console.log('RSVP submitted:', rsvp);
        }}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* 2. Modal da Lista de Presentes a Escolher (Wishlist) */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />

      {/* 3. Modal de Piadas, Regras, Estatísticas e Extras */}
      <DadExtrasModal
        isOpen={isExtrasOpen}
        onClose={() => setIsExtrasOpen(false)}
        defaultTab={extrasInitialTab}
      />

      {/* 4. Alan Comic Character Portrait Modal */}
      <ComicPortraitModal
        isOpen={isComicOpen}
        onClose={() => setIsComicOpen(false)}
      />
    </div>
  );
}
