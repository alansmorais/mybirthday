import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CompactInvitationCard } from './components/CompactInvitationCard';
import { RsvpModal } from './components/RsvpModal';
import { WishlistModal } from './components/WishlistModal';
import { ComicPortraitModal } from './components/ComicPortraitModal';
import { DadExtrasModal } from './components/DadExtrasModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'invitation' | 'admin'>('invitation');
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpInitialView, setRsvpInitialView] = useState<'form' | 'roster'>('form');
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isComicOpen, setIsComicOpen] = useState(false);
  const [isExtrasOpen, setIsExtrasOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

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

  const handleOpenExtras = () => {
    setIsExtrasOpen(true);
  };

  const handleOpenAdmin = () => {
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/60 via-purple-50/30 to-sky-50/40 text-slate-800 font-sans selection:bg-[#EC4899] selection:text-white flex flex-col justify-between">
      {/* Barra de Navegação */}
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={!!adminToken}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenComic={() => setIsComicOpen(true)}
        onOpenExtras={handleOpenExtras}
        onOpenRsvp={handleOpenRsvp}
        onOpenWishlist={handleOpenWishlist}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col justify-center pt-20 sm:pt-24 pb-8">
        {activeTab === 'invitation' ? (
          <CompactInvitationCard
            onOpenRsvp={handleOpenRsvp}
            onOpenWishlist={handleOpenWishlist}
            onOpenExtras={handleOpenExtras}
            onOpenComic={() => setIsComicOpen(true)}
          />
        ) : (
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

      {/* Rodapé */}
      {activeTab === 'invitation' && (
        <Footer
          onOpenAdmin={handleOpenAdmin}
          onOpenComic={() => setIsComicOpen(true)}
        />
      )}

      {/* 1. Modal de Confirmação de Presença (RSVP) */}
      <RsvpModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        initialView={rsvpInitialView}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* 2. Modal de Mimos & PIX (Wishlist) */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />

      {/* 3. Modal de Dicas & Guia da Festa */}
      <DadExtrasModal
        isOpen={isExtrasOpen}
        onClose={() => setIsExtrasOpen(false)}
      />

      {/* 4. Modal Conheça as Aniversariantes (Skye & Everest) */}
      <ComicPortraitModal
        isOpen={isComicOpen}
        onClose={() => setIsComicOpen(false)}
      />
    </div>
  );
}
