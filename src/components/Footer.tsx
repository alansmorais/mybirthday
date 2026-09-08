import React from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles, Beer, Laugh, Star, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenComic: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenComic }) => {
  return (
    <footer className="pt-16 pb-12 px-4 text-center border-t-2 border-[#1e2e54] bg-[#090e1a] relative overflow-hidden bg-retro-grid">
      <div className="max-w-xl mx-auto space-y-6 relative z-10">
        {/* Grand See You Friday */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#172554] border border-[#F5B942] text-[#F5B942] text-xs font-arcade uppercase">
            ★ FINAL REMINDER ★
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-cinzel font-black tracking-wider text-retro-gold drop-shadow-md">
            SEE YOU FRIDAY.
          </h2>
          <p className="text-sm sm:text-base text-amber-200/90 font-playfair italic">
            "I'm not sleeping at the pub, I'm just inspecting the insides of my eyelids."
          </p>
        </div>

        {/* Retro separator */}
        <div className="flex items-center justify-center gap-3 text-[#F5B942]">
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#F5B942]"></div>
          <span className="text-sm">★ ❖ ★</span>
          <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#F5B942]"></div>
        </div>

        {/* Humorous Tagline */}
        <div className="space-y-1 text-xs text-sky-200 font-space">
          <div className="font-extrabold text-[#F5B942] tracking-wider">
            ALAN'S 30+ DAD JOKE EXPERIENCE™ • KRAKÓW 2026
          </div>
          <p className="text-zinc-400">
            No thermostat tampering • Responsibilities permanently suspended • Pint glasses full
          </p>
        </div>

        {/* Footer Admin Links */}
        <div className="pt-4 flex items-center justify-center gap-5 text-xs font-space text-zinc-400">
          <button
            onClick={onOpenComic}
            className="hover:text-[#F5B942] transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
            <span>Comic Alan</span>
          </button>
          <span className="text-zinc-600">•</span>
          <button
            onClick={onOpenAdmin}
            className="hover:text-[#F5B942] transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <Lock className="w-3.5 h-3.5 text-[#F5B942]" />
            <span>Dad's Guest Vault</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
