import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Globe, Heart } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';

export const LanguageSelectionModal: React.FC = () => {
  const { showModal, setShowModal, setLang } = useLanguage();

  const handleSelect = (lang: Language) => {
    setLang(lang);
    setShowModal(false);
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0f1d]/98 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="w-full max-w-xl p-8 rounded-3xl bg-[#0d1527] border-4 border-[#F5B942] shadow-[0_0_50px_rgba(245,185,66,0.15)] text-center relative overflow-hidden"
          >
            {/* Retro grid background lines */}
            <div className="absolute inset-0 bg-retro-grid opacity-10 pointer-events-none" />

            {/* Glowing sunburst behind */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-br from-[#F5B942]/10 to-[#FF8A3D]/10 blur-3xl pointer-events-none rounded-full" />

            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#172554] border-2 border-[#F5B942] text-[#F5B942] text-[10px] font-arcade uppercase tracking-widest mb-6 relative">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>SYSTEM INITIALIZATION</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-cinzel font-black tracking-wider text-retro-gold mb-2 relative">
              ALAN IS 30+
            </h1>
            <p className="text-xs font-space text-[#38BDF8] uppercase tracking-widest mb-6 font-bold">
              Select Language / Wybierz Język
            </p>

            {/* Funny subtitle */}
            <div className="p-4 rounded-xl bg-[#111c35] border border-white/5 mb-6 text-zinc-300 space-y-2 font-sans text-xs sm:text-sm max-w-lg mx-auto text-left leading-relaxed">
              <p className="italic">
                🇵🇱 <strong>PL:</strong> Oficjalne zaproszenie, suchary i koordynaty w Krakowie.
              </p>
              <hr className="border-white/5" />
              <p className="italic">
                🇬🇧 <strong>EN:</strong> Original dad jokes, party logistics, and Krakow coordinates.
              </p>
              <hr className="border-white/5" />
              <p className="italic">
                🇧🇷 <strong>PT:</strong> Piadas de tiozão, confirmação de presença e lista de presentes.
              </p>
            </div>

            {/* Selection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto relative">
              {/* Polish Language */}
              <button
                onClick={() => handleSelect('PL')}
                className="group p-4 rounded-2xl bg-[#172554] hover:bg-[#20326e] border-2 border-[#F5B942] text-left transition-all hover:scale-102 cursor-pointer flex flex-col justify-between h-32 relative"
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-2xl">🇵🇱</span>
                  <span className="text-[9px] font-arcade px-2 py-0.5 rounded bg-[#F5B942] text-neutral-950 font-bold group-hover:animate-bounce">
                    PL
                  </span>
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-base text-white">POLSKI</h3>
                  <p className="text-[10px] text-amber-200/80 font-sans mt-0.5">
                    "Suchary i polski humor."
                  </p>
                </div>
              </button>

              {/* English Language */}
              <button
                onClick={() => handleSelect('EN')}
                className="group p-4 rounded-2xl bg-[#172554] hover:bg-[#20326e] border-2 border-[#38BDF8] text-left transition-all hover:scale-102 cursor-pointer flex flex-col justify-between h-32 relative"
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-2xl">🇬🇧</span>
                  <span className="text-[9px] font-arcade px-2 py-0.5 rounded bg-[#38BDF8] text-neutral-950 font-bold group-hover:animate-bounce">
                    EN
                  </span>
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-base text-white">ENGLISH</h3>
                  <p className="text-[10px] text-sky-200/80 font-sans mt-0.5">
                    "Classic dad jokes & info."
                  </p>
                </div>
              </button>

              {/* Portuguese Language */}
              <button
                onClick={() => handleSelect('PT')}
                className="group p-4 rounded-2xl bg-[#172554] hover:bg-[#20326e] border-2 border-[#22C55E] text-left transition-all hover:scale-102 cursor-pointer flex flex-col justify-between h-32 relative"
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-2xl">🇧🇷</span>
                  <span className="text-[9px] font-arcade px-2 py-0.5 rounded bg-[#22C55E] text-neutral-950 font-bold group-hover:animate-bounce">
                    PT
                  </span>
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-base text-white">PORTUGUÊS</h3>
                  <p className="text-[10px] text-emerald-200/80 font-sans mt-0.5">
                    "Piadas de tiozão e festa."
                  </p>
                </div>
              </button>
            </div>

            <div className="mt-8 text-[10px] text-zinc-500 font-space flex items-center justify-center gap-1">
              <span>Made with love & back-pain</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
