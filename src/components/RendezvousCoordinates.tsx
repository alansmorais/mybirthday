import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ExternalLink, Check, Compass, Clock, Wallet, Smile } from 'lucide-react';
import { DadCasualDressCode } from './DadCasualDressCode';
import { DadDisclaimerBox } from './DadDisclaimerBox';
import { useLanguage } from '../context/LanguageContext';

export const RendezvousCoordinates: React.FC = () => {
  const { t } = useLanguage();
  const [copiedPin, setCopiedPin] = useState(false);

  const handleCopyLocation = () => {
    navigator.clipboard.writeText('Lindo Bar - Sławkowska 23 - Kraków, Poland');
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2500);
  };

  const handleAddToCalendar = () => {
    const startTime = '20260925T173000Z'; // 19:30 CEST on Sep 25 is 17:30 UTC
    const endTime = '20260925T233000Z';
    const title = encodeURIComponent("Alan's 30+ Birthday Party (Dad Mode Activated)");
    const details = encodeURIComponent("Alan's 30+ Birthday Party in Kraków! Craft beers, dad jokes, bad dancing & fun.");
    const location = encodeURIComponent("Lindo Bar - Sławkowska 23 - Kraków");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="coordinates" className="py-12 px-4 relative bg-retro-grid">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e293b] border-2 border-[#F5B942] text-[#F5B942] text-xs font-arcade uppercase tracking-wider sticker-badge">
            <Compass className="w-3.5 h-3.5" />
            <span>{t('badge', 'logistics')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-cinzel font-black tracking-wide text-retro-gold">
            {t('title', 'logistics')}
          </h2>
          <p className="text-sm sm:text-base text-amber-200/90 font-playfair italic max-w-md mx-auto">
            {t('subtext', 'logistics')}
          </p>
        </div>

        {/* 4 Cards Grid: When, Where, Plan, Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. WHEN */}
          <div className="p-6 rounded-2xl bg-[#111c35] border-2 border-[#F5B942] shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-arcade px-2.5 py-1 rounded bg-[#F5B942] text-neutral-950 font-bold">
                  {t('whenBadge', 'logistics')}
                </span>
                <Clock className="w-4 h-4 text-[#F5B942]" />
              </div>
              <h3 className="text-xl font-cinzel font-bold text-[#FFF7E6]">
                {t('whenTitle', 'logistics')}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans">
                {t('whenDesc', 'logistics')}
              </p>
            </div>
            <button
              onClick={handleAddToCalendar}
              className="w-full py-2.5 px-4 rounded-xl bg-[#172554] hover:bg-[#1e2e54] border border-[#F5B942]/50 text-[#F5B942] text-xs font-arcade flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{t('whenBtn', 'logistics')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. WHERE */}
          <div className="p-6 rounded-2xl bg-[#111c35] border-2 border-[#38BDF8] shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-arcade px-2.5 py-1 rounded bg-[#38BDF8] text-neutral-950 font-bold">
                  {t('whereBadge', 'logistics')}
                </span>
                <MapPin className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <h3 className="text-xl font-cinzel font-bold text-[#FFF7E6]">
                {t('whereTitle', 'logistics')}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans">
                {t('whereDesc', 'logistics')}
              </p>
            </div>
            <button
              onClick={handleCopyLocation}
              className="w-full py-2.5 px-4 rounded-xl bg-[#172554] hover:bg-[#1e2e54] border border-[#38BDF8]/50 text-[#38BDF8] text-xs font-arcade flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Compass className="w-3.5 h-3.5" />}
              <span>{copiedPin ? t('whereBtnCopied', 'logistics') : t('whereBtn', 'logistics')}</span>
            </button>
          </div>

          {/* 3. THE PLAN */}
          <div className="p-6 rounded-2xl bg-[#111c35] border-2 border-[#FF8A3D] shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-arcade px-2.5 py-1 rounded bg-[#FF8A3D] text-neutral-950 font-bold">
                  {t('planBadge', 'logistics')}
                </span>
                <Smile className="w-4 h-4 text-[#FF8A3D]" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-[#FFF7E6]">
                {t('planTitle', 'logistics')}
              </h3>
              <ul className="text-xs text-zinc-300 space-y-1 font-sans">
                <li>{t('planItem1', 'logistics')}</li>
                <li>{t('planItem2', 'logistics')}</li>
                <li>{t('planItem3', 'logistics')}</li>
              </ul>
            </div>
            <div className="text-[11px] font-space text-amber-300/80 italic">
              {t('planFoot', 'logistics')}
            </div>
          </div>

          {/* 4. PAYMENT POLICY */}
          <div className="p-6 rounded-2xl bg-[#111c35] border-2 border-[#22C55E] shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-arcade px-2.5 py-1 rounded bg-[#22C55E] text-neutral-950 font-bold">
                  {t('payBadge', 'logistics')}
                </span>
                <Wallet className="w-4 h-4 text-[#22C55E]" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-[#FFF7E6]">
                {t('payTitle', 'logistics')}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                {t('payDesc', 'logistics')}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#172554] border border-[#22C55E]/30 text-center text-xs font-space text-emerald-300">
              {t('payFoot', 'logistics')}
            </div>
          </div>
        </div>

        {/* Dad Casual Dress Code */}
        <DadCasualDressCode />

        {/* Official Legal Disclaimer */}
        <DadDisclaimerBox />
      </div>
    </section>
  );
};
