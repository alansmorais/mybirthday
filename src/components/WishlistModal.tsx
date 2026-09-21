import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift } from 'lucide-react';
import { WishlistSection } from './WishlistSection';
import { useLanguage } from '../context/LanguageContext';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
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
          className="w-full max-w-3xl max-h-[92vh] bg-[#0d1527] border-2 border-[#38BDF8] rounded-3xl shadow-[0_0_50px_rgba(56,189,248,0.2)] flex flex-col overflow-hidden relative"
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-5 border-b border-[#1e2e54] bg-[#111c35] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎁</span>
              <div>
                <h3 className="text-lg sm:text-xl font-cinzel font-black text-[#38BDF8] tracking-wide">
                  {lang === 'PT' ? 'Lista de Presentes (Opcional)' : lang === 'PL' ? 'Lista Prezentów (Opcjonalna)' : 'Gift Wishlist (Optional)'}
                </h3>
                <p className="text-xs text-zinc-400 font-sans">
                  {lang === 'PT'
                    ? 'Sua presença é o melhor presente! Se quiser trazer algo, veja as sugestões:'
                    : lang === 'PL'
                    ? 'Twoja obecność to najlepszy prezent! Jeśli chcesz coś przynieść, oto pomysły:'
                    : 'Your presence is the best gift! If you wish to bring a tribute, see ideas below:'}
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
            <WishlistSection isModal={true} />
          </div>

          {/* Modal Footer */}
          <div className="p-3 sm:p-4 border-t border-[#1e2e54] bg-[#111c35] flex items-center justify-between text-xs text-zinc-400 shrink-0">
            <span className="font-space text-[11px] text-zinc-400">
              {lang === 'PT' ? 'Você pode reservar um item para evitar repetições' : lang === 'PL' ? 'Możesz zarezerwować prezent, aby się nie powtarzał' : 'You can reserve an item to prevent duplicate gifts'}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#38BDF8] text-neutral-950 font-arcade font-black text-xs hover:bg-[#32a8dd] transition-colors cursor-pointer"
            >
              {lang === 'PT' ? 'Fechar' : lang === 'PL' ? 'Zamknij' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
