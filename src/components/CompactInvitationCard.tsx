import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Check,
  Compass,
  Gift,
  CheckCircle2,
  Users,
  Laugh,
  Wallet,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CompactInvitationCardProps {
  onOpenRsvp: (initialView?: 'form' | 'roster') => void;
  onOpenWishlist: () => void;
  onOpenExtras: () => void;
  onOpenComic: () => void;
}

export const CompactInvitationCard: React.FC<CompactInvitationCardProps> = ({
  onOpenRsvp,
  onOpenWishlist,
  onOpenExtras,
  onOpenComic
}) => {
  const { lang, t } = useLanguage();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [publicStats, setPublicStats] = useState<{
    totalHeadcount: number;
    attendingCount: number;
    confirmedAttendees: { name: string; guestCount: number }[];
  } | null>(null);

  const AVATAR_URL = 'https://avatars.githubusercontent.com/u/78435965?s=400&u=085533adc24d2ec6471affc4d4bc6ea051882a28&v=4';

  useEffect(() => {
    fetch('/api/rsvps/public-stats')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (data && typeof data.totalHeadcount === 'number') {
          setPublicStats(data);
        }
      })
      .catch(() => {
        // Fallback to local storage if API is not yet loaded (purging any legacy mock RSVPs)
        try {
          const raw = JSON.parse(localStorage.getItem('alans_rsvps') || '[]');
          const fakeIds = new Set(['rsvp-1', 'rsvp-2', 'rsvp-3', 'rsvp-4']);
          const local = raw.filter((r: any) => !fakeIds.has(r?.id) && r?.name !== 'Kasia & Mateusz' && r?.name !== 'Viktor K.' && r?.name !== 'Tomek (The Architect)' && r?.name !== 'Anna & Friends');
          if (local.length !== raw.length) {
            localStorage.setItem('alans_rsvps', JSON.stringify(local));
          }
          const yes = local.filter((r: any) => r.status === 'YES');
          setPublicStats({
            totalHeadcount: yes.reduce((acc: number, cur: any) => acc + (cur.guestCount || 1), 0),
            attendingCount: yes.length,
            confirmedAttendees: yes
          });
        } catch {}
      });
  }, []);

  const handleCopyLocation = () => {
    navigator.clipboard.writeText('Lindo Bar, Sławkowska 23, 31-014 Kraków, Poland');
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleAddToCalendar = () => {
    const startTime = '20260925T173000Z'; // 19:30 CEST on Sep 25 is 17:30 UTC
    const endTime = '20260925T233000Z';
    const title = encodeURIComponent("Alan's 30+ Birthday Party");
    const details = encodeURIComponent("Alan's 30+ Birthday Party in Kraków! Craft beers, good food, laughs, and zero adult responsibilities.");
    const location = encodeURIComponent("Lindo Bar - Sławkowska 23 - Kraków");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenMaps = () => {
    window.open('https://maps.google.com/?q=Lindo+Bar+Slawkowska+23+Krakow', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      {/* Main VIP Invitation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#0f172a] border-2 sm:border-3 border-[#F5B942] rounded-3xl p-5 sm:p-8 shadow-[0_0_50px_rgba(245,185,66,0.15)] relative overflow-hidden"
      >
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#F5B942]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Badge */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-arcade text-[#F5B942] font-black uppercase tracking-wider">
              {lang === 'PT'
                ? '★ CONVITE OFICIAL • 30 ANOS DO ALAN ★'
                : lang === 'PL'
                ? '★ OFICJALNE ZAPROSZENIE • 30. URODZINY ALANA ★'
                : "★ OFFICIAL INVITATION • ALAN'S 30+ BIRTHDAY ★"}
            </span>
          </div>

          <button
            onClick={onOpenComic}
            className="text-[10px] font-space font-bold px-2.5 py-1 rounded-full bg-[#172554] hover:bg-[#1e2e54] text-amber-300 border border-amber-400/30 flex items-center gap-1 transition-all cursor-pointer"
            title="Ver Retrato do Alan"
          >
            <Sparkles className="w-3 h-3 text-[#F5B942]" />
            <span className="hidden xs:inline">{t('comicPortrait', 'nav')}</span>
          </button>
        </div>

        {/* Hero Title & Host Avatar */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-7 text-center sm:text-left">
          {/* Avatar */}
          <button
            onClick={onOpenComic}
            className="relative group cursor-pointer shrink-0"
            title="Clique para ver o retrato do Alan"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#F5B942] shadow-xl group-hover:scale-105 transition-all">
              <img
                src={AVATAR_URL}
                alt="Alan"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-[#F5B942] text-neutral-950 font-arcade text-[9px] font-black uppercase shadow-md">
              30+
            </span>
          </button>

          {/* Titles */}
          <div className="space-y-1.5 flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-black tracking-wide text-retro-gold">
              {lang === 'PT' ? 'ALAN FAZ 30+' : lang === 'PL' ? 'ALAN KOŃCZY 30 LAT' : 'ALAN IS 30+'}
            </h1>
            <p className="text-xs sm:text-sm font-space font-bold text-sky-200 tracking-wider">
              {lang === 'PT'
                ? 'CHOPP ARTESANAL • BOA COMIDA • PIADAS RUINS'
                : lang === 'PL'
                ? 'PIWO RZEMIEŚLNICZE • DOBRE JEDZENIE • SUCHARKI'
                : 'CRAFT BEER • GOOD FOOD • TERRIBLE DAD JOKES'}
            </p>
            <p className="text-xs text-amber-100/80 font-playfair italic max-w-lg">
              {lang === 'PT'
                ? '"Venha brindar e comemorar comigo sem discursos chatos nem formalidades."'
                : lang === 'PL'
                ? '"Wpadnij na piwo, pogaduchy i zero sztywności."'
                : '"Join us for pints, laughs, and zero adult responsibilities in Kraków."'}
            </p>
          </div>
        </div>

        {/* The 2 Core Logistics Cards: Dia/Hora & Local (Tudo o que o convidado precisa) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {/* Card 1: DIA & HORA */}
          <div className="p-4 rounded-2xl bg-[#111c35] border border-[#F5B942]/60 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-arcade px-2 py-0.5 rounded bg-[#F5B942] text-neutral-950 font-black">
                {lang === 'PT' ? 'DIA & HORA' : lang === 'PL' ? 'DATA & CZAS' : 'DAY & TIME'}
              </span>
              <Clock className="w-4 h-4 text-[#F5B942]" />
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-cinzel font-bold text-white">
                {lang === 'PT'
                  ? 'Sexta-feira, 25 de Setembro de 2026'
                  : lang === 'PL'
                  ? 'Piątek, 25 września 2026'
                  : 'Friday, 25 September 2026'}
              </h3>
              <p className="text-sm font-space font-black text-[#F5B942] mt-0.5">
                19:30 CEST
              </p>
            </div>

            <button
              onClick={handleAddToCalendar}
              className="w-full py-2 px-3 rounded-xl bg-[#172554] hover:bg-[#1e2e54] border border-[#F5B942]/40 text-[#F5B942] text-[11px] font-arcade flex items-center justify-center gap-1.5 transition-all cursor-pointer font-bold"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('whenBtn', 'logistics')}</span>
            </button>
          </div>

          {/* Card 2: LOCAL */}
          <div className="p-4 rounded-2xl bg-[#111c35] border border-[#38BDF8]/60 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-arcade px-2 py-0.5 rounded bg-[#38BDF8] text-neutral-950 font-black">
                {lang === 'PT' ? 'LOCALIZAÇÃO' : lang === 'PL' ? 'MIEJSCE' : 'LOCATION'}
              </span>
              <MapPin className="w-4 h-4 text-[#38BDF8]" />
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-cinzel font-bold text-white">
                Lindo Bar Kraków
              </h3>
              <p className="text-xs font-space text-sky-200 mt-0.5">
                Sławkowska 23, 31-014 Kraków
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyLocation}
                className="py-2 px-2 rounded-xl bg-[#172554] hover:bg-[#1e2e54] border border-[#38BDF8]/40 text-[#38BDF8] text-[10px] font-arcade flex items-center justify-center gap-1 transition-all cursor-pointer font-bold"
              >
                {copiedAddress ? <Check className="w-3 h-3 text-emerald-400" /> : <Compass className="w-3 h-3" />}
                <span>{copiedAddress ? (lang === 'PT' ? 'COPIADO!' : 'COPIED!') : (lang === 'PT' ? 'COPIAR PIN' : 'COPY PIN')}</span>
              </button>
              <button
                onClick={handleOpenMaps}
                className="py-2 px-2 rounded-xl bg-[#172554] hover:bg-[#1e2e54] border border-[#38BDF8]/40 text-[#38BDF8] text-[10px] font-arcade flex items-center justify-center gap-1 transition-all cursor-pointer font-bold"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Google Maps</span>
              </button>
            </div>
          </div>
        </div>

        {/* Consumo no bar notice */}
        <div className="p-3.5 rounded-xl bg-[#111c35]/80 border border-white/5 mb-6 flex items-center gap-3 text-xs text-zinc-300">
          <div className="p-2 rounded-lg bg-[#22C55E]/15 text-[#22C55E] shrink-0">
            <Wallet className="w-4 h-4" />
          </div>
          <p className="font-sans leading-snug">
            {lang === 'PT'
              ? 'Comanda individual: cada convidado pede e paga o seu consumo diretamente no balcão do bar (Cartão, BLIK ou Dinheiro).'
              : lang === 'PL'
              ? 'Płatność przy barze: każdy zamawia i płaci za swoje napoje i jedzenie indywidualnie przy kasie (Karta, BLIK, Gotówka).'
              : 'Individual bar tab: each guest orders and pays for their own drinks/food directly at the bar counter.'}
          </p>
        </div>

        {/* PRIMARY ACTION BUTTONS (Opening in Modals!) */}
        <div className="space-y-3 pt-1">
          {/* 1. CONFIRMAR PRESENÇA (RSVP) */}
          <button
            onClick={() => onOpenRsvp('form')}
            className="w-full p-4 rounded-2xl bg-[#F5B942] hover:bg-[#ffc85a] text-neutral-950 font-arcade text-sm uppercase tracking-wider font-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-between shadow-xl cursor-pointer border-2 border-neutral-950"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🚀</span>
              <div className="text-left">
                <div className="font-black text-xs sm:text-sm">
                  {lang === 'PT' ? '1. CONFIRMAR PRESENÇA (RSVP)' : lang === 'PL' ? '1. POTWIERDŹ OBECNOŚĆ (RSVP)' : '1. CONFIRM RSVP'}
                </div>
                <div className="text-[10px] font-sans font-medium text-neutral-800">
                  {lang === 'PT' ? 'Clique para confirmar se você vai em 10 seg' : lang === 'PL' ? 'Kliknij, aby zgłosić obecność w 10 sekund' : 'Takes less than 10 seconds'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-xs bg-neutral-950 text-[#F5B942] px-3 py-1.5 rounded-xl">
              <span>{lang === 'PT' ? 'CONFIRMAR' : lang === 'PL' ? 'ZGŁOŚ' : 'RSVP'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 2. LISTA DE PRESENTES */}
          <button
            onClick={onOpenWishlist}
            className="w-full p-4 rounded-2xl bg-[#172554] hover:bg-[#1e2e54] text-[#38BDF8] hover:text-white font-arcade text-sm uppercase tracking-wider font-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-between shadow-lg cursor-pointer border-2 border-[#38BDF8]"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🎁</span>
              <div className="text-left">
                <div className="font-black text-xs sm:text-sm text-white">
                  {lang === 'PT' ? '2. LISTA DE PRESENTES A ESCOLHER' : lang === 'PL' ? '2. LISTA PREZENTÓW DO WYBORU' : '2. GIFT WISHLIST TO CHOOSE'}
                </div>
                <div className="text-[10px] font-sans font-medium text-sky-200/80">
                  {lang === 'PT' ? 'Sugestões opcionais com reserva para não repetir' : lang === 'PL' ? 'Opcjonalne pomysły z możliwością rezerwacji' : 'Optional gift ideas with reservation'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-xs bg-[#38BDF8] text-neutral-950 px-3 py-1.5 rounded-xl">
              <span>{lang === 'PT' ? 'VER LISTA' : lang === 'PL' ? 'ZOBACZ' : 'VIEW'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 3. MENU DE PIADAS & EXTRAS */}
          <button
            onClick={onOpenExtras}
            className="w-full p-3.5 rounded-2xl bg-[#111c35] hover:bg-[#172554] text-[#F5B942] font-arcade text-xs uppercase tracking-wider font-bold hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-between cursor-pointer border border-[#F5B942]/40"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">😂</span>
              <div className="text-left">
                <span className="text-xs text-amber-300 font-bold">
                  {lang === 'PT' ? '3. MENU: PIADAS, REGRAS & DRESS CODE' : lang === 'PL' ? '3. MENU: SUCHARKI, ZASADY & DRESS CODE' : '3. MENU: DAD JOKES, RULES & DRESS CODE'}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-space text-zinc-400">
              {lang === 'PT' ? 'Abrir menu →' : lang === 'PL' ? 'Otwórz menu →' : 'Open menu →'}
            </span>
          </button>
        </div>

        {/* Confirmed Roll Call Quick Bar */}
        {publicStats && publicStats.totalHeadcount > 0 && (
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span className="font-space font-bold text-[#22C55E]">
                {publicStats.totalHeadcount} {lang === 'PT' ? 'pessoas já confirmaram presença' : lang === 'PL' ? 'osób już potwierdziło obecność' : 'guests confirmed'}
              </span>
            </div>

            <button
              onClick={() => onOpenRsvp('roster')}
              className="text-amber-300 hover:text-amber-200 font-space font-bold text-xs underline cursor-pointer"
            >
              {lang === 'PT' ? 'Ver lista de confirmados →' : lang === 'PL' ? 'Zobacz listę obecności →' : 'View confirmed guest list →'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
