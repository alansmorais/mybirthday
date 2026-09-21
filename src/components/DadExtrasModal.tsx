import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Laugh, BookOpen, Activity, Award, Scale, Shirt, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DadRulesSection } from './DadRulesSection';
import { DadStatsSection } from './DadStatsSection';
import { DadAchievementsSection } from './DadAchievementsSection';
import { AgeComparisonSection } from './AgeComparisonSection';
import { DadCasualDressCode } from './DadCasualDressCode';
import { DadDisclaimerBox } from './DadDisclaimerBox';

interface DadExtrasModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'jokes' | 'rules' | 'stats' | 'trophies' | 'comparison' | 'dress';
}

export const DadExtrasModal: React.FC<DadExtrasModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'jokes'
}) => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'jokes' | 'rules' | 'stats' | 'trophies' | 'comparison' | 'dress'>(defaultTab);

  if (!isOpen) return null;

  const tabs = [
    {
      id: 'jokes' as const,
      label: lang === 'PL' ? '😂 Suchary & Piadas' : lang === 'PT' ? '😂 Piadas & Suchary' : '😂 Dad Jokes',
      icon: Laugh
    },
    {
      id: 'rules' as const,
      label: lang === 'PL' ? '📜 Zasady Alana' : lang === 'PT' ? '📜 Regras do Alan' : '📜 Dad Rules',
      icon: BookOpen
    },
    {
      id: 'stats' as const,
      label: lang === 'PL' ? '📊 Statystyki 30+' : lang === 'PT' ? '📊 Estatísticas 30+' : '📊 30+ Stats',
      icon: Activity
    },
    {
      id: 'trophies' as const,
      label: lang === 'PL' ? '🏆 Osiągnięcia' : lang === 'PT' ? '🏆 Troféus' : '🏆 Achievements',
      icon: Award
    },
    {
      id: 'comparison' as const,
      label: lang === 'PL' ? '⚖️ 20 vs 30+' : lang === 'PT' ? '⚖️ 20s vs 30+' : '⚖️ 20s vs 30+',
      icon: Scale
    },
    {
      id: 'dress' as const,
      label: lang === 'PL' ? '👔 Dress Code' : lang === 'PT' ? '👔 Dress Code' : '👔 Dress Code',
      icon: Shirt
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0a0f1d]/90 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="w-full max-w-4xl max-h-[90vh] bg-[#0d1527] border-2 border-[#F5B942] rounded-3xl shadow-[0_0_60px_rgba(245,185,66,0.18)] flex flex-col overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#1e2e54] bg-[#111c35] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">😂</span>
              <div>
                <h3 className="text-lg sm:text-xl font-cinzel font-black text-[#F5B942] tracking-wide">
                  {lang === 'PL' ? 'Menu z Humorem & Ciekawostkami' : lang === 'PT' ? 'Menu de Piadas & Extras' : 'Dad Jokes & Extras Menu'}
                </h3>
                <p className="text-xs text-zinc-400 font-sans">
                  {lang === 'PL'
                    ? 'Wszystkie żarty, zasady, statystyki i ciekawostki o 30-tce Alana'
                    : lang === 'PT'
                    ? 'Piadas de tiozão, regras, estatísticas e curiosidades dos 30 anos'
                    : 'Dad jokes, unwritten rules, stats, and achievements in one place'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#172554] hover:bg-[#1e2e54] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Close / Zamknij / Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-menu Tabs */}
          <div className="p-2.5 bg-[#0a0f1d] border-b border-[#1e2e54] overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-space font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F5B942] text-neutral-950 shadow-md font-black scale-105'
                      : 'bg-[#172554] text-zinc-300 hover:text-[#F5B942] hover:bg-[#1e2e54]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Area */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {activeTab === 'jokes' && (
              <div className="space-y-4">
                <div className="text-center space-y-1 mb-2">
                  <span className="text-xs font-arcade px-3 py-1 rounded-full bg-[#F5B942]/20 text-[#F5B942] border border-[#F5B942]/40 uppercase tracking-wider">
                    {lang === 'PL' ? 'Dozownik Sucharów' : lang === 'PT' ? 'Gerador de Piadas' : 'Dad Joke Dispenser'}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-cinzel font-bold text-[#FFF7E6]">
                    {lang === 'PL' ? 'Skalibruj Czujnik Sucharów' : lang === 'PT' ? 'Calibre o Sensor de Piadas' : 'Eye-Roll Calibrator'}
                  </h4>
                </div>
                <DadRulesSection />
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="space-y-4">
                <DadRulesSection />
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-4">
                <DadStatsSection />
              </div>
            )}

            {activeTab === 'trophies' && (
              <div className="space-y-4">
                <DadAchievementsSection />
              </div>
            )}

            {activeTab === 'comparison' && (
              <div className="space-y-4">
                <AgeComparisonSection />
              </div>
            )}

            {activeTab === 'dress' && (
              <div className="space-y-6">
                <DadCasualDressCode />
                <DadDisclaimerBox />
              </div>
            )}
          </div>

          {/* Footer bar of modal */}
          <div className="p-3 sm:p-4 border-t border-[#1e2e54] bg-[#111c35] flex items-center justify-between text-xs text-zinc-400">
            <span className="italic font-playfair">
              {lang === 'PL' ? 'Oficjalny humor 30+ Alana' : lang === 'PT' ? 'Humor oficial dos 30+ do Alan' : "Alan's official 30+ Dad Humor"}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#F5B942] text-neutral-950 font-arcade font-black text-xs hover:bg-[#ffc85a] transition-colors"
            >
              {lang === 'PL' ? 'Wróć do Zaproszenia' : lang === 'PT' ? 'Voltar ao Convite' : 'Back to Invite'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
