import React from 'react';
import { motion } from 'motion/react';
import { Beer, Thermometer, Footprints, ShieldAlert, Sparkles } from 'lucide-react';
import { DadJokeWidget } from './DadJokeWidget';

export const ExecutiveBriefing: React.FC = () => {
  const rules = [
    {
      icon: <Thermometer className="w-4 h-4 text-amber-400" />,
      title: "Rule #1: Thermostat Protocol",
      desc: "Do not touch the temperature controls. Put on a cardigan if you're cold."
    },
    {
      icon: <Beer className="w-4 h-4 text-amber-400" />,
      title: "Rule #2: The 3-Beer Maximum Lie",
      desc: "I will say 'just having one or two beers' before explaining a 45-minute niche Wikipedia article."
    },
    {
      icon: <Footprints className="w-4 h-4 text-amber-400" />,
      title: "Rule #3: Dad Posture",
      desc: "If I sit down and say 'Ahhhhh', you are legally obligated to let me rest my eyes."
    }
  ];

  return (
    <section id="briefing" className="py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Dad Joke Generator Widget */}
        <DadJokeWidget />

        {/* Short & Punchy Birthday Rules */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-[#111319] border border-[#262a36] rounded-2xl p-5 sm:p-7 shadow-xl"
        >
          {/* Section subtitle */}
          <div className="text-center mb-5">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400 font-semibold">
              — DAD BIRTHDAY PROTOCOLS —
            </span>
            <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-zinc-100 mt-1">
              Alan's Official Party Guidelines
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {rules.map((rule, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#151822] border border-[#242837] space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    {rule.icon}
                  </div>
                  <h4 className="font-cinzel font-bold text-xs text-amber-300">
                    {rule.title}
                  </h4>
                </div>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick quote */}
          <div className="mt-5 pt-4 border-t border-[#222632] text-center">
            <p className="text-xs sm:text-sm text-zinc-300 font-playfair italic">
              "Dress code: Normal human clothing. Cargo shorts and New Balance sneakers optional."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
