import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Laugh, ShieldCheck, Flame, Wrench, Navigation, Tv, Beer, Tag } from 'lucide-react';
import { DAD_JOKES, DadJoke } from '../data/dadJokes';

export const DadRulesSection: React.FC = () => {
  const [jokeIndex, setJokeIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const rules = [
    {
      num: "01",
      emoji: "🍺",
      badge: "ECONOMICS",
      title: "Dad Rule #1",
      quote: "If it's on sale, I saved money.",
      subtext: "Even if we didn't need 48 cans of craft lager.",
      borderColor: "border-[#F5B942]",
      badgeBg: "bg-[#F5B942] text-neutral-950",
      glowColor: "hover:shadow-[#F5B942]/20"
    },
    {
      num: "02",
      emoji: "🧠",
      badge: "WISDOM",
      title: "Dad Rule #2",
      quote: "I don't need Google. I remember approximately how things work.",
      subtext: "And by approximately, I mean 35% accuracy with 100% confidence.",
      borderColor: "border-[#38BDF8]",
      badgeBg: "bg-[#38BDF8] text-neutral-950",
      glowColor: "hover:shadow-[#38BDF8]/20"
    },
    {
      num: "03",
      emoji: "🔧",
      badge: "HANDYMAN",
      title: "Dad Rule #3",
      quote: "I can fix it. Whether I should fix it is another question.",
      subtext: "WD-40 and duct tape solve 99% of civilization's problems.",
      borderColor: "border-[#FF8A3D]",
      badgeBg: "bg-[#FF8A3D] text-neutral-950",
      glowColor: "hover:shadow-[#FF8A3D]/20"
    },
    {
      num: "04",
      emoji: "🚗",
      badge: "NAVIGATION",
      title: "Dad Rule #4",
      quote: "The correct route is whichever route Dad chooses.",
      subtext: "GPS is just a suggestion. I know a shortcut through the industrial park.",
      borderColor: "border-[#22C55E]",
      badgeBg: "bg-[#22C55E] text-neutral-950",
      glowColor: "hover:shadow-[#22C55E]/20"
    },
    {
      num: "05",
      emoji: "📺",
      badge: "CLIMATE",
      title: "Dad Rule #5",
      quote: "Nobody touches the thermostat.",
      subtext: "Put on a cardigan or prepare to face the Supreme Court of Alan.",
      borderColor: "border-[#F43F5E]",
      badgeBg: "bg-[#F43F5E] text-neutral-950",
      glowColor: "hover:shadow-[#F43F5E]/20"
    },
    {
      num: "06",
      emoji: "💸",
      badge: "BAR POLICY",
      title: "Dad Rule #6",
      quote: "Everyone pays for themselves. Daddy is generous, not stupid.",
      subtext: "Daddy has many talents. Funding 15 adults' bar tabs is not one of them.",
      borderColor: "border-[#A855F7]",
      badgeBg: "bg-[#A855F7] text-white",
      glowColor: "hover:shadow-[#A855F7]/20"
    }
  ];

  const handleNextJoke = () => {
    setIsRotating(true);
    setTimeout(() => {
      setJokeIndex((prev) => (prev + 1) % DAD_JOKES.length);
      setIsRotating(false);
    }, 150);
  };

  const currentJoke: DadJoke = DAD_JOKES[jokeIndex];

  return (
    <section id="briefing" className="py-12 px-4 relative">
      {/* Retro background subtle dots */}
      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e293b] border-2 border-[#F5B942] text-[#F5B942] text-xs font-arcade uppercase tracking-wider sticker-badge">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE SACRED CONSTITUTION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-cinzel font-black tracking-wide text-retro-gold">
            DAD RULES™
          </h2>
          <p className="text-sm sm:text-base text-amber-200/90 font-playfair italic max-w-lg mx-auto">
            "Rules established over three decades of questionable decisions and standing with hands on hips."
          </p>
        </div>

        {/* 6 Colorful Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rules.map((rule, idx) => (
            <motion.div
              key={rule.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`relative rounded-2xl bg-[#111c35] border-2 ${rule.borderColor} p-5 shadow-xl ${rule.glowColor} transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between`}
            >
              {/* Header inside card */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-arcade px-2 py-0.5 rounded-md font-bold ${rule.badgeBg} shadow-sm`}>
                    {rule.badge}
                  </span>
                  <span className="text-2xl">{rule.emoji}</span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xs font-space font-bold uppercase tracking-widest text-zinc-400">
                    {rule.title}
                  </h3>
                  <p className="text-base sm:text-lg font-cinzel font-bold text-[#FFF7E6] leading-snug">
                    "{rule.quote}"
                  </p>
                </div>
              </div>

              {/* Subtext */}
              <div className="mt-4 pt-3 border-t border-[#1e2e54] text-xs text-amber-200/80 font-sans italic">
                {rule.subtext}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Dad Joke Dispenser Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl bg-gradient-to-r from-[#172554] via-[#1e293b] to-[#172554] border-2 border-[#38BDF8] p-5 sm:p-7 shadow-2xl text-center overflow-hidden"
        >
          {/* Top arcade badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8] text-[#38BDF8] text-xs font-arcade uppercase tracking-wider mb-3">
            <Laugh className="w-3.5 h-3.5" />
            <span>INTERACTIVE DAD JOKE DISPENSER</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={jokeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-2 max-w-xl mx-auto my-3"
            >
              <p className="text-lg sm:text-xl font-cinzel font-bold text-[#FFF7E6]">
                "{currentJoke.setup}"
              </p>
              <p className="text-base sm:text-lg font-playfair italic font-bold text-[#F5B942]">
                👉 {currentJoke.punchline}
              </p>
              <div className="text-xs font-space text-sky-300 pt-1">
                {currentJoke.reaction}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 pt-3 border-t border-[#1e2e54] flex items-center justify-center">
            <button
              onClick={handleNextJoke}
              className="px-5 py-2.5 rounded-xl bg-[#F5B942] hover:bg-[#ffc85a] text-neutral-950 font-arcade text-xs uppercase tracking-wider font-black flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
              <span>DISPENSE ANOTHER JOKE ({jokeIndex + 1}/{DAD_JOKES.length})</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
