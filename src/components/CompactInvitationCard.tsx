import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  Gift,
  Users,
  Heart,
  Snowflake,
  Copy,
  Camera,
  Trash2,
  MessageCircle,
  Sparkles,
  Info,
  Loader2
} from 'lucide-react';
import {
  subscribeToRsvps,
  subscribeToTwinsPhotos,
  saveTwinsPhotosToFirestore,
  compressImageFile
} from '../lib/firebase';

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
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedInviteText, setCopiedInviteText] = useState(false);

  // Fotografias reais das aniversariantes (Ada & Gabi)
  // Preservamos estritamente a fidelidade e exibimos placeholders claros se ainda não enviadas
  const [photoAda, setPhotoAda] = useState<string | null>(null);
  const [photoGabi, setPhotoGabi] = useState<string | null>(null);
  const [photoJoint, setPhotoJoint] = useState<string | null>(null);
  const [photoViewMode, setPhotoViewMode] = useState<'individual' | 'joint'>('individual');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<'ada' | 'gabi' | 'joint' | null>(null);
  const [hasCloudPhotos, setHasCloudPhotos] = useState(false);

  const fileInputAdaRef = useRef<HTMLInputElement>(null);
  const fileInputGabiRef = useRef<HTMLInputElement>(null);
  const fileInputJointRef = useRef<HTMLInputElement>(null);

  const [publicStats, setPublicStats] = useState<{
    totalHeadcount: number;
    attendingCount: number;
  } | null>(null);

  // Chave PIX fornecida pelos organizadores — estritamente 34776327880
  const PIX_KEY = '34776327880';

  // Informações confirmadas do evento (Casa da Bisavó • Sábado, 14 • Meio-dia)
  const EVENT_LOCATION = 'Casa da Bisavó';
  const EVENT_DATE = 'Sábado, 14';
  const EVENT_TIME = 'A partir do meio-dia';

  // SINCRONIZAÇÃO EM TEMPO REAL: Fotos compartilhadas na nuvem (Firestore + Backend)
  // Permite que qualquer pessoa ao abrir o site publicado veja as fotos reais
  useEffect(() => {
    // 1. Carregamento imediato do cache local (para evitar piscadas)
    try {
      const savedAda = localStorage.getItem('twin_photo_ada');
      if (savedAda) setPhotoAda(savedAda);

      const savedGabi = localStorage.getItem('twin_photo_gabi');
      if (savedGabi) setPhotoGabi(savedGabi);

      const savedJoint = localStorage.getItem('twins_joint_photo');
      if (savedJoint) setPhotoJoint(savedJoint);

      const savedMode = localStorage.getItem('twins_photo_mode') as 'individual' | 'joint';
      if (savedMode) setPhotoViewMode(savedMode);
    } catch (e) {
      console.warn('Erro ao ler cache local de fotos:', e);
    }

    // 2. Inscrição em tempo real com Firestore (compartilhado para todos os convidados e dispositivos)
    const unsubPhotos = subscribeToTwinsPhotos((cloudData) => {
      if (cloudData) {
        setHasCloudPhotos(true);
        if (cloudData.photoAda !== undefined) {
          setPhotoAda(cloudData.photoAda);
          try {
            if (cloudData.photoAda) localStorage.setItem('twin_photo_ada', cloudData.photoAda);
            else localStorage.removeItem('twin_photo_ada');
          } catch {}
        }
        if (cloudData.photoGabi !== undefined) {
          setPhotoGabi(cloudData.photoGabi);
          try {
            if (cloudData.photoGabi) localStorage.setItem('twin_photo_gabi', cloudData.photoGabi);
            else localStorage.removeItem('twin_photo_gabi');
          } catch {}
        }
        if (cloudData.photoJoint !== undefined) {
          setPhotoJoint(cloudData.photoJoint);
          try {
            if (cloudData.photoJoint) localStorage.setItem('twins_joint_photo', cloudData.photoJoint);
            else localStorage.removeItem('twins_joint_photo');
          } catch {}
        }
        if (cloudData.photoViewMode) {
          setPhotoViewMode(cloudData.photoViewMode);
          try { localStorage.setItem('twins_photo_mode', cloudData.photoViewMode); } catch {}
        }
      } else {
        // Fallback para API do servidor se o Firestore estiver vazio
        fetch('/api/photos')
          .then(res => res.json())
          .then(res => {
            if (res.success && res.photos) {
              setHasCloudPhotos(true);
              if (res.photos.photoAda) setPhotoAda(res.photos.photoAda);
              if (res.photos.photoGabi) setPhotoGabi(res.photos.photoGabi);
              if (res.photos.photoJoint) setPhotoJoint(res.photos.photoJoint);
              if (res.photos.photoViewMode) setPhotoViewMode(res.photos.photoViewMode);
            }
          })
          .catch(() => {});
      }
    });

    return () => {
      unsubPhotos();
    };
  }, []);

  // Inscrição em tempo real com Firestore para contagem verificada de confirmados
  useEffect(() => {
    let unsub = () => {};
    try {
      unsub = subscribeToRsvps((items) => {
        if (items && items.length > 0) {
          const yes = items.filter((r: any) => r.status === 'YES');
          setPublicStats({
            totalHeadcount: yes.reduce((acc: number, cur: any) => acc + (cur.guestCount || 1), 0),
            attendingCount: yes.length
          });
        } else {
          setPublicStats({
            totalHeadcount: 0,
            attendingCount: 0
          });
        }
      });
    } catch (e) {
      console.warn('Firestore subscription fallback:', e);
    }

    return () => {
      unsub();
    };
  }, []);

  // Manipulador de upload de foto preservando resolução original e salvando na nuvem
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'ada' | 'gabi' | 'joint') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(target);
    try {
      // Otimização automática: preserva nitidez e rosto real, comprimindo para caber no Firestore (~100-200kb)
      const optimizedDataUrl = await compressImageFile(file, 1000, 0.82);

      if (target === 'ada') {
        setPhotoAda(optimizedDataUrl);
        try { localStorage.setItem('twin_photo_ada', optimizedDataUrl); } catch {}
        await saveTwinsPhotosToFirestore({ photoAda: optimizedDataUrl });
      } else if (target === 'gabi') {
        setPhotoGabi(optimizedDataUrl);
        try { localStorage.setItem('twin_photo_gabi', optimizedDataUrl); } catch {}
        await saveTwinsPhotosToFirestore({ photoGabi: optimizedDataUrl });
      } else {
        setPhotoJoint(optimizedDataUrl);
        try { localStorage.setItem('twins_joint_photo', optimizedDataUrl); } catch {}
        await saveTwinsPhotosToFirestore({ photoJoint: optimizedDataUrl });
      }

      setHasCloudPhotos(true);

      // Espelhar também no servidor local para redundância completa
      try {
        await fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            [target === 'ada' ? 'photoAda' : target === 'gabi' ? 'photoGabi' : 'photoJoint']: optimizedDataUrl
          })
        });
      } catch {}
    } catch (err) {
      console.error('Erro ao otimizar e salvar fotografia na nuvem:', err);
    } finally {
      setIsUploadingPhoto(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleRemovePhoto = async (target: 'ada' | 'gabi' | 'joint', e: React.MouseEvent) => {
    e.stopPropagation();
    if (target === 'ada') {
      setPhotoAda(null);
      try { localStorage.removeItem('twin_photo_ada'); } catch {}
      await saveTwinsPhotosToFirestore({ photoAda: null });
    } else if (target === 'gabi') {
      setPhotoGabi(null);
      try { localStorage.removeItem('twin_photo_gabi'); } catch {}
      await saveTwinsPhotosToFirestore({ photoGabi: null });
    } else {
      setPhotoJoint(null);
      try { localStorage.removeItem('twins_joint_photo'); } catch {}
      await saveTwinsPhotosToFirestore({ photoJoint: null });
    }

    try {
      await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [target === 'ada' ? 'photoAda' : target === 'gabi' ? 'photoGabi' : 'photoJoint']: null
        })
      });
    } catch {}
  };

  const handleToggleViewMode = (mode: 'individual' | 'joint') => {
    setPhotoViewMode(mode);
    try { localStorage.setItem('twins_photo_mode', mode); } catch {}
    saveTwinsPhotosToFirestore({ photoViewMode: mode }).catch(() => {});
  };

  const handleCopyLocation = () => {
    navigator.clipboard.writeText(EVENT_LOCATION);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const getWhatsAppMessageText = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    return `🐾 *CONVITE DE ANIVERSÁRIO* 🐾\n\n` +
      `💖 *ADA E GABI*\n` +
      `Tema: *Patrulha Canina*\n\n` +
      `📍 *Local:* ${EVENT_LOCATION}\n` +
      `📅 *Data:* ${EVENT_DATE}\n` +
      `⏰ *Horário:* ${EVENT_TIME}\n\n` +
      `🔑 *Chave PIX dos organizadores:* ${PIX_KEY}\n\n` +
      `Esperamos por vocês com muito carinho para comemorar com a nossa duplinha! 💕\n\n` +
      (currentUrl ? `Confirme sua presença e veja a lista de mimos: ${currentUrl}` : '');
  };

  const handleShareWhatsApp = () => {
    const text = getWhatsAppMessageText();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyInviteText = () => {
    const text = getWhatsAppMessageText();
    navigator.clipboard.writeText(text);
    setCopiedInviteText(true);
    setTimeout(() => setCopiedInviteText(false), 2500);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 sm:py-5">
      {/* CARD PRINCIPAL VERTICAL — PALETA INSPIRADA EM SKYE & EVEREST (ROSA, LILÁS, AZUL CLARO E BRANCO) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white text-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_12px_40px_rgba(244,114,182,0.12),0_4px_16px_rgba(192,132,252,0.08)] border border-pink-100 relative overflow-hidden"
      >
        {/* Arco sutil de balões e cores delicadas no topo (Rosa, Lilás, Azul Claro, Branco) */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-300 via-purple-300 to-sky-300" />

        {/* Guirlanda visual de balõezinhos e patinhas delicadas inspirada na referência da Patrulha Canina Meninas */}
        <div className="relative pt-1 pb-2 flex items-center justify-between px-1">
          {/* Skye Badge Accent */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-50 border border-pink-100 text-[#EC4899] text-[10px] font-bold">
            <span className="text-xs">🐾</span>
            <span>SKYE</span>
          </div>

          {/* Mini Balões decorativos centrais */}
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-3 rounded-full bg-pink-200 inline-block shadow-2xs" />
            <span className="w-3 h-3.5 rounded-full bg-purple-200 inline-block shadow-2xs -mt-1" />
            <span className="w-2.5 h-3 rounded-full bg-sky-200 inline-block shadow-2xs" />
            <span className="w-2 h-2.5 rounded-full bg-pink-100 inline-block shadow-2xs -mt-0.5" />
          </div>

          {/* Everest Badge Accent */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-100 text-[#8B5CF6] text-[10px] font-bold">
            <span>EVEREST</span>
            <span className="text-xs">🐾</span>
          </div>
        </div>

        {/* Topo: Emblema Delicado da Patrulha Canina com Patinhas */}
        <div className="text-center mb-5 mt-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-50 via-purple-50 to-sky-50 border border-pink-200/80 text-[11px] font-bold text-slate-700 tracking-wide uppercase shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
            <span>PATRULHA CANINA</span>
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
          </div>

          <div className="mt-2 text-xs font-semibold text-purple-500 uppercase tracking-widest">
            Aniversário das Gêmeas
          </div>

          {/* DESTAQUE PRINCIPAL AOS NOMES DAS GÊMEAS: ADA E GABI */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-1 flex items-center justify-center gap-2">
            <span className="text-[#EC4899]">ADA</span>
            <span className="text-purple-300 font-light">&</span>
            <span className="text-[#8B5CF6]">GABI</span>
          </h1>

          <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
            Venha comemorar esse dia tão especial e cheio de alegria com a nossa duplinha!
          </p>
        </div>

        {/* SESSÃO DE FOTOGRAFIAS REAIS DAS MENINAS */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#EC4899] fill-[#EC4899]" />
              <span>Nossas Aniversariantes</span>
            </span>

            {/* Alternador de exibição (fotos individuais ou foto juntas) */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-[10px]">
              <button
                type="button"
                onClick={() => handleToggleViewMode('individual')}
                className={`px-2.5 py-0.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  photoViewMode === 'individual'
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Individuais
              </button>
              <button
                type="button"
                onClick={() => handleToggleViewMode('joint')}
                className={`px-2.5 py-0.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  photoViewMode === 'joint'
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Juntas
              </button>
            </div>
          </div>

          {/* Inputs para carregar as fotos reais de cada menina (preserva as fotos reais e evita manipulação) */}
          <input
            ref={fileInputAdaRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePhotoUpload(e, 'ada')}
          />
          <input
            ref={fileInputGabiRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePhotoUpload(e, 'gabi')}
          />
          <input
            ref={fileInputJointRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePhotoUpload(e, 'joint')}
          />

          {photoViewMode === 'individual' ? (
            /* Duas fotos individuais lado a lado */
            <div className="grid grid-cols-2 gap-3">
              {/* Moldura da Ada (Inspirada no Rosa da Skye) */}
              <div
                onClick={() => fileInputAdaRef.current?.click()}
                className="group relative cursor-pointer flex flex-col items-center bg-gradient-to-b from-rose-50/60 to-white hover:from-rose-50 rounded-2xl p-2.5 border-2 border-rose-100 hover:border-rose-300 transition-all text-center shadow-2xs"
              >
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-rose-50/50 flex items-center justify-center relative border border-rose-100/60">
                  {isUploadingPhoto === 'ada' ? (
                    <div className="flex flex-col items-center justify-center p-3 text-pink-600 gap-1.5">
                      <Loader2 className="w-6 h-6 animate-spin text-[#EC4899]" />
                      <span className="text-[10px] font-bold">Salvando na nuvem...</span>
                    </div>
                  ) : photoAda ? (
                    <>
                      <img
                        src={photoAda}
                        alt="Fotografia real da Ada"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => handleRemovePhoto('ada', e)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 hover:bg-black text-white text-[10px] transition-all opacity-0 group-hover:opacity-100"
                        title="Remover foto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-slate-400">
                      <div className="w-10 h-10 rounded-full bg-rose-100/80 text-rose-500 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">Foto da Ada</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">Toque p/ enviar</span>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
                  <span className="text-xs font-bold text-slate-800 tracking-wide">ADA</span>
                  <span className="text-[10px] text-pink-400">🐾</span>
                </div>
              </div>

              {/* Moldura da Gabi (Inspirada no Lilás / Azul da Everest) */}
              <div
                onClick={() => fileInputGabiRef.current?.click()}
                className="group relative cursor-pointer flex flex-col items-center bg-gradient-to-b from-purple-50/60 to-white hover:from-purple-50 rounded-2xl p-2.5 border-2 border-purple-100 hover:border-purple-300 transition-all text-center shadow-2xs"
              >
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-purple-50/50 flex items-center justify-center relative border border-purple-100/60">
                  {isUploadingPhoto === 'gabi' ? (
                    <div className="flex flex-col items-center justify-center p-3 text-purple-600 gap-1.5">
                      <Loader2 className="w-6 h-6 animate-spin text-[#8B5CF6]" />
                      <span className="text-[10px] font-bold">Salvando na nuvem...</span>
                    </div>
                  ) : photoGabi ? (
                    <>
                      <img
                        src={photoGabi}
                        alt="Fotografia real da Gabi"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => handleRemovePhoto('gabi', e)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 hover:bg-black text-white text-[10px] transition-all opacity-0 group-hover:opacity-100"
                        title="Remover foto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-slate-400">
                      <div className="w-10 h-10 rounded-full bg-purple-100/80 text-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">Foto da Gabi</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">Toque p/ enviar</span>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  <span className="text-xs font-bold text-slate-800 tracking-wide">GABI</span>
                  <span className="text-[10px] text-purple-400">🐾</span>
                </div>
              </div>
            </div>
          ) : (
            /* Foto única das gêmeas juntas */
            <div
              onClick={() => fileInputJointRef.current?.click()}
              className="group relative cursor-pointer flex flex-col items-center bg-gradient-to-b from-sky-50/50 via-purple-50/40 to-white hover:from-sky-50 rounded-2xl p-3 border-2 border-slate-200 hover:border-pink-200 transition-all text-center shadow-2xs"
            >
              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center relative border border-slate-200/60">
                {isUploadingPhoto === 'joint' ? (
                  <div className="flex flex-col items-center justify-center p-4 text-purple-600 gap-1.5">
                    <Loader2 className="w-7 h-7 animate-spin text-[#8B5CF6]" />
                    <span className="text-xs font-bold">Salvando foto na nuvem...</span>
                  </div>
                ) : photoJoint ? (
                  <>
                    <img
                      src={photoJoint}
                      alt="Fotografia real das Gêmeas Ada e Gabi"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => handleRemovePhoto('joint', e)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black text-white text-xs transition-all opacity-0 group-hover:opacity-100"
                      title="Remover foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-slate-400">
                    <div className="w-12 h-12 rounded-full bg-slate-200/80 text-slate-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Camera className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Foto das Gêmeas Juntas</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Toque para selecionar foto de Ada & Gabi</span>
                  </div>
                )}
              </div>

              <div className="mt-2 text-xs font-bold text-slate-800 tracking-wide flex items-center gap-1.5">
                <span className="text-[#EC4899]">ADA</span>
                <span className="text-slate-300">&</span>
                <span className="text-[#8B5CF6]">GABI</span>
                <span>🐾</span>
              </div>
            </div>
          )}

          {/* Indicador de sincronização em nuvem */}
          {(photoAda || photoGabi || photoJoint) ? (
            <div className="mt-2.5 text-center">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-medium text-emerald-700">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Fotos salvas na nuvem • Visíveis no site publicado e no celular</span>
              </span>
            </div>
          ) : (
            <div className="mt-2 text-center">
              <span className="text-[10px] text-slate-400">
                Toque nos quadros para carregar as fotos reais (sincronizadas para todos os convidados)
              </span>
            </div>
          )}

          <p className="text-[10px] text-slate-400 text-center mt-2">
            As fotos das aniversariantes serão apresentadas fielmente em seu visual natural.
          </p>
        </div>

        {/* INFORMAÇÕES CONFIRMADAS DO CONVITE: LOCAL, DATA E HORÁRIO */}
        <div className="space-y-2.5 mb-5">
          {/* Local: Casa da Bisavó */}
          <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  LOCAL
                </span>
                <p className="text-sm font-bold text-slate-800 truncate">
                  {EVENT_LOCATION}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyLocation}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-medium flex items-center gap-1 shrink-0 transition-colors cursor-pointer shadow-2xs"
              title="Copiar endereço"
            >
              {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden xs:inline">{copiedAddress ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          {/* Linha com Data e Horário: Sábado, 14 • Meio-dia */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Data: Sábado, 14 */}
            <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#EC4899] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  DATA
                </span>
                <p className="text-xs font-bold text-slate-800 truncate">
                  {EVENT_DATE}
                </p>
              </div>
            </div>

            {/* Horário: A partir do meio-dia */}
            <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#8B5CF6] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  HORÁRIO
                </span>
                <p className="text-xs font-bold text-slate-800 truncate">
                  {EVENT_TIME}
                </p>
              </div>
            </div>
          </div>

          <div className="px-1 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Esperamos por você a partir do meio-dia na Casa da Bisavó!</span>
          </div>
        </div>

        {/* NOTA DE INVERNO & SUGESTÃO DE MIMOS / PIX */}
        <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-sky-50/80 via-purple-50/60 to-rose-50/80 border border-purple-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white shadow-2xs text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5 border border-sky-100">
            <Snowflake className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex-1 text-xs text-slate-600">
            <p className="font-bold text-slate-800">
              O inverno está chegando! ❄️
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Para quem desejar presentear as gêmeas, preferimos <strong>mimos pequenos</strong> ou <strong>contribuição via PIX</strong> para comprarmos o que elas precisam de volta pra casa.
            </p>
          </div>
        </div>

        {/* CHAVE PIX OFICIAL FORNECIDA PELOS ORGANIZADORES */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3 text-xs mb-5">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              CHAVE PIX DOS ORGANIZADORES
            </span>
            <span className="text-slate-800 font-mono text-xs font-bold truncate block select-all">
              {PIX_KEY}
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">
              Chave fornecida pelos pais para colar no app do seu banco
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyPix}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-slate-200"
            title="Copiar chave PIX"
          >
            {copiedPix ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
            <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>

        {/* BOTÕES DE AÇÃO PRINCIPAIS: RSVP & WISHLIST */}
        <div className="space-y-2.5 mb-5">
          <button
            type="button"
            onClick={() => onOpenRsvp('form')}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:opacity-95 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span>🐾 Confirmar Presença (RSVP)</span>
          </button>

          <button
            type="button"
            onClick={onOpenWishlist}
            className="w-full py-3 px-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border-2 border-purple-100 hover:border-purple-200 font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <Gift className="w-4 h-4 text-[#EC4899]" />
            <span>Ver Lista de Mimos & Sugestões 🎁</span>
          </button>
        </div>

        {/* COMPARTILHAMENTO RÁPIDO PARA O WHATSAPP */}
        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="Compartilhar pelo WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Enviar no WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleCopyInviteText}
            className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Copiar texto do convite"
          >
            {copiedInviteText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedInviteText ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>
        </div>

        {/* STATUS DOS CONVIDADOS CONFIRMADOS (APENAS REGISTROS REAIS VERIFICADOS) */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>
              {publicStats && publicStats.totalHeadcount > 0 ? (
                <>
                  <strong className="text-slate-800">{publicStats.totalHeadcount}</strong> pessoas confirmadas
                </>
              ) : (
                'Confirme sua presença pelo botão acima'
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenRsvp('roster')}
            className="text-[#8B5CF6] hover:underline font-semibold cursor-pointer text-[11px]"
          >
            Ver lista
          </button>
        </div>
      </motion.div>
    </div>
  );
};
