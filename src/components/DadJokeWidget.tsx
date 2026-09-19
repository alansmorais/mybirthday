import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Laugh } from 'lucide-react';
import { DAD_JOKES_PL, DAD_JOKES_EN, DadJoke } from '../data/dadJokes';
import { useLanguage } from '../context/LanguageContext';

export const DadJokeWidget: React.FC = () => {
  const { lang, t } = useLanguage();
  const [jokeIndex, setJokeIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const jokeList = lang === 'PL' ? DAD_JOKES_PL : DAD_JOKES_EN;
  const currentJoke: DadJoke = jokeList[jokeIndex] || jokeList[0];

  const handleNextJoke = () => {
    setIsRotating(true);
    setTimeout(() => {
      setJokeIndex((prev) => (prev + 1) % jokeList.length);
      setIsRotating(false);
    }, 150);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#13151d] border border-amber-500/30 p-5 sm:p-6 shadow-xl text-center">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-semibold uppercase tracking-wider mb-3">
        <Laugh className="w-3.5 h-3.5 text-amber-400" />
        <span>{t('jokeDispenser', 'rules')}</span>
      </div>

      {/* Joke Display Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={jokeIndex + '_' + lang}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="space-y-2.5 my-2"
        >
          <p className="text-base sm:text-lg font-cinzel font-bold text-zinc-100">
            "{currentJoke.setup}"
          </p>
          <p className="text-sm sm:text-base font-playfair italic text-amber-300">
            👉 {currentJoke.punchline}
          </p>
          <div className="text-xs text-zinc-400 font-mono pt-1">
            {currentJoke.reaction}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action Button */}
      <div className="mt-4 pt-3 border-t border-[#232736] flex items-center justify-center gap-3">
        <button
          onClick={handleNextJoke}
          className="px-4 py-2 rounded-xl bg-[#1c202d] hover:bg-[#262c3e] border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          <span>{t('nextJoke', 'rules')} ({jokeIndex + 1}/{jokeList.length})</span>
        </button>
      </div>
    </div>
  );
};
