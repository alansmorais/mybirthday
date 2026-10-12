import React, { useState, useEffect } from 'react';
import { Lock, Menu, X, Gift } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  activeTab: 'invitation' | 'admin';
  setActiveTab: (tab: 'invitation' | 'admin') => void;
  onOpenComic: () => void;
  onOpenExtras?: (tab?: any) => void;
  onOpenRsvp?: (initialView?: 'form' | 'roster') => void;
  onOpenWishlist?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  isAdminLoggedIn,
  activeTab,
  setActiveTab,
  onOpenComic,
  onOpenExtras,
  onOpenRsvp,
  onOpenWishlist
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-pink-100/80 text-slate-800'
          : 'bg-white/80 backdrop-blur-xs border-b border-pink-50 text-slate-800'
      }`}
    >
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            setActiveTab('invitation');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 flex items-center justify-center text-lg shadow-2xs group-hover:scale-105 transition-transform">
            🐾
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-slate-900">
                <span className="text-[#EC4899]">ADA</span> <span className="text-slate-300 font-light">&</span> <span className="text-[#8B5CF6]">GABI</span>
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-pink-50 text-[#EC4899] border border-pink-100">
                PATRULHA CANINA
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              Casa da Bisavó • Sábado, 14 • A partir do meio-dia
            </p>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => onOpenRsvp && onOpenRsvp('form')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:opacity-95 text-white font-bold text-xs tracking-wide transition-all cursor-pointer shadow-xs"
          >
            Confirmar Presença 🐾
          </button>

          <button
            onClick={onOpenWishlist}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Gift className="w-3.5 h-3.5 text-[#EC4899]" />
            <span>Mimos & PIX</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 transition-all cursor-pointer"
            title="Painel dos Pais (Admin)"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Buttons */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => onOpenRsvp && onOpenRsvp('form')}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white font-bold text-[11px] cursor-pointer shadow-2xs"
          >
            RSVP 🐾
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-200"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 p-3 space-y-1.5 shadow-md">
          <button
            onClick={() => {
              onOpenWishlist && onOpenWishlist();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2"
          >
            <Gift className="w-4 h-4 text-[#EC4899]" />
            <span>Lista de Mimos & PIX de Inverno</span>
          </button>

          <button
            onClick={() => {
              onOpenAdmin();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Painel dos Pais (Admin)</span>
          </button>
        </div>
      )}
    </nav>
  );
};
