import React from 'react';
import { motion } from 'motion/react';
import { Activity, Zap, TrendingUp, AlertTriangle, Cpu, BarChart3, Wrench, Heart } from 'lucide-react';

export const DadStatsSection: React.FC = () => {
  const stats = [
    {
      metric: "30+",
      label: "YEARS ALIVE",
      desc: "Mint condition with minor squeaking.",
      color: "text-[#F5B942]",
      border: "border-[#F5B942]",
      bg: "bg-[#F5B942]/10"
    },
    {
      metric: "87%",
      label: "DAD JOKES TERRIBLE",
      desc: "13% cause mild spontaneous chuckles.",
      color: "text-[#FF8A3D]",
      border: "border-[#FF8A3D]",
      bg: "bg-[#FF8A3D]/10"
    },
    {
      metric: "14",
      label: "TOOLS HE CAN'T USE",
      desc: "Purchased on impulse during a 2022 DIY phase.",
      color: "text-[#38BDF8]",
      border: "border-[#38BDF8]",
      bg: "bg-[#38BDF8]/10"
    },
    {
      metric: "∞",
      label: "UNSOLICITED ADVICE",
      desc: "Especially on route shortcuts and tire pressure.",
      color: "text-[#22C55E]",
      border: "border-[#22C55E]",
      bg: "bg-[#22C55E]/10"
    },
    {
      metric: "99%",
      label: "CONFIDENCE",
      desc: "Never in doubt about anything ever.",
      color: "text-[#F43F5E]",
      border: "border-[#F43F5E]",
      bg: "bg-[#F43F5E]/10"
    },
    {
      metric: "42%",
      label: "ACTUAL KNOWLEDGE",
      desc: "The other 58% is pure charisma and guesswork.",
      color: "text-[#A855F7]",
      border: "border-[#A855F7]",
      bg: "bg-[#A855F7]/10"
    }
  ];

  return (
    <section className="py-12 px-4 relative">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e293b] border-2 border-[#38BDF8] text-[#38BDF8] text-xs font-arcade uppercase tracking-wider sticker-badge">
            <Activity className="w-3.5 h-3.5" />
            <span>DIAGNOSTIC TELEMETRY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-cinzel font-black tracking-wide text-retro-cyan">
            DAD PERFORMANCE REPORT™
          </h2>
          <p className="text-sm sm:text-base text-sky-200/90 font-playfair italic max-w-lg mx-auto">
            "Audited by independent observers and verified by his orthopedic specialist."
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`p-5 rounded-2xl bg-[#111c35] border-2 ${item.border} ${item.bg} shadow-xl relative overflow-hidden flex flex-col justify-between hover:scale-[1.02] transition-transform`}
            >
              {/* Stat Card Top */}
              <div>
                <div className={`text-3xl sm:text-5xl font-arcade font-black ${item.metric === '∞' ? 'text-4xl sm:text-6xl' : ''} ${item.color} drop-shadow-sm`}>
                  {item.metric}
                </div>
                <div className="text-xs sm:text-sm font-space font-extrabold uppercase tracking-wider text-[#FFF7E6] mt-1">
                  {item.label}
                </div>
              </div>

              {/* Stat Card Bottom */}
              <div className="mt-4 pt-2.5 border-t border-[#1e2e54] text-[11px] sm:text-xs text-zinc-300 font-sans">
                {item.desc}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Humorous footnote sticker */}
        <div className="p-3.5 rounded-xl bg-[#172554] border border-[#38BDF8]/40 text-center text-xs font-space text-sky-200 flex flex-wrap items-center justify-center gap-2">
          <span className="font-bold text-[#F5B942]">★ CERTIFIED 100% ORGANIC DAD MATERIAL ★</span>
          <span>•</span>
          <span>Warranty expired after year 29</span>
        </div>
      </div>
    </section>
  );
};
