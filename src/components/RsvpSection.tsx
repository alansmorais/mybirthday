import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle, AlertCircle, Loader2, Sparkles, Users, UserCheck, MessageSquare, ArrowRight, ShieldCheck, Lock, MessageCircle } from 'lucide-react';
import { RsvpStatus, RsvpSubmission, ConfirmedAttendee } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { saveRsvpToFirestore, subscribeToRsvps } from '../lib/firebase';

interface RsvpSectionProps {
  onRsvpSubmitted?: (rsvp: RsvpSubmission) => void;
  onOpenAdmin?: () => void;
  isModal?: boolean;
  initialView?: 'form' | 'roster';
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  onRsvpSubmitted,
  onOpenAdmin,
  isModal = false,
  initialView = 'form'
}) => {
  const { t, lang } = useLanguage();
  const [activeView, setActiveView] = useState<'form' | 'roster'>(initialView);
  const [status, setStatus] = useState<RsvpStatus>('YES');
  const [name, setName] = useState('');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRsvp, setSubmittedRsvp] = useState<RsvpSubmission | null>(null);

  // Confirmed attendees live telemetry
  const [confirmedList, setConfirmedList] = useState<ConfirmedAttendee[]>([]);
  const [maybeList, setMaybeList] = useState<ConfirmedAttendee[]>([]);
  const [totalHeadcount, setTotalHeadcount] = useState<number>(0);
  const [attendingCount, setAttendingCount] = useState<number>(0);
  const [rosterFilter, setRosterFilter] = useState<'YES' | 'MAYBE'>('YES');

  // Load live attendees on mount
  const fetchAttendees = async () => {
    try {
      const res = await fetch('/api/rsvps/public-stats');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.confirmedAttendees)) {
          setConfirmedList(data.confirmedAttendees);
        }
        if (Array.isArray(data.maybeAttendees)) {
          setMaybeList(data.maybeAttendees);
        }
        if (typeof data.totalHeadcount === 'number') {
          setTotalHeadcount(data.totalHeadcount);
        }
        if (typeof data.attendingCount === 'number') {
          setAttendingCount(data.attendingCount);
        }
        return;
      }
    } catch {
      // offline / static fallback
    }

    try {
      const raw = JSON.parse(localStorage.getItem('alans_rsvps') || '[]');
      const fakeIds = new Set(['rsvp-1', 'rsvp-2', 'rsvp-3', 'rsvp-4']);
      const local = raw.filter((r: any) => !fakeIds.has(r?.id) && r?.name !== 'Kasia & Mateusz' && r?.name !== 'Viktor K.' && r?.name !== 'Tomek (The Architect)' && r?.name !== 'Anna & Friends');
      if (local.length !== raw.length) {
        localStorage.setItem('alans_rsvps', JSON.stringify(local));
      }
      const yes = local.filter((r: any) => r.status === 'YES');
      const maybe = local.filter((r: any) => r.status === 'MAYBE');
      setConfirmedList(yes);
      setMaybeList(maybe);
      setAttendingCount(yes.length);
      setTotalHeadcount(yes.reduce((acc: number, curr: any) => acc + (curr.guestCount || 1), 0));
    } catch {}
  };

  useEffect(() => {
    // 1. Subscribe to real-time updates from Firebase Firestore
    let unsub = () => {};
    try {
      unsub = subscribeToRsvps((items) => {
        if (items && items.length > 0) {
          const yes = items.filter(r => r.status === 'YES');
          const maybe = items.filter(r => r.status === 'MAYBE');
          setConfirmedList(yes);
          setMaybeList(maybe);
          setAttendingCount(yes.length);
          setTotalHeadcount(yes.reduce((acc, curr) => acc + (curr.guestCount || 1), 0));
        }
      });
    } catch (e) {
      console.warn('Firestore subscription fallback:', e);
    }

    // 2. Fetch server API or local storage initial list
    fetchAttendees();

    return () => {
      unsub();
    };
  }, []);

  const getWhatsAppUrl = (rsvp: RsvpSubmission) => {
    const isPt = lang === 'PT';
    const isPl = lang === 'PL';

    let text = '';
    if (isPt) {
      const statusText = rsvp.status === 'YES' ? 'Com certeza vou! 🚀' : rsvp.status === 'MAYBE' ? 'Talvez / Tentarei 🤔' : 'Não poderei ir 😢';
      text = `🎂 *Confirmação de Presença - 30 Anos do Alan!*\n\n` +
        `👤 *Nome:* ${rsvp.name}\n` +
        `✨ *Status:* ${statusText}\n` +
        `👥 *Total de Pessoas:* ${rsvp.guestCount}\n` +
        (rsvp.message ? `💬 *Recado:* "${rsvp.message}"\n\n` : '\n') +
        `📍 Sexta, 25/09 às 19:30 no Lindo Bar Cracóvia!`;
    } else if (isPl) {
      const statusText = rsvp.status === 'YES' ? 'Będę na 100%! 🚀' : rsvp.status === 'MAYBE' ? 'Może / Dam znać 🤔' : 'Nie dam rady 😢';
      text = `🎂 *Potwierdzenie Obecności - 30. Urodziny Alana!*\n\n` +
        `👤 *Imię i nazwisko:* ${rsvp.name}\n` +
        `✨ *Status:* ${statusText}\n` +
        `👥 *Liczba osób:* ${rsvp.guestCount}\n` +
        (rsvp.message ? `💬 *Wiadomość:* "${rsvp.message}"\n\n` : '\n') +
        `📍 Piątek, 25.09, 19:30 w Lindo Bar Kraków!`;
    } else {
      const statusText = rsvp.status === 'YES' ? 'Count me in! 🚀' : rsvp.status === 'MAYBE' ? 'Tentative / Maybe 🤔' : "Can't make it 😢";
      text = `🎂 *RSVP Confirmation - Alan's 30+ Birthday!*\n\n` +
        `👤 *Name:* ${rsvp.name}\n` +
        `✨ *Status:* ${statusText}\n` +
        `👥 *Party Size:* ${rsvp.guestCount}\n` +
        (rsvp.message ? `💬 *Note:* "${rsvp.message}"\n\n` : '\n') +
        `📍 Friday, Sep 25 at 19:30 @ Lindo Bar Kraków!`;
    }

    const customPhone = typeof window !== 'undefined' ? localStorage.getItem('alans_whatsapp_phone') : null;
    if (customPhone && customPhone.trim()) {
      const cleaned = customPhone.replace(/[^0-9]/g, '');
      return `https://api.whatsapp.com/send?phone=${cleaned}&text=${encodeURIComponent(text)}`;
    }
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('errorName', 'rsvp'));
      return;
    }

    setError(null);
    setLoading(true);

    try {
      let finalRsvp: RsvpSubmission | null = null;
      try {
        const res = await fetch('/api/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status,
            name: name.trim(),
            guestCount,
            message: message.trim()
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.rsvp) {
            finalRsvp = data.rsvp;
          }
        }
      } catch {
        // Fallback to offline/static mode (e.g. GitHub Pages)
      }

      // Backup cloud notification directly to host's email (guarantees delivery on GitHub Pages/static host)
      try {
        fetch('https://formsubmit.co/ajax/alanpkmorais@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `🎉 Nova Confirmação: ${name.trim()} (${status === 'YES' ? 'Vai comparecer' : 'Talvez'})`,
            _captcha: 'false',
            name: name.trim(),
            status,
            guestCount,
            message: message.trim() || 'Nenhuma mensagem adicional',
            sourceDomain: typeof window !== 'undefined' ? window.location.hostname : 'web',
            submittedAt: new Date().toISOString()
          })
        }).catch(() => {});
      } catch {}

      if (!finalRsvp) {
        const fallbackRsvp: RsvpSubmission = {
          id: `rsvp-${Date.now()}`,
          status,
          name: name.trim(),
          guestCount,
          message: message.trim(),
          createdAt: new Date().toISOString()
        };
        try {
          const existing = JSON.parse(localStorage.getItem('alans_rsvps') || '[]');
          localStorage.setItem('alans_rsvps', JSON.stringify([...existing, fallbackRsvp]));
        } catch {}
        finalRsvp = fallbackRsvp;
      }

      // Persist directly to Cloud Firestore (Guarantees multi-device and static deployment sync)
      try {
        await saveRsvpToFirestore(finalRsvp);
      } catch (fsErr) {
        console.warn('Firestore cloud write failed, fallback engaged:', fsErr);
      }

      setSubmittedRsvp(finalRsvp);

      // Instantly update confirmed list in UI
      if (finalRsvp.status === 'YES') {
        setConfirmedList(prev => [finalRsvp!, ...prev]);
        setAttendingCount(prev => prev + 1);
        setTotalHeadcount(prev => prev + (finalRsvp!.guestCount || 1));
      } else if (finalRsvp.status === 'MAYBE') {
        setMaybeList(prev => [finalRsvp!, ...prev]);
      }

      if (onRsvpSubmitted) {
        onRsvpSubmitted(finalRsvp);
      }

      // Celebratory colorful retro confetti
      if (status === 'YES' || status === 'MAYBE') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F5B942', '#38BDF8', '#FF8A3D', '#22C55E', '#FFF7E6']
        });
      }
    } catch (err: any) {
      setError(err.message || "Error saving your RSVP response.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedRsvp(null);
    setName('');
    setMessage('');
    setGuestCount(1);
    setStatus('YES');
  };

  const displayedRoster = rosterFilter === 'YES' ? confirmedList : maybeList;

  // Helper to extract initials for attendee avatar
  const getInitials = (guestName: string) => {
    const parts = guestName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div id="rsvp" className={isModal ? 'w-full space-y-5' : 'py-12 px-4 relative scroll-mt-20'}>
      <div id="confirmed-squad" className={isModal ? 'w-full space-y-5' : 'max-w-2xl mx-auto space-y-6 scroll-mt-24'}>
        {/* Section Header (hidden in modal) */}
        {!isModal && (
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e293b] border-2 border-[#22C55E] text-[#22C55E] text-xs font-arcade uppercase tracking-wider sticker-badge">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('badge', 'rsvp')}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-cinzel font-black tracking-wide text-retro-gold">
              {t('title', 'rsvp')}
            </h2>
            <p className="text-sm sm:text-base text-amber-200/90 font-playfair italic">
              {t('subtext', 'rsvp')}
            </p>
          </div>
        )}

        {/* View Switcher Tabs: Submit vs Who's Confirmed */}
        <div className="flex items-center justify-center p-1.5 bg-[#0a1122] rounded-2xl border-2 border-[#1e2e54] max-w-md mx-auto shadow-lg">
          <button
            type="button"
            id="tab-submit-rsvp"
            onClick={() => setActiveView('form')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-arcade uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeView === 'form'
                ? 'bg-[#F5B942] text-neutral-950 font-black shadow-md scale-[1.02]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>{t('tabForm', 'rsvp')}</span>
          </button>

          <button
            type="button"
            id="tab-confirmed-squad"
            onClick={() => setActiveView('roster')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-arcade uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeView === 'roster'
                ? 'bg-[#22C55E] text-neutral-950 font-black shadow-md scale-[1.02]'
                : 'text-zinc-400 hover:text-[#22C55E]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t('tabRoster', 'rsvp')}</span>
            {totalHeadcount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeView === 'roster'
                    ? 'bg-neutral-950 text-[#22C55E]'
                    : 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40'
                }`}
              >
                {totalHeadcount}
              </span>
            )}
          </button>
        </div>

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#111c35] border-2 border-[#F5B942] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* VIEW 1: RSVP SUBMISSION FORM */}
          {activeView === 'form' && (
            <AnimatePresence mode="wait">
              {!submittedRsvp ? (
                <form onSubmit={handleSubmit} className="space-y-6" id="rsvp-form">
                  {/* 1. ARE YOU COMING? */}
                  <div>
                    <label className="block text-xs font-arcade uppercase tracking-widest text-[#F5B942] mb-3 font-bold">
                      {t('statusLabel', 'rsvp')}
                    </label>
                    <div className="space-y-2.5">
                      {/* YES */}
                      <label
                        className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                          status === 'YES'
                            ? 'bg-[#172554] border-[#F5B942] text-[#F5B942] shadow-md'
                            : 'bg-[#0d1527] border-[#1e2e54] text-zinc-300 hover:border-zinc-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🍻</span>
                          <span className="text-sm sm:text-base font-space font-bold">
                            {t('statusYes', 'rsvp')}
                          </span>
                        </div>
                        <input
                          type="radio"
                          name="rsvpStatus"
                          value="YES"
                          checked={status === 'YES'}
                          onChange={() => setStatus('YES')}
                          className="sr-only"
                        />
                      </label>

                      {/* MAYBE */}
                      <label
                        className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                          status === 'MAYBE'
                            ? 'bg-[#172554] border-[#38BDF8] text-[#38BDF8] shadow-md'
                            : 'bg-[#0d1527] border-[#1e2e54] text-zinc-300 hover:border-zinc-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🤔</span>
                          <span className="text-sm sm:text-base font-space font-bold">
                            {t('statusMaybe', 'rsvp')}
                          </span>
                        </div>
                        <input
                          type="radio"
                          name="rsvpStatus"
                          value="MAYBE"
                          checked={status === 'MAYBE'}
                          onChange={() => setStatus('MAYBE')}
                          className="sr-only"
                        />
                      </label>

                      {/* NO */}
                      <label
                        className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                          status === 'NO'
                            ? 'bg-[#172554] border-[#F43F5E] text-[#F43F5E] shadow-md'
                            : 'bg-[#0d1527] border-[#1e2e54] text-zinc-300 hover:border-zinc-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">😭</span>
                          <span className="text-sm sm:text-base font-space font-bold">
                            {t('statusNo', 'rsvp')}
                          </span>
                        </div>
                        <input
                          type="radio"
                          name="rsvpStatus"
                          value="NO"
                          checked={status === 'NO'}
                          onChange={() => setStatus('NO')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>

                  {/* 2. YOUR NAME & NUMBER OF PEOPLE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rsvp-name" className="block text-xs font-arcade uppercase tracking-wider text-[#38BDF8] mb-2 font-bold">
                        {t('nameLabel', 'rsvp')}
                      </label>
                      <input
                        id="rsvp-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('namePlaceholder', 'rsvp')}
                        className="w-full px-4 py-3 rounded-xl bg-[#0d1527] border-2 border-[#1e2e54] focus:border-[#F5B942] focus:outline-none text-sm text-[#FFF7E6] placeholder-zinc-500 font-sans"
                      />
                    </div>

                    <div>
                      <label htmlFor="rsvp-headcount" className="block text-xs font-arcade uppercase tracking-wider text-[#38BDF8] mb-2 font-bold">
                        {t('headcountLabel', 'rsvp')}
                      </label>
                      <select
                        id="rsvp-headcount"
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-[#0d1527] border-2 border-[#1e2e54] focus:border-[#F5B942] focus:outline-none text-sm text-[#FFF7E6] font-sans cursor-pointer"
                      >
                        <option value={1}>{t('headcount1', 'rsvp')}</option>
                        <option value={2}>{t('headcount2', 'rsvp')}</option>
                        <option value={3}>{t('headcount3', 'rsvp')}</option>
                        <option value={4}>{t('headcount4', 'rsvp')}</option>
                      </select>
                    </div>
                  </div>

                  {/* 3. MESSAGE OR DAD JOKE */}
                  <div>
                    <label htmlFor="rsvp-message" className="block text-xs font-arcade uppercase tracking-wider text-[#FF8A3D] mb-2 font-bold">
                      {t('messageLabel', 'rsvp')}
                    </label>
                    <textarea
                      id="rsvp-message"
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t('messagePlaceholder', 'rsvp')}
                      className="w-full px-4 py-3 rounded-xl bg-[#0d1527] border-2 border-[#1e2e54] focus:border-[#FF8A3D] focus:outline-none text-sm text-[#FFF7E6] placeholder-zinc-500 resize-none font-sans"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/20 border-2 border-red-500 text-xs text-red-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    id="submit-protocol-btn"
                    className="w-full py-4 px-6 rounded-2xl bg-[#F5B942] hover:bg-[#ffc85a] text-neutral-950 font-arcade text-xs sm:text-sm uppercase tracking-wider font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl border-2 border-neutral-950 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-neutral-950" />
                        <span>{t('submitting', 'rsvp')}</span>
                      </>
                    ) : (
                      <span>{t('submitBtn', 'rsvp')}</span>
                    )}
                  </button>

                  {/* LIVE CONFIRMED SQUAD PREVIEW TICKER */}
                  {confirmedList.length > 0 && (
                    <div className="pt-4 border-t border-[#1e2e54]/80">
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#22C55E]" />
                          <span className="text-xs font-arcade font-bold text-zinc-300 uppercase tracking-wider">
                            {t('rosterTitle', 'rsvp')} ({totalHeadcount} Attending)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveView('roster')}
                          className="text-xs font-space text-[#38BDF8] hover:text-[#7dd3fc] flex items-center gap-1 font-bold cursor-pointer transition-colors"
                        >
                          <span>{t('viewConfirmedRoster', 'rsvp')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Small avatar chips of confirmed legends */}
                      <div className="flex flex-wrap gap-2">
                        {confirmedList.slice(0, 5).map((guest, idx) => (
                          <span
                            key={guest.id || idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d1527] border border-[#22C55E]/40 text-xs font-space text-zinc-200"
                          >
                            <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                            <span className="font-semibold">{guest.name}</span>
                            {guest.guestCount > 1 && (
                              <span className="text-[10px] text-zinc-400 font-mono">+{guest.guestCount - 1}</span>
                            )}
                          </span>
                        ))}
                        {confirmedList.length > 5 && (
                          <button
                            type="button"
                            onClick={() => setActiveView('roster')}
                            className="text-xs font-mono text-[#F5B942] hover:underline self-center px-1"
                          >
                            +{confirmedList.length - 5} more
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </form>
              ) : (
                /* Confirmation Card */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#22C55E]/20 border-2 border-[#22C55E] flex items-center justify-center text-[#22C55E]">
                    <CheckCircle className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-arcade uppercase tracking-widest text-[#F5B942] font-black">
                      {t('successTitle', 'rsvp')}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-cinzel font-black text-[#FFF7E6]">
                      {submittedRsvp.name}
                    </h4>
                  </div>

                  <p className="text-sm sm:text-base text-amber-200 font-playfair italic max-w-sm mx-auto">
                    {t('successDesc', 'rsvp')}
                  </p>

                  {/* 1-TAP WHATSAPP NOTIFICATION (ZERO-ERROR INSTANT DELIVERY) */}
                  <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#22C55E]/10 border-2 border-[#22C55E]/50 text-center space-y-2.5 shadow-lg">
                    <p className="text-xs text-[#22C55E] font-space font-bold">
                      {t('notifyWhatsAppDesc', 'rsvp')}
                    </p>
                    <a
                      href={getWhatsAppUrl(submittedRsvp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#22C55E] hover:bg-[#16a34a] text-neutral-950 font-arcade text-xs font-black uppercase tracking-wider transition-all shadow-md hover:scale-[1.02] cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-neutral-950 text-neutral-950" />
                      <span>{t('notifyWhatsAppBtn', 'rsvp')}</span>
                    </a>
                    <p className="text-[10px] text-zinc-400 font-space">
                      {t('emailSentNote', 'rsvp')}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveView('roster')}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#172554] hover:bg-[#1e2e54] border border-[#22C55E]/50 text-zinc-200 font-arcade text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Users className="w-4 h-4 text-[#22C55E]" />
                      <span>{t('viewConfirmedRoster', 'rsvp')} ({totalHeadcount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0d1527] hover:bg-[#1e2e54] border border-white/10 text-xs font-space text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                    >
                      {t('successRsvpClose', 'rsvp')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* VIEW 2: CONFIRMED SQUAD ROLL CALL ROSTER */}
          {activeView === 'roster' && (
            <div className="space-y-6">
              {/* Roster Header Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e2e54]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-arcade font-black text-[#22C55E] uppercase tracking-wider">
                      {t('rosterBadge', 'rsvp')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-mono font-bold">
                      LIVE
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-cinzel font-black text-[#FFF7E6]">
                    {t('rosterTitle', 'rsvp')}
                  </h3>
                  <p className="text-xs text-amber-200/80 font-space mt-0.5">
                    {t('rosterSub', 'rsvp')}
                  </p>
                </div>

                <div className="text-left sm:text-right bg-[#0d1527] p-3 rounded-2xl border border-[#1e2e54] shrink-0">
                  <div className="text-2xl font-cinzel font-black text-[#F5B942]">
                    {totalHeadcount}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                    {attendingCount} {attendingCount === 1 ? 'Party' : 'Parties'} Confirmed
                  </div>
                </div>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRosterFilter('YES')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-space font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    rosterFilter === 'YES'
                      ? 'bg-[#22C55E] text-neutral-950 shadow-md'
                      : 'bg-[#0d1527] text-zinc-400 hover:text-zinc-200 border border-[#1e2e54]'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{t('filterAllConfirmed', 'rsvp')} ({confirmedList.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRosterFilter('MAYBE')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-space font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    rosterFilter === 'MAYBE'
                      ? 'bg-[#38BDF8] text-neutral-950 shadow-md'
                      : 'bg-[#0d1527] text-zinc-400 hover:text-zinc-200 border border-[#1e2e54]'
                  }`}
                >
                  <span>{t('filterMaybe', 'rsvp')} ({maybeList.length})</span>
                </button>
              </div>

              {/* Guest Roster List */}
              <div className="space-y-3">
                {displayedRoster.length === 0 ? (
                  <div className="py-12 text-center bg-[#0d1527] rounded-2xl border border-[#1e2e54] p-6 space-y-3">
                    <Users className="w-10 h-10 text-zinc-600 mx-auto" />
                    <p className="text-sm font-space text-zinc-400 max-w-xs mx-auto">
                      {t('noConfirmedYet', 'rsvp')}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveView('form')}
                      className="px-4 py-2 rounded-xl bg-[#F5B942] hover:bg-[#ffc85a] text-neutral-950 text-xs font-arcade font-bold uppercase tracking-wider transition-all cursor-pointer shadow"
                    >
                      {t('tabForm', 'rsvp')}
                    </button>
                  </div>
                ) : (
                  displayedRoster.map((attendee, idx) => (
                    <div
                      key={attendee.id || idx}
                      className="p-4 rounded-2xl bg-[#0d1527] border border-[#1e2e54] hover:border-[#38BDF8]/50 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-md"
                    >
                      <div className="flex items-start gap-3.5 flex-1">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F5B942] to-[#FF8A3D] text-neutral-950 font-cinzel font-black text-sm flex items-center justify-center shrink-0 shadow-inner">
                          {getInitials(attendee.name)}
                        </div>

                        {/* Guest details */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-cinzel font-bold text-base text-[#FFF7E6] tracking-wide">
                              {attendee.name}
                            </h4>

                            {rosterFilter === 'YES' ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-mono font-bold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                <span>
                                  {attendee.guestCount === 1
                                    ? t('solo', 'rsvp')
                                    : t('plusCompanions', 'rsvp')
                                        .replace('{count}', String(attendee.guestCount - 1))
                                        .replace('{total}', String(attendee.guestCount))}
                                </span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] text-[10px] font-mono font-bold">
                                {t('filterMaybe', 'rsvp')} • {attendee.guestCount}
                              </span>
                            )}
                          </div>

                          {/* Message/Dad joke quote */}
                          {attendee.message && (
                            <div className="p-2.5 rounded-xl bg-[#141e33] border border-[#233355] text-xs text-amber-100/90 font-sans italic flex items-start gap-2 max-w-xl">
                              <MessageSquare className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                              <span>"{attendee.message}"</span>
                            </div>
                          )}

                          {/* Timestamp */}
                          {attendee.createdAt && (
                            <div className="text-[10px] text-zinc-500 font-mono">
                              {new Date(attendee.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#1e2e54] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveView('form')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F5B942] hover:bg-[#ffc85a] text-neutral-950 font-arcade text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  {t('tabForm', 'rsvp')}
                </button>

                {onOpenAdmin && (
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#172554] hover:bg-[#1e2e54] border border-[#F5B942]/40 text-xs font-space text-[#F5B942] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Open host admin view"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{t('adminViewBtn', 'rsvp')}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

