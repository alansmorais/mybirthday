import React, { useState, useEffect } from 'react';
import { Sparkles, Lock, Menu, X, Laugh, Beer } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  activeTab: 'invitation' | 'admin';
  setActiveTab: (tab: 'invitation' | 'admin') => void;
  onOpenComic: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  isAdminLoggedIn,
  activeTab,
  setActiveTab,
  onOpenComic
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [publicStats, setPublicStats] = useState<{ attendingCount: number; totalHeadcount: number } | null>(null);

  const AVATAR_URL = 'https://avatars.githubusercontent.com/u/78435965?s=400&u=085533adc24d2ec6471affc4d4bc6ea051882a28&v=4';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/rsvps/public-stats')
      .then(res => {
        if (!res.ok) throw new Error('API unavailable');
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) throw new Error('Not JSON');
        return res.json();
      })
      .then(data => {
        if (data && typeof data.totalHeadcount === 'number') {
          setPublicStats(data);
        }
      })
      .catch(() => {
        try {
          const localRsvps = JSON.parse(localStorage.getItem('alans_rsvps') || '[]');
          const confirmed = localRsvps.filter((r: any) => r.status === 'YES');
          const headcount = confirmed.reduce((acc: number, r: any) => acc + (r.guestCount || 1), 0);
          if (headcount > 0) {
            setPublicStats({ attendingCount: confirmed.length, totalHeadcount: headcount });
          }
        } catch {}
      });
  }, []);

  const scrollToSection = (id: string) => {
    if (activeTab !== 'admin') {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('invitation');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0d1527]/95 backdrop-blur-md border-b-2 border-[#1e2e54] py-2.5 shadow-2xl'
          : 'bg-transparent py-3.5 border-b border-white/10'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Avatar + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenComic}
            title="Click to view Comic Alan"
            className="group relative flex items-center justify-center rounded-full p-[2px] bg-gradient-to-tr from-[#F5B942] via-[#FF8A3D] to-[#38BDF8] hover:scale-105 transition-transform duration-200 cursor-pointer"
            id="nav-avatar-btn"
          >
            <img
              src={AVATAR_URL}
              alt="Alan Morais"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border-2 border-[#0d1527]"
            />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#22C55E] ring-2 ring-[#0d1527]">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
            </span>
          </button>

          <div className="cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#F5B942] font-cinzel">
                Alan's 30+ Birthday
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F5B942] text-neutral-950 font-arcade font-black hidden sm:inline-block">
                DAD MODE 👴
              </span>
            </div>
            <p className="text-[11px] text-sky-200 font-space font-medium">
              Fri, Sept 18 • Kraków
            </p>
          </div>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-space font-bold text-zinc-300">
          <button
            onClick={() => scrollToSection('briefing')}
            className="hover:text-[#F5B942] transition-colors py-1 cursor-pointer"
          >
            Dad Rules
          </button>
          <button
            onClick={() => scrollToSection('coordinates')}
            className="hover:text-[#F5B942] transition-colors py-1 cursor-pointer"
          >
            When & Where
          </button>
          <button
            onClick={() => scrollToSection('rsvp')}
            className="text-[#F5B942] hover:text-[#ffc85a] transition-colors font-extrabold py-1 flex items-center gap-1.5 cursor-pointer"
          >
            <span>RSVP</span>
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
          </button>
          <button
            onClick={() => scrollToSection('wishlist')}
            className="hover:text-[#F5B942] transition-colors py-1 cursor-pointer"
          >
            Wishlist 🎁
          </button>
        </nav>

        {/* Right: Headcount + Admin Access */}
        <div className="flex items-center gap-2.5">
          {publicStats && publicStats.totalHeadcount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#172554] border border-[#38BDF8]/40 text-[11px] text-[#FFF7E6] font-space font-bold">
              <span className="text-[#F5B942]">{publicStats.totalHeadcount}</span>
              <span>confirmed</span>
            </div>
          )}

          {/* Admin Vault Button */}
          <button
            onClick={() => {
              if (activeTab === 'admin') {
                setActiveTab('invitation');
              } else {
                onOpenAdmin();
              }
            }}
            id="admin-vault-nav-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-arcade bg-[#172554] hover:bg-[#1e2e54] text-[#F5B942] border border-[#F5B942]/40 transition-all cursor-pointer"
            title="Dad's Admin Guest List (Password: daddy2026)"
          >
            <Lock className="w-3 h-3 text-[#F5B942]" />
            <span className="hidden sm:inline">{activeTab === 'admin' ? 'Back' : 'Dad Vault'}</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#172554] border border-[#1e2e54] text-[#FFF7E6]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d1527] border-b-2 border-[#1e2e54] px-4 py-3 space-y-2 text-xs font-space font-bold">
          <button
            onClick={() => scrollToSection('briefing')}
            className="w-full text-left py-2 px-3 rounded-lg text-zinc-200 hover:bg-[#172554] hover:text-[#F5B942]"
          >
            Dad Rules & Jokes 😂
          </button>
          <button
            onClick={() => scrollToSection('coordinates')}
            className="w-full text-left py-2 px-3 rounded-lg text-zinc-200 hover:bg-[#172554] hover:text-[#F5B942]"
          >
            When & Where 📍
          </button>
          <button
            onClick={() => scrollToSection('rsvp')}
            className="w-full text-left py-2 px-3 rounded-lg font-bold text-neutral-950 bg-[#F5B942] font-arcade"
          >
            Roll Call RSVP 🚀
          </button>
          <button
            onClick={() => scrollToSection('wishlist')}
            className="w-full text-left py-2 px-3 rounded-lg text-zinc-200 hover:bg-[#172554] hover:text-[#F5B942]"
          >
            Daddy's Wishlist 🎁
          </button>
          <button
            onClick={() => {
              onOpenComic();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-amber-200 hover:bg-[#172554] flex items-center justify-between"
          >
            <span>Alan's Comic Portrait</span>
            <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
          </button>
          <button
            onClick={() => {
              onOpenAdmin();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-zinc-400 hover:bg-[#172554] flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-[#F5B942]" />
            <span>Admin Guest Registry</span>
          </button>
        </div>
      )}
    </header>
  );
};
