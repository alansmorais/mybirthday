import React from 'react';
import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DadAchievementsSection: React.FC = () => {
  const { t } = useLanguage();

  const achievements = [
    {
      title: t('ach1Title', 'achievements'),
      desc: t('ach1Desc', 'achievements'),
      icon: "🎙️",
      tier: t('ach1Tier', 'achievements'),
      badgeColor: "border-[#F5B942] bg-[#F5B942]/10 text-[#F5B942]"
    },
    {
      title: t('ach2Title', 'achievements'),
      desc: t('ach2Desc', 'achievements'),
      icon: "🥩",
      tier: t('ach2Tier', 'achievements'),
      badgeColor: "border-[#FF8A3D] bg-[#FF8A3D]/10 text-[#FF8A3D]"
    },
    {
      title: t('ach3Title', 'achievements'),
      desc: t('ach3Desc', 'achievements'),
      icon: "📺",
      tier: t('ach3Tier', 'achievements'),
      badgeColor: "border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8]"
    },
    {
      title: t('ach4Title', 'achievements'),
      desc: t('ach4Desc', 'achievements'),
      icon: "😴",
      tier: t('ach4Tier', 'achievements'),
      badgeColor: "border-[#A855F7] bg-[#A855F7]/10 text-[#A855F7]"
    },
    {
      title: t('ach5Title', 'achievements'),
      desc: t('ach5Desc', 'achievements'),
      icon: "🧙‍♂️",
      tier: t('ach5Tier', 'achievements'),
      badgeColor: "border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]"
    },
    {
      title: t('ach6Title', 'achievements'),
      desc: t('ach6Desc', 'achievements'),
      icon: "🔨",
      tier: t('ach6Tier', 'achievements'),
      badgeColor: "border-[#F43F5E] bg-[#F43F5E]/10 text-[#F43F5E]"
    },
    {
      title: t('ach7Title', 'achievements'),
      desc: t('ach7Desc', 'achievements'),
      icon: "🥱",
      tier: t('ach7Tier', 'achievements'),
      badgeColor: "border-[#F5B942] bg-[#F5B942]/10 text-[#F5B942]"
    },
    {
      title: t('ach8Title', 'achievements'),
      desc: t('ach8Desc', 'achievements'),
      icon: "🧾",
      tier: t('ach8Tier', 'achievements'),
      badgeColor: "border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8]"
    }
  ];

  return (
    <section className="py-12 px-4 relative">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e293b] border-2 border-[#22C55E] text-[#22C55E] text-xs font-arcade uppercase tracking-wider sticker-badge">
            <Trophy className="w-3.5 h-3.5" />
            <span>{t('badge', 'achievements')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-cinzel font-black tracking-wide text-retro-gold">
            {t('title', 'achievements')}
          </h2>
          <p className="text-sm sm:text-base text-amber-200/90 font-playfair italic max-w-lg mx-auto">
            {t('subtext', 'achievements')}
          </p>
        </div>

        {/* 8 Achievement Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className={`p-4 rounded-2xl bg-[#111c35] border-2 ${item.badgeColor.split(' ')[0]} shadow-lg flex flex-col justify-between hover:-translate-y-1 transition-all`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[9px] font-arcade px-2 py-0.5 rounded bg-black/40 text-amber-300 font-bold">
                    {item.tier}
                  </span>
                </div>

                <h3 className="font-cinzel font-bold text-xs sm:text-sm text-[#FFF7E6] leading-tight mb-1.5">
                  {item.title}
                </h3>
              </div>

              <p className="text-[11px] text-zinc-300 font-sans mt-2 pt-2 border-t border-[#1e2e54]">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
