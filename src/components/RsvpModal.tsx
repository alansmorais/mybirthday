import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { RsvpSection } from './RsvpSection';
import { RsvpSubmission } from '../types';

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
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="w-full max-w-2xl max-h-[92vh] bg-white border border-pink-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative text-slate-800"
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-sky-50/60 via-pink-50/60 to-purple-50/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-pink-100 text-[#EC4899] flex items-center justify-center text-xl shrink-0">
                🐾
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Confirmação de Presença (RSVP)
                </h3>
                <p className="text-xs text-slate-500">
                  Leva menos de 10 segundos • Venha comemorar com as gêmeas Ada e Gabi!
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            <RsvpSection
              isModal={true}
              initialView={initialView}
              onRsvpSubmitted={onRsvpSubmitted}
              onOpenAdmin={onOpenAdmin}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
