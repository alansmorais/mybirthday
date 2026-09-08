import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ExternalLink, Check, Compass, Clock, Wallet, Beer, Utensils, Smile, Flame } from 'lucide-react';
import { DadCasualDressCode } from './DadCasualDressCode';
import { DadDisclaimerBox } from './DadDisclaimerBox';

export const RendezvousCoordinates: React.FC = () => {
  const [copiedPin, setCopiedPin] = useState(false);

  const handleCopyLocation = () => {
    navigator.clipboard.writeText('Kazimierz / Beer Street, Kraków, Poland');
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2500);
  };

  const handleAddToCalendar = () => {
    const startTime = '20260918T173000Z'; // 19:30 CEST
    const endTime = '20260918T233000Z';
    const title = encodeURIComponent("Alan's 30+ Birthday Party (Dad Mode Activated)");
    const details = encodeURIComponent("Alan's 30+ Birthday Party in Kraków! Craft beers, dad jokes, bad dancing & fun.");
    const location = encodeURIComponent("Beer Street, Kazimierz, Kraków");
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
            <span>RADAR NAVIGATION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-cinzel font-black tracking-wide text-retro-gold">
            THE EVENT LOGISTICS
          </h2>
          <p className="text-sm sm:text-base text-amber-200/90 font-playfair italic max-w-md mx-auto">
            "Arrive on time, leave when Dad makes his second yawning announcement."
          </p>
        </div>

        {/* 4 Cards Grid: When, Where, Plan, Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. WHEN */}
          <div className="p-6 rounded-2xl bg-[#111c35] border-2 border-[#F5B942] shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-arcade px-2.5 py-1 rounded bg-[#F5B942] text-neutral-950 font-bold">
                  📅 WHEN
                </span>
                <Clock className="w-4 h-4 text-[#F5B942]" />
              </div>
              <h3 className="text-xl font-cinzel font-bold text-[#FFF7E6]">
                Friday • 18 September 2026
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans">
                Starts around <strong className="text-[#F5B942]">19:30</strong>. "If you are 15 minutes early, you're on time. If you are on time, you're late."
              </p>
            </div>
            <button
              onClick={handleAddToCalendar}
              className="w-full py-2.5 px-4 rounded-xl bg-[#172554] hover:bg-[#1e2e54] border border-[#F5B942]/50 text-[#F5B942] text-xs font-arcade flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>ADD TO GOOGLE CALENDAR</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. WHERE */}
          <div className="p-6 rounded-2xl bg-[#111c35] border-2 border-[#38BDF8] shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-arcade px-2.5 py-1 rounded bg-[#38BDF8] text-neutral-950 font-bold">
                  📍 WHERE
                </span>
                <MapPin className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <h3 className="text-xl font-cinzel font-bold text-[#FFF7E6]">
                Beer Street, Kraków
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans">
                Kazimierz / Old Town sector. Exact pub coordinate will be broadcasted to confirmed guests.
              </p>
            </div>
            <button
              onClick={handleCopyLocation}
              className="w-full py-2.5 px-4 rounded-xl bg-[#172554] hover:bg-[#1e2e54] border border-[#38BDF8]/50 text-[#38BDF8] text-xs font-arcade flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Compass className="w-3.5 h-3.5" />}
              <span>{copiedPin ? 'COPIED TO CLIPBOARD!' : 'COPY LOCATION PIN'}</span>
            </button>
          </div>

          {/* 3. THE PLAN */}
          <div className="p-6 rounded-2xl bg-[#111c35] border-2 border-[#FF8A3D] shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-arcade px-2.5 py-1 rounded bg-[#FF8A3D] text-neutral-950 font-bold">
                  🍺 THE PLAN
                </span>
                <Smile className="w-4 h-4 text-[#FF8A3D]" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-[#FFF7E6]">
                Beer. Food. Laughing. Questionable decisions.
              </h3>
              <ul className="text-xs text-zinc-300 space-y-1 font-sans">
                <li>• 19:30 - Opening pints & initial knee-creak complaints</li>
                <li>• 20:30 - Dad jokes & culinary sustenance</li>
                <li>• 22:00 - Dad announces he's "not tired" while falling asleep</li>
              </ul>
            </div>
            <div className="text-[11px] font-space text-amber-300/80 italic">
              "Agenda subject to random Wikipedia tangents."
            </div>
          </div>

          {/* 4. PAYMENT POLICY */}
          <div className="p-6 rounded-2xl bg-[#111c35] border-2 border-[#22C55E] shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-arcade px-2.5 py-1 rounded bg-[#22C55E] text-neutral-950 font-bold">
                  💸 PAYMENT POLICY
                </span>
                <Wallet className="w-4 h-4 text-[#22C55E]" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-[#FFF7E6]">
                Everyone pays for themselves.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                "Daddy has many talents. Funding 15 adults' bar tabs is not one of them. Split checks build character."
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#172554] border border-[#22C55E]/30 text-center text-xs font-space text-emerald-300">
              💵 Card & Blik accepted at venue
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
