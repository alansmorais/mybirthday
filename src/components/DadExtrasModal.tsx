import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Sparkles, Snowflake, Smile } from 'lucide-react';

interface DadExtrasModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: any;
}

export const DadExtrasModal: React.FC<DadExtrasModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-pink-100 overflow-hidden max-h-[90vh] overflow-y-auto text-slate-800"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>GUIA DE AVENTURAS • ADA & GABI</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Patrulha Canina com as Gêmeas 🐾
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Dicas especiais para comemorarmos juntos esse momento!
            </p>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Box 1: O Inverno Está Chegando */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
                <Snowflake className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-sky-900 text-sm">O Inverno está Chegando! ❄️</h5>
                <p className="mt-1 text-slate-600 leading-relaxed">
                  Para quem quiser presentear as meninas, preferimos <strong>PIX</strong> ou <strong>mimos compactos</strong> (como roupinhas térmicas ou livrinhos). Isso facilita nossa viagem de volta para casa e ajuda a mantê-las bem quentinhas!
                </p>
              </div>
            </div>

            {/* Box 2: Roupa Confortável */}
            <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#EC4899] flex items-center justify-center shrink-0">
                <Smile className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-pink-900 text-sm">Dress Code: Conforto e Diversão! 🎈</h5>
                <p className="mt-1 text-slate-600 leading-relaxed">
                  Crianças e adultos podem vir com roupas bem confortáveis para brincar e se divertir bastante!
                </p>
              </div>
            </div>

            {/* Box 3: Amor em dose dupla */}
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-purple-900 text-sm">Amor em Dose Dupla 💕</h5>
                <p className="mt-1 text-slate-600 leading-relaxed">
                  O maior presente é o carinho e o abraço de cada um de vocês para a Ada e a Gabi!
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 py-3 rounded-2xl bg-gradient-to-r from-sky-600 via-pink-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all"
          >
            Voltar ao Convite 🐾
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
