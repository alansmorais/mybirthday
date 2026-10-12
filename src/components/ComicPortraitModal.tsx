import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Camera } from 'lucide-react';
import { subscribeToTwinsPhotos } from '../lib/firebase';

interface ComicPortraitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComicPortraitModal: React.FC<ComicPortraitModalProps> = ({ isOpen, onClose }) => {
  const [photoAda, setPhotoAda] = useState<string | null>(null);
  const [photoGabi, setPhotoGabi] = useState<string | null>(null);

  useEffect(() => {
    try {
      setPhotoAda(localStorage.getItem('twin_photo_ada'));
      setPhotoGabi(localStorage.getItem('twin_photo_gabi'));
    } catch {}

    const unsub = subscribeToTwinsPhotos((data) => {
      if (data) {
        if (data.photoAda !== undefined) setPhotoAda(data.photoAda);
        if (data.photoGabi !== undefined) setPhotoGabi(data.photoGabi);
      }
    });

    return () => unsub();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 overflow-hidden text-slate-800"
        >
          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Cabeçalho */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 text-[#EC4899] fill-[#EC4899]" />
              <span>NOSSAS ANIVERSARIANTES</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Ada & Gabi 🐾
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tema: Patrulha Canina
            </p>
          </div>

          {/* Fotos das Gêmeas */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Ada */}
            <div className="flex flex-col items-center bg-slate-50 rounded-2xl p-2.5 border border-rose-100 text-center">
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center relative">
                {photoAda ? (
                  <img src={photoAda} alt="Ada" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center">
                    <Camera className="w-6 h-6 text-rose-300 mb-1" />
                    <span className="text-[10px] font-bold text-slate-500">Ada</span>
                  </div>
                )}
              </div>
              <span className="text-xs font-bold text-slate-800 mt-2">ADA</span>
            </div>

            {/* Gabi */}
            <div className="flex flex-col items-center bg-slate-50 rounded-2xl p-2.5 border border-sky-100 text-center">
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center relative">
                {photoGabi ? (
                  <img src={photoGabi} alt="Gabi" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center">
                    <Camera className="w-6 h-6 text-sky-300 mb-1" />
                    <span className="text-[10px] font-bold text-slate-500">Gabi</span>
                  </div>
                )}
              </div>
              <span className="text-xs font-bold text-slate-800 mt-2">GABI</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-600">
            <p>🐾 Muito amor, brincadeiras e alegria em dose dupla!</p>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
          >
            Voltar ao Convite
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
