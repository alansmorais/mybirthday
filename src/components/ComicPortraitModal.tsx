import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Heart, MessageCircle, Share2, Laugh, Star, Zap, Shield } from 'lucide-react';

interface ComicPortraitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComicPortraitModal: React.FC<ComicPortraitModalProps> = ({ isOpen, onClose }) => {
  const AVATAR_URL = 'https://avatars.githubusercontent.com/u/78435965?s=400&u=085533adc24d2ec6471affc4d4bc6ea051882a28&v=4';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-[#111c35] border-4 border-[#F5B942] rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden retro-box-shadow"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#172554] hover:bg-[#1e2e54] text-[#F5B942] border border-[#F5B942]/50 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Comic Portrait Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5B942] text-neutral-950 font-arcade text-[10px] font-black uppercase tracking-wider mb-2 sticker-badge">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLECTIBLE 1980s DAD CARD</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-cinzel font-black text-retro-gold">
              Alan Morais • The Dad
            </h3>
            <p className="text-xs text-sky-200 font-space font-medium">
              "30+ and officially licensed to explain why your lawnmower won't start"
            </p>
          </div>

          {/* Comic Card Visual */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#38BDF8] bg-[#0d1527] p-4 text-center">
            {/* Thought Bubble Simulation */}
            <div className="flex justify-end mb-2 pr-3">
              <div className="relative bg-[#FFF7E6] text-neutral-950 px-3 py-1 rounded-xl font-space font-bold text-xs shadow-lg flex items-center gap-1 border-2 border-neutral-950">
                <span>"Hi 30+, I'm Dad!" 🍺</span>
                <div className="absolute -bottom-1.5 right-3 w-2.5 h-2.5 bg-[#FFF7E6] rotate-45 border-r-2 border-b-2 border-neutral-950"></div>
              </div>
            </div>

            {/* Portrait Image with Retro Frame */}
            <div className="relative mx-auto w-48 h-48 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-4 border-[#F5B942] shadow-xl group">
              <img
                src={AVATAR_URL}
                alt="Alan Comic Portrait"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

              {/* Comic caption tag */}
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-[#F5B942] text-neutral-950 font-arcade font-black text-[10px] uppercase tracking-wider shadow">
                ★ 1ST EDITION DAD ★
              </div>
            </div>

            {/* Comic Description Card */}
            <div className="mt-4 p-3 rounded-xl bg-[#172554] border border-[#233868] text-left text-xs text-[#FFF7E6] space-y-1.5">
              <div className="flex items-center justify-between text-[#F5B942] font-arcade text-[10px]">
                <span>HP: 100% (PRE-BEER)</span>
                <span>KNEE POP: LEVEL 30+</span>
              </div>
              <p className="text-zinc-300 text-xs font-sans">
                Equipped with green crewneck sweater, friendly smile, dry sarcasm, and an uncontrollable urge to assemble the greatest crew for craft beers in Kraków.
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-5">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#F5B942] hover:bg-[#ffc85a] text-neutral-950 font-arcade text-xs uppercase tracking-wider font-black transition-all cursor-pointer shadow-lg border-2 border-neutral-950"
            >
              BACK TO PARTY INVITATION 🚀
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
