import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ExternalLink, Check, Compass, Clock, Wallet, Smile, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RendezvousCoordinatesProps {
  onOpenExtras?: (tab?: 'dress') => void;
}

export const RendezvousCoordinates: React.FC<RendezvousCoordinatesProps> = ({ onOpenExtras }) => {
  const { lang, t } = useLanguage();
  const [copiedPin, setCopiedPin] = useState(false);

  const handleCopyLocation = () => {
    navigator.clipboard.writeText('Lindo Bar, Sławkowska 23, 31-014 Kraków, Poland');
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2500);
  };

  const handleAddToCalendar = () => {
    const startTime = '20260925T173000Z'; // 19:30 CEST on Sep 25 is 17:30 UTC
    const endTime = '20260925T233000Z';
    const title = encodeURIComponent("Alan's 30+ Birthday Party");
    const details = encodeURIComponent("Alan's 30+ Birthday Party in Kraków! Craft beers, good food, laughs, and fun.");
    const location = encodeURIComponent("Lindo Bar - Sławkowska 23 - Kraków");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenMaps = () => {
    window.open('https://maps.google.com/?q=Lindo+Bar+Slawkowska+23+Krakow', '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="coordinates" className="py-12 px-4 relative bg-retro-grid">
      <div className="max-w-4xl mx-auto space-y-7">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e293b] border-2 border-[#F5B942] text-[#F5B942] text-xs font-arcade uppercase tracking-wider sticker-badge">
            <Compass className="w-3.5 h-3.5" />
            <span>{t('badge', 'logistics')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-black tracking-wide text-retro-gold">
            {t('title', 'logistics')}
          </h2>
          <p className="text-sm sm:text-base text-amber-200/90 font-playfair italic max-w-md mx-auto">
            {t('subtext', 'logistics')}
          </p>
        </div>

        {/* 2 Primary Essential Highlight Cards: Dia & Hora + Local */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. DIA & HORA */}
          <div className="p-6 rounded-2xl bg-[#111c35] border-2 border-[#F5B942] shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-arcade px-2.5 py-1 rounded bg-[#F5B942] text-neutral-950 font-bold">
                  {lang === 'PT' ? 'DIA & HORA' : t('whenBadge', 'logistics')}
                </span>
                <Clock className="w-5 h-5 text-[#F5B942]" />
              </div>
              <div>
                <h3 className="text-2xl font-cinzel font-bold text-[#FFF7E6]">
                  {t('whenTitle', 'logistics')}
                </h3>
                <p className="text-sm font-space font-bold text-[#F5B942] mt-1">
                  19:30 CEST
                </p>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans">
                {t('whenDesc', 'logistics')}
              </p>
            </div>
            <button
              onClick={handleAddToCalendar}
              className="w-full py-2.5 px-4 rounded-xl bg-[#172554] hover:bg-[#1e2e54] border border-[#F5B942]/50 text-[#F5B942] text-xs font-arcade flex items-center justify-center gap-2 transition-all cursor-pointer font-bold"
            >
              <span>{t('whenBtn', 'logistics')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. LOCAL */}
          <div className="p-6 rounded-2xl bg-[#111c35] border-2 border-[#38BDF8] shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-arcade px-2.5 py-1 rounded bg-[#38BDF8] text-neutral-950 font-bold">
                  {lang === 'PT' ? 'LOCALIZAÇÃO' : t('whereBadge', 'logistics')}
                </span>
                <MapPin className="w-5 h-5 text-[#38BDF8]" />
              </div>
              <div>
                <h3 className="text-2xl font-cinzel font-bold text-[#FFF7E6]">
                  {t('whereTitle', 'logistics')}
                </h3>
                <p className="text-sm font-space font-bold text-[#38BDF8] mt-1">
                  Sławkowska 23, Kraków
                </p>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans">
                {t('whereDesc', 'logistics')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCopyLocation}
                className="py-2.5 px-3 rounded-xl bg-[#172554] hover:bg-[#1e2e54] border border-[#38BDF8]/50 text-[#38BDF8] text-xs font-arcade flex items-center justify-center gap-1.5 transition-all cursor-pointer font-bold"
              >
                {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Compass className="w-3.5 h-3.5" />}
                <span>{copiedPin ? t('whereBtnCopied', 'logistics') : t('whereBtn', 'logistics')}</span>
              </button>
              <button
                onClick={handleOpenMaps}
                className="py-2.5 px-3 rounded-xl bg-[#172554] hover:bg-[#1e2e54] border border-[#38BDF8]/50 text-[#38BDF8] text-xs font-arcade flex items-center justify-center gap-1.5 transition-all cursor-pointer font-bold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Google Maps</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informações Práticas do Bar & Consumo (limpo e direto) */}
        <div className="p-5 rounded-2xl bg-[#111c35] border border-[#1e2e54] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] shrink-0 mt-0.5">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-cinzel font-bold text-[#FFF7E6]">
                {t('payTitle', 'logistics')}
              </h4>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                {t('payDesc', 'logistics')}
              </p>
            </div>
          </div>
          {onOpenExtras && (
            <button
              onClick={() => onOpenExtras('dress')}
              className="shrink-0 px-3.5 py-2 rounded-xl bg-[#172554] hover:bg-[#1e2e54] border border-[#F5B942]/40 text-[#F5B942] text-xs font-space font-bold hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>👔 {lang === 'PL' ? 'Dress code & Ciekawostki' : lang === 'PT' ? 'Dress code & Extras' : 'Dress Code & Extras'}</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
