import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Music,
  ShieldAlert,
  Sparkles,
  Puzzle,
  Flame,
  BookMarked,
  Gift,
  Check,
  Loader2
} from 'lucide-react';
import { WishlistItem } from '../types';
import { INITIAL_WISHLIST } from '../data/initialWishlist';
import { useLanguage } from '../context/LanguageContext';

interface WishlistSectionProps {
  onReservationChanged?: () => void;
  isModal?: boolean;
}

export const WishlistSection: React.FC<WishlistSectionProps> = ({ onReservationChanged, isModal = false }) => {
  const { t } = useLanguage();
  const [items, setItems] = useState<WishlistItem[]>(INITIAL_WISHLIST);
  const [reservingId, setReservingId] = useState<string | null>(null);
  const [myReservations, setMyReservations] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('alans_my_reservations');
      if (stored) {
        setMyReservations(JSON.parse(stored));
      }
    } catch {}

    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.warn('Using initial wishlist state');
    }
  };

  const handleToggleReservation = async (item: WishlistItem) => {
    setReservingId(item.id);
    try {
      let nextReservedState = !item.isReserved;
      let apiSuccess = false;

      try {
        const res = await fetch(`/api/wishlist/${item.id}/reserve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          nextReservedState = data.isReserved;
          apiSuccess = true;
        }
      } catch {
        // static GitHub Pages fallback
      }

      setItems(prev =>
        prev.map(i => (i.id === item.id ? { ...i, isReserved: nextReservedState } : i))
      );

      const newMyReservations = {
        ...myReservations,
        [item.id]: nextReservedState
      };
      setMyReservations(newMyReservations);
      localStorage.setItem('alans_my_reservations', JSON.stringify(newMyReservations));

      if (nextReservedState) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#F5B942', '#38BDF8', '#FF8A3D', '#22C55E']
        });
      }

      if (onReservationChanged) {
        onReservationChanged();
      }
    } catch (err) {
      console.error('Error reserving item:', err);
    } finally {
      setReservingId(null);
    }
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-[#F5B942]" />;
      case 'Music':
        return <Music className="w-5 h-5 text-[#F43F5E]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-[#38BDF8]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#22C55E]" />;
      case 'Puzzle':
        return <Puzzle className="w-5 h-5 text-[#A855F7]" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-[#FF8A3D]" />;
      case 'BookMarked':
        return <BookMarked className="w-5 h-5 text-[#38BDF8]" />;
      case 'Gift':
      default:
        return <Gift className="w-5 h-5 text-[#F5B942]" />;
    }
  };

  return (
    <div id="wishlist" className={isModal ? 'w-full space-y-4' : 'py-12 px-4 relative bg-retro-dots'}>
      <div className={isModal ? 'w-full space-y-4' : 'max-w-4xl mx-auto space-y-8'}>
        {/* Section Header (hidden in modal) */}
        {!isModal && (
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e293b] border-2 border-[#FF8A3D] text-[#FF8A3D] text-xs font-arcade uppercase tracking-wider sticker-badge">
              <Gift className="w-3.5 h-3.5" />
              <span>{t('badge', 'wishlist')}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-cinzel font-black tracking-wide text-retro-gold flex items-center justify-center gap-3">
              <span>🎁</span>
              <span>{t('title', 'wishlist')}</span>
            </h2>
            <p className="text-sm sm:text-base text-amber-200/90 font-playfair italic max-w-md mx-auto">
              {t('subtext', 'wishlist')}
            </p>
            <div className="text-[11px] font-space text-sky-300 font-semibold font-arcade tracking-wider">
              {t('anon', 'wishlist')}
            </div>
          </div>
        )}

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, index) => {
            const isReservedByMe = myReservations[item.id];
            const isCurrentlyReserved = item.isReserved;

            // Dynamically translate wishlist item properties from language pack
            const keyPrefix = item.id.replace('item-', 'item');
            const translatedTitle = t(`${keyPrefix}Title`, 'wishlist');
            const displayTitle = (translatedTitle && translatedTitle !== `${keyPrefix}Title`) ? translatedTitle : item.title;
            const translatedSub = t(`${keyPrefix}Sub`, 'wishlist');
            const displaySubtitle = (translatedSub && translatedSub !== `${keyPrefix}Sub`) ? translatedSub : item.subtitle;
            const translatedDesc = t(`${keyPrefix}Desc`, 'wishlist');
            const displayDesc = (translatedDesc && translatedDesc !== `${keyPrefix}Desc`) ? translatedDesc : item.description;
            const translatedPrice = t(`${keyPrefix}Price`, 'wishlist');
            const displayPrice = (translatedPrice && translatedPrice !== `${keyPrefix}Price`) ? translatedPrice : item.price;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  isCurrentlyReserved
                    ? 'bg-[#0d1322] border-[#1a2642] opacity-80'
                    : 'bg-[#111c35] border-[#1e2e54] hover:border-[#F5B942] shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {/* Top Item Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#172554] border border-[#233868] shrink-0">
                      {renderIcon(item.iconName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-cinzel font-bold text-sm sm:text-base text-[#FFF7E6]">
                        {displayTitle}
                      </h4>
                      <div className="text-xs font-space font-bold text-[#F5B942] mt-0.5">
                        {displayPrice}
                      </div>
                    </div>
                  </div>

                  {displaySubtitle && (
                    <p className="text-xs sm:text-sm text-amber-200/90 font-sans italic">
                      "{displaySubtitle}"
                    </p>
                  )}
                  {displayDesc && (
                    <p className="text-[11px] text-zinc-400 font-sans">
                      {displayDesc}
                    </p>
                  )}
                </div>

                {/* Bottom Status & Action */}
                <div className="pt-3 border-t border-[#1e2e54] flex items-center justify-between">
                  <span className="text-[11px] font-arcade font-bold">
                    {isCurrentlyReserved ? (
                      <span className="text-zinc-500">{t('claimed', 'wishlist')}</span>
                    ) : (
                      <span className="text-[#22C55E] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                        {t('available', 'wishlist')}
                      </span>
                    )}
                  </span>

                  <button
                    onClick={() => handleToggleReservation(item)}
                    disabled={reservingId === item.id || (isCurrentlyReserved && !isReservedByMe)}
                    className={`px-4 py-2 rounded-xl text-xs font-arcade tracking-wider transition-all cursor-pointer disabled:cursor-not-allowed ${
                      isReservedByMe
                        ? 'bg-[#F5B942]/20 text-[#F5B942] border-2 border-[#F5B942] hover:bg-[#F5B942]/30'
                        : isCurrentlyReserved
                        ? 'bg-[#151e33] text-zinc-600 border border-zinc-800'
                        : 'bg-[#F5B942] hover:bg-[#ffc85a] text-neutral-950 font-black border-2 border-neutral-950 shadow-md hover:scale-105'
                    }`}
                  >
                    {reservingId === item.id ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{t('updating', 'wishlist')}</span>
                      </span>
                    ) : isReservedByMe ? (
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#F5B942]" />
                        <span>{t('yourClaim', 'wishlist')}</span>
                      </span>
                    ) : isCurrentlyReserved ? (
                      <span>{t('alreadyClaimed', 'wishlist')}</span>
                    ) : (
                      <span>{t('reserveBtn', 'wishlist')}</span>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
