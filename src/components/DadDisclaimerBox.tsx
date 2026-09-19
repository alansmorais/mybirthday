import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DadDisclaimerBox: React.FC = () => {
  const { t } = useLanguage();

  const clauses = [
    t('clause1', 'disclaimer'),
    t('clause2', 'disclaimer'),
    t('clause3', 'disclaimer'),
    t('clause4', 'disclaimer'),
    t('clause5', 'disclaimer'),
    t('clause6', 'disclaimer')
  ];

  return (
    <div className="rounded-2xl bg-[#0f172a] border-2 border-dashed border-[#F5B942]/60 p-5 sm:p-7 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 text-[#F5B942]">
        <AlertTriangle className="w-5 h-5 text-[#F5B942] shrink-0" />
        <h4 className="font-arcade text-xs sm:text-sm uppercase tracking-wider font-black">
          {t('title', 'disclaimer')}
        </h4>
      </div>

      <p className="text-xs text-amber-200/90 font-space uppercase tracking-wider font-semibold">
        {t('subtext', 'disclaimer')}
      </p>

      {/* Clauses list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {clauses.map((clause, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 font-sans">
            <span className="text-[#F5B942] font-bold mt-0.5">•</span>
            <span>{clause}</span>
          </div>
        ))}
      </div>

      {/* Footer stamp */}
      <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between text-[11px] font-space text-zinc-400">
        <span>{t('seal', 'disclaimer')}</span>
        <span className="text-[#22C55E] font-bold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>{t('verified', 'disclaimer')}</span>
        </span>
      </div>
    </div>
  );
};
