import React from 'react';
import { motion } from 'motion/react';
import { Shirt, Footprints, Sparkles, AlertCircle } from 'lucide-react';

export const DadCasualDressCode: React.FC = () => {
  const codeItems = [
    {
      emoji: "👕",
      title: "SHIRT",
      label: "Nice enough",
      desc: "Cardigan, polo, or vintage t-shirt. Avoid high-fashion nonsense."
    },
    {
      emoji: "👖",
      title: "PANTS",
      label: "Comfortable enough",
      desc: "Cargo pockets encouraged for holding snacks, keys, and measuring tape."
    },
    {
      emoji: "👟",
      title: "FOOTWEAR",
      label: "Walking-home capable",
      desc: "New Balance sneakers or sensible footwear with arch support."
    },
    {
      emoji: "🕺",
      title: "VIBES",
      label: "Dance moves: optional",
      desc: "Thumbs in pockets, rhythmic foot tapping, and awkward finger guns."
    }
  ];

  return (
    <div className="rounded-2xl bg-[#111c35] border-2 border-[#38BDF8] p-6 shadow-xl relative overflow-hidden">
      {/* Top Header */}
      <div className="text-center mb-6 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8] text-[#38BDF8] text-xs font-arcade uppercase tracking-wider mb-2">
          <Shirt className="w-3.5 h-3.5" />
          <span>WARDROBE PROTOCOL</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-cinzel font-black text-[#FFF7E6]">
          DAD CASUAL™
        </h3>
        <p className="text-sm font-playfair italic text-sky-200">
          "Look respectable. Act questionable."
        </p>
      </div>

      {/* Grid of Dress Code Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {codeItems.map((item, idx) => (
          <div
            key={item.title}
            className="p-4 rounded-xl bg-[#172554] border border-[#253966] text-center space-y-1.5"
          >
            <div className="text-3xl mb-1">{item.emoji}</div>
            <div className="text-[10px] font-arcade text-[#38BDF8] tracking-widest">
              {item.title}
            </div>
            <div className="font-cinzel font-bold text-sm text-[#FFF7E6]">
              {item.label}
            </div>
            <p className="text-xs text-zinc-300 font-sans">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Warning Sticker */}
      <div className="mt-5 p-3 rounded-xl bg-[#F43F5E]/15 border border-[#F43F5E]/40 text-center text-xs font-space text-rose-200 flex items-center justify-center gap-2">
        <AlertCircle className="w-4 h-4 text-[#F43F5E] shrink-0" />
        <span>NOTICE: Tracksuits and flannel are acceptable. Speedos are strictly forbidden.</span>
      </div>
    </div>
  );
};
