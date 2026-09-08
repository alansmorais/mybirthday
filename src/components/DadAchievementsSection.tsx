import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Award, Star, CheckCircle, Flame, Moon, Tv, Hammer } from 'lucide-react';

export const DadAchievementsSection: React.FC = () => {
  const achievements = [
    {
      title: "MASTER OF DAD JOKES",
      desc: "Delivered 500+ puns without breaking eye contact or apologizing.",
      icon: "🎙️",
      tier: "LEGENDARY",
      badgeColor: "border-[#F5B942] bg-[#F5B942]/10 text-[#F5B942]"
    },
    {
      title: "PROFESSIONAL BBQ OPINION HOLDER",
      desc: "Stood near an open flame with tongs and clicked them twice for calibration.",
      icon: "🥩",
      tier: "GOLD",
      badgeColor: "border-[#FF8A3D] bg-[#FF8A3D]/10 text-[#FF8A3D]"
    },
    {
      title: "REMOTE CONTROL GUARDIAN",
      desc: "Held onto the TV clicker for 3 straight hours while 'resting eyes'.",
      icon: "📺",
      tier: "PLATINUM",
      badgeColor: "border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8]"
    },
    {
      title: "CAN FALL ASLEEP ANYWHERE",
      desc: "Asleep within 45 seconds in a moderately comfortable armchair.",
      icon: "😴",
      tier: "UNSTOPPABLE",
      badgeColor: "border-[#A855F7] bg-[#A855F7]/10 text-[#A855F7]"
    },
    {
      title: '"ASK YOUR MOTHER" EXPERT',
      desc: "Mastered the art of total bureaucratic delegation in under 2 seconds.",
      icon: "🧙‍♂️",
      tier: "GRANDMASTER",
      badgeColor: "border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]"
    },
    {
      title: "FIXED SOMETHING BY HITTING IT",
      desc: "Percussive maintenance restored functionality to an electronic device.",
      icon: "🔨",
      tier: "MYTHIC",
      badgeColor: "border-[#F43F5E] bg-[#F43F5E]/10 text-[#F43F5E]"
    },
    {
      title: 'SAID "I\'M NOT TIRED" WHILE TIRED',
      desc: "Yawned with jaw-breaking force before denying all fatigue.",
      icon: "🥱",
      tier: "MAX LEVEL",
      badgeColor: "border-[#F5B942] bg-[#F5B942]/10 text-[#F5B942]"
    },
    {
      title: "RECEIPT INSPECTOR GENERAL",
      desc: "Examined the restaurant bill as if auditing NASA's annual expenditure.",
      icon: "🧾",
      tier: "EPIC",
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
            <span>GAMER SCORE: 9,999+</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-cinzel font-black tracking-wide text-retro-gold">
            DAD ACHIEVEMENTS UNLOCKED
          </h2>
          <p className="text-sm sm:text-base text-amber-200/90 font-playfair italic max-w-lg mx-auto">
            "Rare badges earned through rigorous years of suburban excellence."
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
