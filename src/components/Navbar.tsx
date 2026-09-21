import React, { useState, useEffect } from 'react';
import { Sparkles, Lock, Menu, X, Laugh, Beer, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  const { lang, setLang, t } = useLanguage();
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#0a0f1d]/95 backdrop-blur-md border-b-2 border-[#1e2e54] py-2 shadow-2xl'
          : 'bg-[#0a0f1d]/90 backdrop-blur-md border-b border-white/10 py-2.5'
      }`}
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-6 flex items-center justify-between">
        {/* Left: Avatar + Host Name */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenComic}
            title={t('comicPortrait', 'nav')}
            className="group relative flex items-center justify-center rounded-full p-[2px] bg-gradient-to-tr from-[#F5B942] via-[#FF8A3D] to-[#38BDF8] hover:scale-105 transition-transform duration-200 cursor-pointer shrink-0"
            id="nav-avatar-btn"
          >
            <img
              src={AVATAR_URL}
              alt="Alan Morais"
              referrerPolicy="no-referrer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-[#0d1527]"
            />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5 items-center justify-center rounded-full bg-[#22C55E] ring-2 ring-[#0d1527]">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
            </span>
          </button>

          <div
            className="cursor-pointer"
            onClick={() => {
              if (activeTab === 'admin') {
                setActiveTab('invitation');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-[#F5B942] font-cinzel whitespace-nowrap">
                Alan Morais
              </span>
              <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded bg-[#F5B942] text-neutral-950 font-arcade font-black">
                30+
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-sky-200/90 font-space font-medium whitespace-nowrap">
              {lang === 'PT' ? 'Sex, 25 Set • Cracóvia' : lang === 'PL' ? 'Pt, 25 Wrz • Kraków' : 'Fri, Sep 25 • Kraków'}
            </p>
          </div>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-space font-bold text-zinc-300">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-[#F5B942] transition-colors py-1 cursor-pointer"
          >
            {t('whenWhere', 'nav')}
          </button>
          <button
            onClick={() => {
              if (onOpenRsvp) onOpenRsvp('form');
              else scrollToSection('rsvp');
            }}
            className="text-[#F5B942] hover:text-[#ffc85a] transition-colors font-extrabold py-1 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t('rsvp', 'nav')}</span>
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
          </button>
          <button
            onClick={() => {
              if (onOpenWishlist) onOpenWishlist();
              else scrollToSection('wishlist');
            }}
            className="hover:text-[#F5B942] transition-colors py-1 cursor-pointer"
          >
            {t('wishlist', 'nav')}
          </button>
          <button
            onClick={() => {
              if (onOpenExtras) onOpenExtras();
              else scrollToSection('briefing');
            }}
            className="px-3 py-1 rounded-xl bg-[#172554] hover:bg-[#1e2e54] text-[#F5B942] border border-[#F5B942]/40 transition-all cursor-pointer font-extrabold flex items-center gap-1.5 hover:scale-105"
          >
            <span>😂</span>
            <span>{t('rules', 'nav')}</span>
          </button>
        </nav>

        {/* Right: Headcount + Admin Access */}
        <div className="flex items-center gap-2.5">
          {publicStats && publicStats.totalHeadcount > 0 && (
            <button
              onClick={() => {
                if (onOpenRsvp) onOpenRsvp('roster');
                else {
                  scrollToSection('confirmed-squad');
                  const tab = document.getElementById('tab-confirmed-squad');
                  if (tab) tab.click();
                }
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#172554] hover:bg-[#1e2e54] border border-[#38BDF8]/40 hover:border-[#22C55E] text-[11px] text-[#FFF7E6] font-space font-bold cursor-pointer transition-all shadow-sm"
              title="Click to view confirmed roll call"
            >
              <span className="text-[#22C55E]">●</span>
              <span className="text-[#F5B942]">{publicStats.totalHeadcount}</span>
              <span>{t('confirmed', 'nav')}</span>
            </button>
          )}

          {/* Tri-Language Selector */}
          <button
            onClick={() => {
              if (lang === 'PL') setLang('EN');
              else if (lang === 'EN') setLang('PT');
              else setLang('PL');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#172554] hover:bg-[#1e2e54] text-[#38BDF8] border border-[#38BDF8]/40 transition-all cursor-pointer font-space"
            title="Switch Language (PL / EN / PT)"
          >
            <span>{lang === 'PL' ? '🇵🇱' : lang === 'EN' ? '🇬🇧' : '🇧🇷'}</span>
            <span>{lang}</span>
          </button>

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
            title="Dad's Admin Guest List"
          >
            <Lock className="w-3 h-3 text-[#F5B942]" />
            <span className="hidden sm:inline">{activeTab === 'admin' ? t('back', 'nav') : t('dadVault', 'nav')}</span>
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
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-zinc-200 hover:bg-[#172554] hover:text-[#F5B942]"
          >
            {t('whenWhere', 'nav')}
          </button>
          <button
            onClick={() => {
              if (onOpenRsvp) onOpenRsvp('form');
              else scrollToSection('rsvp');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg font-bold text-neutral-950 bg-[#F5B942] font-arcade flex items-center justify-between"
          >
            <span>{t('rsvp', 'nav')}</span>
            <span>🚀</span>
          </button>
          <button
            onClick={() => {
              if (onOpenRsvp) onOpenRsvp('roster');
              else {
                scrollToSection('confirmed-squad');
                const tab = document.getElementById('tab-confirmed-squad');
                if (tab) tab.click();
              }
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg font-bold text-[#22C55E] bg-[#172554] border border-[#22C55E]/40 font-arcade flex items-center justify-between"
          >
            <span>👥 {lang === 'PT' ? 'QUEM CONFIRMOU' : lang === 'PL' ? 'KTO POTWIERDZIŁ' : "WHO'S CONFIRMED"}</span>
            {publicStats && publicStats.totalHeadcount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#22C55E] text-neutral-950 text-[10px] font-mono font-black">
                {publicStats.totalHeadcount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              if (onOpenWishlist) onOpenWishlist();
              else scrollToSection('wishlist');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-[#38BDF8] bg-[#172554] border border-[#38BDF8]/40 hover:bg-[#1e2e54] flex items-center justify-between"
          >
            <span>{t('wishlist', 'nav')}</span>
            <span>🎁</span>
          </button>
          <button
            onClick={() => {
              if (onOpenExtras) onOpenExtras();
              else scrollToSection('briefing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-[#F5B942] bg-[#172554] border border-[#F5B942]/40 font-bold flex items-center gap-1.5"
          >
            <span>😂</span>
            <span>{t('rules', 'nav')}</span>
          </button>
          <button
            onClick={() => {
              onOpenComic();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-amber-200 hover:bg-[#172554] flex items-center justify-between"
          >
            <span>{t('comicPortrait', 'nav')}</span>
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
            <span>{t('guestRegistry', 'nav')}</span>
          </button>
        </div>
      )}
    </header>
  );
};
