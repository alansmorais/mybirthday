import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Gift, Calendar, MapPin, Beer, Laugh, Star, Zap, ShieldAlert, Award } from 'lucide-react';

interface HeroSectionProps {
  onScrollToRsvp: () => void;
  onScrollToWishlist: () => void;
  onOpenComic: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToRsvp,
  onScrollToWishlist,
  onOpenComic
}) => {
  const AVATAR_URL = 'https://avatars.githubusercontent.com/u/78435965?s=400&u=085533adc24d2ec6471affc4d4bc6ea051882a28&v=4';

  return (
    <section id="hero" className="relative pt-24 pb-14 px-4 text-center overflow-hidden bg-retro-dots">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] bg-gradient-to-tr from-[#F5B942]/20 via-[#38BDF8]/15 to-[#FF8A3D]/20 blur-[130px] pointer-events-none rounded-full" />

      {/* Floating Retro 80s Stickers */}
      <div className="absolute top-20 left-4 sm:left-12 hidden md:block rotate-[-8deg] pointer-events-none z-0">
        <div className="px-3 py-1.5 rounded-lg bg-[#F5B942] text-neutral-950 font-arcade text-[11px] font-black tracking-wider uppercase border-2 border-neutral-950 sticker-badge shadow-lg">
          ★ LIMITED EDITION DAD ★
        </div>
      </div>

      <div className="absolute top-28 right-4 sm:right-12 hidden md:block rotate-[6deg] pointer-events-none z-0">
        <div className="px-3 py-1.5 rounded-lg bg-[#38BDF8] text-neutral-950 font-arcade text-[11px] font-black tracking-wider uppercase border-2 border-neutral-950 sticker-badge shadow-lg">
          ⚡ 30+ YEARS EXPERIENCE ⚡
        </div>
      </div>

      <div className="absolute bottom-16 left-6 sm:left-16 hidden lg:block rotate-[4deg] pointer-events-none z-0">
        <div className="px-3 py-1.5 rounded-lg bg-[#22C55E] text-neutral-950 font-arcade text-[10px] font-black tracking-wider uppercase border-2 border-neutral-950 sticker-badge shadow-lg">
          ✓ STILL NO USER MANUAL
        </div>
      </div>

      <div className="absolute bottom-20 right-6 sm:right-16 hidden lg:block rotate-[-6deg] pointer-events-none z-0">
        <div className="px-3 py-1.5 rounded-lg bg-[#FF8A3D] text-neutral-950 font-arcade text-[10px] font-black tracking-wider uppercase border-2 border-neutral-950 sticker-badge shadow-lg">
          🔥 EXTRA DAD JOKES INSIDE
        </div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Top VHS / Arcade Mode Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#172554] border-2 border-[#F5B942] text-[#F5B942] text-xs font-arcade uppercase tracking-widest mb-6 sticker-badge shadow-md"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>DAD MODE: ACTIVATED • LEVEL 30+</span>
        </motion.div>

        {/* Alan's Photo with 80s Comic Burst & Colorful Outline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative inline-block mb-6 group cursor-pointer"
          onClick={onOpenComic}
        >
          {/* Comic Burst Star / Sunburst behind */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#F5B942] via-[#FF8A3D] to-[#38BDF8] opacity-80 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300"></div>

          {/* Retro Colorful Photo Frame */}
          <div className="relative p-1.5 rounded-full bg-[#0d1527] border-4 border-[#F5B942] shadow-2xl">
            <img
              src={AVATAR_URL}
              alt="Alan Morais"
              referrerPolicy="no-referrer"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-inner group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Sarcastic Speech / Sticker Badge */}
          <div className="absolute -bottom-2 -right-4 bg-[#FF8A3D] text-neutral-950 font-arcade font-black text-[11px] px-3 py-1 rounded-xl shadow-xl flex items-center gap-1.5 border-2 border-neutral-950 group-hover:scale-110 transition-transform sticker-badge">
            <span>😂 MEET THE DAD</span>
          </div>

          {/* Top Left Mini Badge */}
          <div className="absolute -top-2 -left-4 bg-[#22C55E] text-neutral-950 font-arcade font-black text-[9px] px-2 py-0.5 rounded-lg border-2 border-neutral-950 sticker-badge hidden sm:block">
            100% RETRO
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-4"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-cinzel font-black tracking-wider text-retro-gold drop-shadow-md leading-none">
            ALAN IS 30+
          </h1>
          <p className="text-base sm:text-xl font-space font-bold uppercase tracking-wider text-[#38BDF8] mt-2">
            (AND OFFICIALLY LICENSED TO MAKE TERRIBLE DAD JOKES)
          </p>
        </motion.div>

        {/* Punchy Sarcastic Subtitle & Micro-Jokes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-7 space-y-2 max-w-xl mx-auto"
        >
          <p className="text-lg sm:text-xl text-[#FFF7E6] font-playfair italic font-semibold">
            "Hi 30+, I'm Dad. My knees now make more noise than my jokes."
          </p>
          <p className="text-xs sm:text-sm text-amber-200/90 font-sans">
            "30+ years of experience. Still no idea what I'm doing. Come celebrate with craft beers, laughter, and zero adult responsibilities."
          </p>
        </motion.div>

        {/* When & Where Retro Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          <div className="px-4 py-2 rounded-xl bg-[#172554] border-2 border-[#F5B942] text-xs font-space font-bold text-[#FFF7E6] flex items-center gap-2 shadow-md">
            <Calendar className="w-4 h-4 text-[#F5B942]" />
            <span>Friday • 18 September 2026</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#172554] border-2 border-[#38BDF8] text-xs font-space font-bold text-[#FFF7E6] flex items-center gap-2 shadow-md">
            <MapPin className="w-4 h-4 text-[#38BDF8]" />
            <span>Beer Street, Kraków • ~19:30</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4"
        >
          {/* RSVP Button */}
          <button
            onClick={onScrollToRsvp}
            id="hero-rsvp-btn"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#F5B942] hover:bg-[#ffc85a] text-neutral-950 font-arcade text-xs sm:text-sm uppercase tracking-wider font-black hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg border-2 border-neutral-950 sticker-badge cursor-pointer"
          >
            <span>RSVP (Say YES)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onScrollToWishlist}
            id="hero-wishlist-btn"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#172554] hover:bg-[#1e2e54] text-[#38BDF8] hover:text-[#FFF7E6] font-arcade text-xs sm:text-sm uppercase tracking-wider font-black border-2 border-[#38BDF8] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer sticker-badge"
          >
            <span>🎁</span>
            <span>DADDY'S WISHLIST</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
