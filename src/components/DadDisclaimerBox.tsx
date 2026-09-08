import React from 'react';
import { AlertTriangle, ShieldCheck, Scale, Check } from 'lucide-react';

export const DadDisclaimerBox: React.FC = () => {
  const clauses = [
    "Dad jokes may occur spontaneously without prior verbal warning.",
    "Eye-rolling is fully permitted and legally protected under birthday bylaws.",
    "Unsolicited bad dancing and air guitar solos may be witnessed near the bar.",
    "Dad is permitted to tell the exact same story twice if nobody laughed the first time.",
    "Participation in embarrassing birthday cheers or photos is strictly voluntary (but encouraged).",
    "Nobody is legally responsible for conversational decisions made after pint #3."
  ];

  return (
    <div className="rounded-2xl bg-[#0f172a] border-2 border-dashed border-[#F5B942]/60 p-5 sm:p-7 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 text-[#F5B942]">
        <AlertTriangle className="w-5 h-5 text-[#F5B942] shrink-0" />
        <h4 className="font-arcade text-xs sm:text-sm uppercase tracking-wider font-black">
          ⚠️ OFFICIAL DAD DISCLAIMER & LEGAL WAIVER
        </h4>
      </div>

      <p className="text-xs text-amber-200/90 font-space uppercase tracking-wider font-semibold">
        By attending this 30+ birthday gathering, all guests formally acknowledge and accept:
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
        <span>SEAL OF DAD COMPLIANCE • KRAKÓW 2026</span>
        <span className="text-[#22C55E] font-bold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>STATUTE VERIFIED</span>
        </span>
      </div>
    </div>
  );
};
