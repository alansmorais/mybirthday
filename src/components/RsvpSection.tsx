import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle, AlertCircle, Loader2, Users, MessageCircle, Heart } from 'lucide-react';
import { RsvpStatus, RsvpSubmission, ConfirmedAttendee } from '../types';
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
  const [activeView, setActiveView] = useState<'form' | 'roster'>(initialView);
  const [status, setStatus] = useState<RsvpStatus>('YES');
  const [name, setName] = useState('');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRsvp, setSubmittedRsvp] = useState<RsvpSubmission | null>(null);
  const [saveSuccessVerified, setSaveSuccessVerified] = useState<boolean>(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const [confirmedList, setConfirmedList] = useState<ConfirmedAttendee[]>([]);
  const [maybeList, setMaybeList] = useState<ConfirmedAttendee[]>([]);
  const [totalHeadcount, setTotalHeadcount] = useState<number>(0);
  const [rosterFilter, setRosterFilter] = useState<'YES' | 'MAYBE'>('YES');

  useEffect(() => {
    // Inscrição em tempo real no Firestore para contagem verificada
    let unsub = () => {};
    try {
      unsub = subscribeToRsvps((items) => {
        if (items && items.length > 0) {
          const yes = items.filter(r => r.status === 'YES');
          const maybe = items.filter(r => r.status === 'MAYBE');
          setConfirmedList(yes);
          setMaybeList(maybe);
          setTotalHeadcount(yes.reduce((acc, curr) => acc + (curr.guestCount || 1), 0));
        } else {
          setConfirmedList([]);
          setMaybeList([]);
          setTotalHeadcount(0);
        }
      });
    } catch (e) {
      console.warn('Firestore subscription fallback:', e);
    }

    return () => {
      unsub();
    };
  }, []);

  const getWhatsAppUrl = (rsvp: RsvpSubmission) => {
    const statusText = rsvp.status === 'YES' ? 'Sim! Estaremos lá 🐾' : rsvp.status === 'MAYBE' ? 'Talvez 🤔' : 'Não poderei ir 😢';
    const text = `🎂 *Confirmação de Presença - Aniversário das Gêmeas Ada e Gabi! (Patrulha Canina)*\n\n` +
      `👤 *Família / Convidado:* ${rsvp.name}\n` +
      `✨ *Status:* ${statusText}\n` +
      `👥 *Total de Pessoas:* ${rsvp.guestCount}\n` +
      (rsvp.message ? `💬 *Mensagem para as aniversariantes:* "${rsvp.message}"\n\n` : '\n') +
      `📍 *Local:* Casa da Vó Angelina\n` +
      `📅 *Data:* A combinar\n` +
      `⏰ *Horário:* A combinar`;

    const customPhone = typeof window !== 'undefined' ? localStorage.getItem('twins_whatsapp_phone') : null;
    if (customPhone && customPhone.trim()) {
      const cleaned = customPhone.replace(/[^0-9]/g, '');
      return `https://api.whatsapp.com/send?phone=${cleaned}&text=${encodeURIComponent(text)}`;
    }
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe seu nome ou o de sua família.');
      return;
    }

    setLoading(true);
    setError(null);
    setSaveErrorMessage(null);

    const submissionData: RsvpSubmission = {
      id: `rsvp-${Date.now()}`,
      name: name.trim(),
      status,
      guestCount: Number(guestCount) || 1,
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Tentar salvar no Firestore (banco de dados real)
      await saveRsvpToFirestore(submissionData);
      
      // Sincronização verificada no banco
      setSaveSuccessVerified(true);
      setSubmittedRsvp(submissionData);

      if (submissionData.status === 'YES') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EC4899', '#38BDF8', '#C084FC', '#F472B6']
        });
      }

      if (onRsvpSubmitted) {
        onRsvpSubmitted(submissionData);
      }
    } catch (fsErr: any) {
      console.warn('Erro ao salvar no Firestore:', fsErr);
      // Não simulamos sucesso se a persistência falhou!
      setSaveSuccessVerified(false);
      setSubmittedRsvp(submissionData);
      setSaveErrorMessage('A sincronização automática com o banco de dados online não pôde ser completada no momento. Para registrar sua confirmação sem falhas, por favor envie uma mensagem diretamente para os pais pelo WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="rsvp" className="w-full space-y-4">
      {/* Seletor de Abas (Formulário ou Lista de Confirmados) */}
      <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200/80">
        <button
          type="button"
          onClick={() => setActiveView('form')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeView === 'form'
              ? 'bg-white text-slate-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Formulário de Presença
        </button>
        <button
          type="button"
          onClick={() => setActiveView('roster')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeView === 'roster'
              ? 'bg-white text-slate-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>Confirmados ({confirmedList.length})</span>
        </button>
      </div>

      {activeView === 'form' ? (
        submittedRsvp ? (
          /* Estado pós-submissão */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-3xl border text-center space-y-4 ${
              saveSuccessVerified
                ? 'bg-emerald-50/50 border-emerald-200'
                : 'bg-amber-50/60 border-amber-200'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto text-2xl ${
              saveSuccessVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}>
              {saveSuccessVerified ? <CheckCircle className="w-8 h-8" /> : <span>📱</span>}
            </div>

            {saveSuccessVerified ? (
              <>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Resposta Registrada no Sistema!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Muito obrigado, <strong>{submittedRsvp.name}</strong>! As aniversariantes <strong>Ada e Gabi</strong> e a família vão adorar comemorar ao lado de vocês!
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Envie sua Confirmação pelo WhatsApp
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {saveErrorMessage}
                </p>
              </>
            )}

            {/* Botão de WhatsApp */}
            <div className="pt-2">
              <a
                href={getWhatsAppUrl(submittedRsvp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>AVISAR OS PAIS NO WHATSAPP</span>
              </a>
            </div>

            <div className="pt-2 flex items-center justify-center gap-4 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSubmittedRsvp(null);
                  setSaveSuccessVerified(false);
                  setSaveErrorMessage(null);
                }}
                className="text-[#0284C7] hover:underline cursor-pointer font-medium"
              >
                Preencher outra resposta
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => setActiveView('roster')}
                className="text-[#0284C7] hover:underline cursor-pointer font-medium"
              >
                Ver lista de confirmados
              </button>
            </div>
          </motion.div>
        ) : (
          /* Formulário de RSVP */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Status (Sim / Talvez / Não) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Você e sua família estarão presentes?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('YES')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    status === 'YES'
                      ? 'bg-rose-500 border-rose-400 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Sim! 🐾
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('MAYBE')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    status === 'MAYBE'
                      ? 'bg-amber-500 border-amber-400 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Talvez 🤔
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('NO')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    status === 'NO'
                      ? 'bg-slate-500 border-slate-400 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Não poderei 😢
                </button>
              </div>
            </div>

            {/* Nome */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Nome da Família ou Convidado(a) *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Titia Ana e Família"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-rose-400"
              />
            </div>

            {/* Quantidade de Pessoas */}
            {status !== 'NO' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Total de Pessoas (Adultos + Crianças):
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestCount(num)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        guestCount === num
                          ? 'bg-[#0284C7] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recado */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Mensagem carinhosa para as gêmeas (opcional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Deixe uma mensagem cheia de carinho para as nossas aniversariantes..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-rose-400 resize-none"
              />
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#0284C7] via-[#EC4899] to-[#8B5CF6] hover:opacity-95 text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>ENVIAR CONFIRMAÇÃO 🐾</span>}
            </button>
          </form>
        )
      ) : (
        /* Lista de Confirmados */
        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                LISTA DE CONVIDADOS
              </h4>
              <p className="text-xs text-slate-500">
                Pessoas confirmadas: <strong className="text-slate-800">{totalHeadcount}</strong>
              </p>
            </div>

            <div className="flex gap-1 bg-white p-0.5 rounded-xl border border-slate-200 text-[11px]">
              <button
                type="button"
                onClick={() => setRosterFilter('YES')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  rosterFilter === 'YES' ? 'bg-rose-50 text-rose-600' : 'text-slate-500'
                }`}
              >
                Confirmados ({confirmedList.length})
              </button>
              <button
                type="button"
                onClick={() => setRosterFilter('MAYBE')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  rosterFilter === 'MAYBE' ? 'bg-amber-50 text-amber-600' : 'text-slate-500'
                }`}
              >
                Talvez ({maybeList.length})
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {rosterFilter === 'YES' ? (
              confirmedList.length > 0 ? (
                confirmedList.map((item, idx) => (
                  <div key={item.id || idx} className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{item.name}</p>
                      {item.message && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5">"{item.message}"</p>
                      )}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold text-[10px]">
                      {item.guestCount} {item.guestCount === 1 ? 'pessoa' : 'pessoas'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  Nenhuma presença confirmada ainda. Seja o primeiro a confirmar!
                </div>
              )
            ) : (
              maybeList.length > 0 ? (
                maybeList.map((item, idx) => (
                  <div key={item.id || idx} className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{item.name}</p>
                      {item.message && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5">"{item.message}"</p>
                      )}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-bold text-[10px]">
                      {item.guestCount} {item.guestCount === 1 ? 'pessoa' : 'pessoas'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  Nenhum registro "talvez" no momento.
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
