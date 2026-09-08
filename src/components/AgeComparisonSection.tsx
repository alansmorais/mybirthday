import React from 'react';
import { motion } from 'motion/react';
import { Battery, Zap, Flame, Clock, Car, Coffee, ShieldAlert } from 'lucide-react';

export const AgeComparisonSection: React.FC = () => {
  const comparisons = [
    {
      category: "ENERGY METRICS",
      icon: "⚡",
      twenties: "Unlimited battery life, runs on adrenaline & fast food.",
      thirties: "Needs 2 business days of recovery after a long nap."
    },
    {
      category: "GOING OUT LOGISTICS",
      icon: "🚗",
      twenties: "Let's head out at midnight without a plan!",
      thirties: "What is the parking situation and how loud is the music?"
    },
    {
      category: "BEVERAGE TOLERANCE",
      icon: "🍺",
      twenties: "I can drink anything in any sequence.",
      thirties: "My digestive tract has mandatory terms & conditions."
    },
    {
      category: "WEEKEND GOALS",
      icon: "🛋️",
      twenties: "Dance until 4 AM.",
      thirties: "Visit Castorama, organize the garage, sleep by 21:30."
    }
  ];

  return (
    <section className="py-12 px-4 relative">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e293b] border-2 border-[#FF8A3D] text-[#FF8A3D] text-xs font-arcade uppercase tracking-wider sticker-badge">
            <Clock className="w-3.5 h-3.5" />
            <span>THE UPGRADE MATRIX</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-cinzel font-black tracking-wide text-retro-gold">
            30+
          </h2>
          <div className="space-y-1">
            <p className="text-xl sm:text-2xl font-cinzel font-bold text-[#FFF7E6]">
              "Not old. Just increasingly expensive to maintain."
            </p>
            <p className="text-xs sm:text-sm text-amber-200/80 font-playfair italic">
              A comprehensive clinical comparison between youth and true maturity.
            </p>
          </div>
        </div>

        {/* 20s vs 30+ Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {comparisons.map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="rounded-2xl bg-[#111c35] border-2 border-[#1e2e54] overflow-hidden shadow-xl hover:border-[#F5B942]/60 transition-colors"
            >
              {/* Category Header */}
              <div className="px-5 py-2.5 bg-[#172554] border-b border-[#1e2e54] flex items-center justify-between">
                <span className="text-xs font-arcade text-amber-300 tracking-wider">
                  {item.category}
                </span>
                <span className="text-lg">{item.icon}</span>
              </div>

              {/* Comparison Split */}
              <div className="p-5 grid grid-cols-2 gap-4 divide-x divide-[#1e2e54]">
                {/* 20s */}
                <div className="space-y-1 pr-2">
                  <span className="text-[10px] font-arcade px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    IN YOUR 20s
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-300 font-sans mt-2">
                    "{item.twenties}"
                  </p>
                </div>

                {/* 30+ */}
                <div className="space-y-1 pl-4">
                  <span className="text-[10px] font-arcade px-2 py-0.5 rounded bg-[#F5B942] text-neutral-950 font-bold">
                    AT 30+ (NOW)
                  </span>
                  <p className="text-xs sm:text-sm text-amber-200 font-bold font-sans mt-2">
                    "{item.thirties}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
