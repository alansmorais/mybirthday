import React from 'react';
import { TICKER_JOKES } from '../data/dadJokes';
import { Sparkles, Radio, Tv } from 'lucide-react';

export const DadJokeTicker: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-[#172554] border-y-2 border-[#F5B942] py-2 shadow-lg text-[#FFF7E6] select-none">
      {/* Retro VHS Scanline effect background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:100%_3px] pointer-events-none" />

      {/* Left Badge: Retro Live TV Feed */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center px-3 bg-[#F5B942] text-neutral-950 font-arcade text-[10px] tracking-wider uppercase border-r-2 border-neutral-950 shadow-md">
        <span className="flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          DAD TICKER
        </span>
      </div>

      {/* Continuous Marquee */}
      <div className="flex animate-marquee items-center pl-32 whitespace-nowrap">
        {TICKER_JOKES.concat(TICKER_JOKES).map((joke, index) => (
          <div key={index} className="flex items-center gap-4 mx-6 text-xs sm:text-sm font-space font-bold tracking-wider text-amber-200">
            <span>{joke}</span>
            <span className="text-[#38BDF8] text-xs">★</span>
          </div>
        ))}
      </div>
    </div>
  );
};
