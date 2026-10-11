import React, { useState, useEffect } from 'react';
import {
  Gift,
  Sparkles,
  BookOpen,
  Puzzle,
  Shirt,
  Shield,
  Heart,
  Snowflake,
  Copy,
  Check,
  Info
} from 'lucide-react';
import { WishlistItem } from '../types';
import { INITIAL_WISHLIST } from '../data/initialWishlist';
import {
  subscribeToWishlistClaims,
  claimWishlistItemInFirestore,
  unclaimWishlistItemInFirestore
} from '../lib/firebase';

interface WishlistSectionProps {
  onReservationChanged?: () => void;
  isModal?: boolean;
}

export const WishlistSection: React.FC<WishlistSectionProps> = ({
  onReservationChanged,
  isModal = false
}) => {
  const [items, setItems] = useState<WishlistItem[]>(INITIAL_WISHLIST);
  const [reservingId, setReservingId] = useState<string | null>(null);
  const [myReservations, setMyReservations] = useState<Record<string, boolean>>({});
  const [copiedPix, setCopiedPix] = useState(false);

  // Chave PIX fornecida pelos organizadores exatamente como especificado
  const PIX_KEY = '34776327880';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('twins_my_reservations');
      if (saved) {
        setMyReservations(JSON.parse(saved));
      }
    } catch {}

    // Escutar reservas em tempo real no Firestore
    let unsub = () => {};
    try {
      unsub = subscribeToWishlistClaims((claims) => {
        setItems(prev => prev.map(item => {
          const isClaimed = !!claims[item.id];
          return {
            ...item,
            isReserved: isClaimed,
            reservedBy: claims[item.id]?.reservedBy || item.reservedBy
          };
        }));
      });
    } catch (e) {
      console.warn('Firestore wishlist sync fallback:', e);
    }

    return () => {
      unsub();
    };
  }, []);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleToggleReservation = async (item: WishlistItem) => {
    setReservingId(item.id);
    try {
      const nextReservedState = !item.isReserved;

      // Sincronizar com Firestore
      try {
        if (nextReservedState) {
          await claimWishlistItemInFirestore(item.id, 'Amigo da Família');
        } else {
          await unclaimWishlistItemInFirestore(item.id);
        }
      } catch (fsErr) {
        console.warn('Erro ao salvar reserva no Firestore:', fsErr);
      }

      setItems(prev =>
        prev.map(i => (i.id === item.id ? { ...i, isReserved: nextReservedState } : i))
      );

      const newMyReservations = {
        ...myReservations,
        [item.id]: nextReservedState
      };
      setMyReservations(newMyReservations);
      try {
        localStorage.setItem('twins_my_reservations', JSON.stringify(newMyReservations));
      } catch {}

      if (onReservationChanged) {
        onReservationChanged();
      }
    } catch (err) {
      console.error('Erro na reserva:', err);
    } finally {
      setReservingId(null);
    }
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Shirt':
        return <Shirt className="w-5 h-5 text-rose-500" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-sky-500" />;
      case 'Puzzle':
        return <Puzzle className="w-5 h-5 text-purple-500" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-indigo-500" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div id="wishlist" className="w-full space-y-4 text-slate-800">
      {/* Box de Destaque Especial: PIX & Inverno Chegando */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50/80 via-purple-50/60 to-sky-50/80 border border-pink-100 shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white border border-pink-100 shadow-2xs flex items-center justify-center text-[#0284C7] shrink-0">
            <Snowflake className="w-6 h-6 text-sky-500" />
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-sky-700 border border-sky-200/80 text-[11px] font-bold mb-1.5">
              <span>❄️ O Inverno está Chegando!</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Preferência: Mimos Pequenos ou PIX
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Como o espaço na mala de volta para casa é super limitado e o inverno está chegando, preferimos <strong>mimos compactos</strong> ou <strong>contribuição via PIX</strong>. Assim podemos comprar roupas térmicas, casacos e itens no tamanho certinho delas!
            </p>

            {/* Chave PIX Card com Botão de Copiar */}
            <div className="mt-4 p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-sm shrink-0">
                  💖
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                    CHAVE PIX FORNECIDA PELOS ORGANIZADORES
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-800 select-all">
                    {PIX_KEY}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyPix}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                {copiedPix ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPix ? 'Chave Copiada!' : 'Copiar Chave PIX'}</span>
              </button>
            </div>

            <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Copie a chave para colar no aplicativo do seu banco. A cópia da chave não realiza nem confirma transferências automaticamente.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sugestões de Mimos Compactos */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 mb-2.5">
          Sugestões de Mimos Fáceis de Transportar
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item) => {
            const isMyChoice = !!myReservations[item.id];
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.isReserved
                    ? 'bg-slate-50 border-slate-200 opacity-80'
                    : 'bg-white border-slate-200/90 hover:border-pink-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {renderIcon(item.iconName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-xs font-bold text-slate-800 truncate">
                        {item.title}
                      </h5>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium shrink-0">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {item.description}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-rose-600">
                        {item.price}
                      </span>

                      {!item.id.includes('pix') && (
                        <button
                          type="button"
                          onClick={() => handleToggleReservation(item)}
                          disabled={reservingId === item.id}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            item.isReserved
                              ? isMyChoice
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-400'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.isReserved ? (isMyChoice ? 'Vou levar! ✓' : 'Já escolhido') : 'Vou levar este'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
