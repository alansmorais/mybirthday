import React from 'react';
import { Heart, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenComic: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="pt-8 pb-8 px-4 text-center border-t border-slate-100 bg-white/60 text-slate-500 relative">
      <div className="max-w-md mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 text-[#EC4899] fill-[#EC4899]" />
          <span>ADA & GABI • PATRULHA CANINA</span>
        </div>

        <p className="text-xs text-slate-500 font-sans max-w-xs mx-auto leading-relaxed">
          Local: Casa da Vó Angelina • Data e horário a combinar
        </p>

        <div className="flex items-center justify-center gap-2 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
          <span className="w-1.5 h-1.5 rounded-full bg-pink-200" />
        </div>

        {/* Link Admin */}
        <div className="pt-1 flex items-center justify-center text-xs text-slate-400">
          <button
            onClick={onOpenAdmin}
            className="hover:text-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Área dos Pais</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
