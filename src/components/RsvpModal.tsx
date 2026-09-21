import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Users } from 'lucide-react';
import { RsvpSection } from './RsvpSection';
import { RsvpSubmission } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'form' | 'roster';
  onRsvpSubmitted?: (rsvp: RsvpSubmission) => void;
  onOpenAdmin?: () => void;
}

export const RsvpModal: React.FC<RsvpModalProps> = ({
  isOpen,
  onClose,
  initialView = 'form',
  onRsvpSubmitted,
  onOpenAdmin
}) => {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0a0f1d]/90 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="w-full max-w-2xl max-h-[92vh] bg-[#0d1527] border-2 border-[#22C55E] rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.2)] flex flex-col overflow-hidden relative"
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-5 border-b border-[#1e2e54] bg-[#111c35] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🚀</span>
              <div>
                <h3 className="text-lg sm:text-xl font-cinzel font-black text-[#22C55E] tracking-wide">
                  {lang === 'PT' ? 'Confirmação de Presença (RSVP)' : lang === 'PL' ? 'Potwierdzenie Obecności (RSVP)' : 'RSVP Confirmation'}
                </h3>
                <p className="text-xs text-zinc-400 font-sans">
                  {lang === 'PT' ? 'Leva menos de 10 segundos!' : lang === 'PL' ? 'Zajmie mniej niż 10 sekund!' : 'Takes less than 10 seconds!'}
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

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            <RsvpSection
              isModal={true}
              initialView={initialView}
              onRsvpSubmitted={(rsvp) => {
                if (onRsvpSubmitted) onRsvpSubmitted(rsvp);
              }}
              onOpenAdmin={() => {
                onClose();
                if (onOpenAdmin) onOpenAdmin();
              }}
            />
          </div>

          {/* Modal Footer */}
          <div className="p-3 sm:p-4 border-t border-[#1e2e54] bg-[#111c35] flex items-center justify-between text-xs text-zinc-400 shrink-0">
            <span className="font-space text-[11px] text-zinc-400">
              {lang === 'PT' ? 'Sexta, 25 Set • Lindo Bar' : lang === 'PL' ? 'Piątek, 25 Wrz • Lindo Bar' : 'Fri, Sep 25 • Lindo Bar'}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#22C55E] text-neutral-950 font-arcade font-black text-xs hover:bg-[#20b857] transition-colors cursor-pointer"
            >
              {lang === 'PT' ? 'Fechar' : lang === 'PL' ? 'Zamknij' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
