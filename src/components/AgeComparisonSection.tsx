import React from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AgeComparisonSection: React.FC = () => {
  const { t } = useLanguage();

  const comparisons = [
    {
      category: t('row1Label', 'comparison'),
      icon: "🩹",
      twenties: t('row1Val20s', 'comparison'),
      thirties: t('row1Val30s', 'comparison')
    },
    {
      category: t('row2Label', 'comparison'),
      icon: "📅",
      twenties: t('row2Val20s', 'comparison'),
      thirties: t('row2Val30s', 'comparison')
    },
    {
      category: t('row3Label', 'comparison'),
      icon: "🦴",
      twenties: t('row3Val20s', 'comparison'),
      thirties: t('row3Val30s', 'comparison')
    },
    {
      category: t('row4Label', 'comparison'),
      icon: "🔊",
      twenties: t('row4Val20s', 'comparison'),
      thirties: t('row4Val30s', 'comparison')
    },
    {
      category: t('row5Label', 'comparison'),
      icon: "🍷",
      twenties: t('row5Val20s', 'comparison'),
      thirties: t('row5Val30s', 'comparison')
    }
  ];

  return (
    <section className="py-12 px-4 relative">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e293b] border-2 border-[#FF8A3D] text-[#FF8A3D] text-xs font-arcade uppercase tracking-wider sticker-badge">
            <Clock className="w-3.5 h-3.5" />
            <span>{t('badge', 'comparison')}</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-cinzel font-black tracking-wide text-retro-gold">
            30+
          </h2>
          <div className="space-y-1">
            <p className="text-xl sm:text-2xl font-cinzel font-bold text-[#FFF7E6]">
              "{t('title', 'comparison')}"
            </p>
            <p className="text-xs sm:text-sm text-amber-200/80 font-playfair italic">
              {t('subtext', 'comparison')}
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
                    {t('col20s', 'comparison')}
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-300 font-sans mt-2">
                    "{item.twenties}"
                  </p>
                </div>

                {/* 30+ */}
                <div className="space-y-1 pl-4">
                  <span className="text-[10px] font-arcade px-2 py-0.5 rounded bg-[#F5B942] text-neutral-950 font-bold">
                    {t('col30s', 'comparison')}
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
