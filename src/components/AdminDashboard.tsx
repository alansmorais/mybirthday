import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  Unlock,
  Users,
  UserCheck,
  Calendar,
  Gift,
  Search,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  PhoneCall,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import { RsvpSubmission, WishlistItem, AdminStats } from '../types';
import { INITIAL_WISHLIST } from '../data/initialWishlist';
import {
  getRsvpsFromFirestore,
  updateRsvpCheckInFirestore,
  deleteRsvpFromFirestore,
  saveRsvpToFirestore,
  clearAllRsvpsFromFirestore,
  clearAllWishlistClaimsFromFirestore
} from '../lib/firebase';

const GITHUB_PAGES_ADMIN_PASSWORD = 'Dupa1989%';

interface AdminDashboardProps {
  onBackToInvite: () => void;
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToInvite,
  adminToken,
  setAdminToken
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Admin Data State
  const [rsvps, setRsvps] = useState<RsvpSubmission[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'rsvps' | 'wishlist' | 'settings'>('rsvps');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Manual Add RSVP Form
  const [isAddingRsvp, setIsAddingRsvp] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState<'YES' | 'MAYBE' | 'NO'>('YES');
  const [newGuestCount, setNewGuestCount] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  // WhatsApp and Pix Configuration
  const [pixKey, setPixKey] = useState('34776327880');
  const [whatsAppPhone, setWhatsAppPhone] = useState('');
  const [configSaved, setConfigSaved] = useState(false);

  useEffect(() => {
    try {
      const savedPix = localStorage.getItem('twins_pix_key');
      if (savedPix) setPixKey(savedPix);
      const savedPhone = localStorage.getItem('twins_whatsapp_phone');
      if (savedPhone) setWhatsAppPhone(savedPhone);
    } catch {}
  }, []);

  const calculateStats = (rsvpList: RsvpSubmission[], wishList: WishlistItem[]) => {
    const totalSubmissions = rsvpList.length;
    const yesRsvps = rsvpList.filter(r => r.status === 'YES');
    const maybeRsvps = rsvpList.filter(r => r.status === 'MAYBE');
    const noRsvps = rsvpList.filter(r => r.status === 'NO');

    const totalHeadcount = yesRsvps.reduce((acc, curr) => acc + (Number(curr.guestCount) || 1), 0);
    const checkedInCount = yesRsvps.filter(r => r.checkedIn).reduce((acc, curr) => acc + (Number(curr.guestCount) || 1), 0);

    const reservedGifts = wishList.filter(w => w.isReserved).length;
    const totalGifts = wishList.length;

    return {
      totalSubmissions,
      attendingCount: yesRsvps.length,
      maybeCount: maybeRsvps.length,
      declinedCount: noRsvps.length,
      totalHeadcount,
      checkedInCount,
      checkedInPercentage: totalHeadcount > 0 ? Math.round((checkedInCount / totalHeadcount) * 100) : 0,
      reservedGifts,
      totalGifts,
      giftClaimPercentage: totalGifts > 0 ? Math.round((reservedGifts / totalGifts) * 100) : 0
    };
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setLoginError(null);

    const entered = password.trim();
    if (entered === 'daddy2026' || entered === 'Dupa1989%' || entered === GITHUB_PAGES_ADMIN_PASSWORD) {
      const token = `token-${Date.now()}`;
      setAdminToken(token);
      try {
        sessionStorage.setItem('alans_admin_token', token);
      } catch {}
      setIsAuthenticating(false);
      loadData();
    } else {
      setLoginError('Senha incorreta.');
      setIsAuthenticating(false);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Purge any legacy keys from previous app
      try { localStorage.removeItem('alans_rsvps'); } catch {}

      let firestoreRsvps: RsvpSubmission[] = [];
      try {
        firestoreRsvps = await getRsvpsFromFirestore();
      } catch (fsErr) {
        console.warn('Firestore load:', fsErr);
      }

      const raw = JSON.parse(localStorage.getItem('twins_rsvps') || '[]');
      const combinedMap = new Map<string, RsvpSubmission>();
      raw.forEach((r: any) => combinedMap.set(r.id, r));
      firestoreRsvps.forEach((r: any) => combinedMap.set(r.id, r));
      const finalRsvps = Array.from(combinedMap.values());

      setRsvps(finalRsvps);
      setWishlist(INITIAL_WISHLIST);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      loadData();
    }
  }, [adminToken]);

  const handleToggleCheckIn = async (rsvp: RsvpSubmission) => {
    const nextCheckIn = !rsvp.checkedIn;
    try {
      await updateRsvpCheckInFirestore(rsvp.id, nextCheckIn);
    } catch {}

    setRsvps(prev => prev.map(r => r.id === rsvp.id ? { ...r, checkedIn: nextCheckIn } : r));
    try {
      const raw = JSON.parse(localStorage.getItem('twins_rsvps') || '[]');
      const updated = raw.map((r: any) => r.id === rsvp.id ? { ...r, checkedIn: nextCheckIn } : r);
      localStorage.setItem('twins_rsvps', JSON.stringify(updated));
    } catch {}
  };

  const handleDeleteRsvp = async (id: string, name: string) => {
    if (!window.confirm(`Remover confirmação de "${name}"?`)) return;
    try {
      await deleteRsvpFromFirestore(id);
    } catch {}
    setRsvps(prev => prev.filter(r => r.id !== id));
    try {
      const raw = JSON.parse(localStorage.getItem('twins_rsvps') || '[]');
      const updated = raw.filter((r: any) => r.id !== id);
      localStorage.setItem('twins_rsvps', JSON.stringify(updated));
    } catch {}
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newRsvp: RsvpSubmission = {
      id: `manual-${Date.now()}`,
      name: newName.trim(),
      status: newStatus,
      guestCount: Number(newGuestCount) || 1,
      message: newMessage.trim(),
      checkedIn: false,
      createdAt: new Date().toISOString()
    };

    try {
      await saveRsvpToFirestore(newRsvp);
    } catch {}

    setRsvps(prev => [newRsvp, ...prev]);
    try {
      const raw = JSON.parse(localStorage.getItem('twins_rsvps') || '[]');
      raw.unshift(newRsvp);
      localStorage.setItem('twins_rsvps', JSON.stringify(raw));
    } catch {}

    setNewName('');
    setNewMessage('');
    setIsAddingRsvp(false);
  };

  const [isClearing, setIsClearing] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

  const handleClearEntireBackend = async () => {
    if (!window.confirm('Atenção: Deseja realmente limpar 100% dos registros do backend (Firestore, RSVPs e Mimos)?')) {
      return;
    }

    setIsClearing(true);
    try {
      // 1. Limpar Firestore
      await clearAllRsvpsFromFirestore();
      await clearAllWishlistClaimsFromFirestore();

      // 2. Limpar storage local
      try {
        localStorage.removeItem('twins_rsvps');
        localStorage.removeItem('alans_rsvps');
      } catch {}

      // 3. Notificar backend local (se ativo)
      try {
        await fetch('/api/admin/clear-all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken || 'daddy2026'}`
          }
        });
      } catch {}

      // 4. Resetar estados
      setRsvps([]);
      setWishlist(INITIAL_WISHLIST.map(item => ({ ...item, isReserved: false })));
      setClearSuccess(true);
      setTimeout(() => setClearSuccess(false), 4000);
    } catch (err) {
      console.error('Erro na limpeza:', err);
      alert('Houve um erro ao limpar. Verifique o console.');
    } finally {
      setIsClearing(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('twins_pix_key', pixKey.trim());
      localStorage.setItem('twins_whatsapp_phone', whatsAppPhone.trim());
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 3000);
    } catch {}
  };

  const stats = calculateStats(rsvps, wishlist);

  const filteredRsvps = rsvps.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.message && r.message.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!adminToken) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-12">
        <div className="p-7 rounded-3xl bg-[#2e0854] border-2 border-pink-500/40 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-pink-500/20 text-pink-300 flex items-center justify-center mx-auto text-2xl">
            🔒
          </div>
          <h2 className="text-xl font-arcade text-white">Painel dos Pais (Admin)</h2>
          <p className="text-xs text-pink-200">
            Acesso para controle de convidados da festinha das gêmeas Ada e Gabi.
          </p>

          <form onSubmit={handleLogin} className="space-y-3 pt-2">
            {loginError && (
              <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs">
                {loginError}
              </div>
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha..."
              className="w-full px-4 py-3 rounded-xl bg-[#240443] border border-pink-500/40 text-white text-sm focus:outline-none focus:border-pink-300"
            />
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-arcade font-bold text-xs tracking-wider cursor-pointer shadow-lg"
            >
              {isAuthenticating ? 'Entrando...' : 'ENTRAR NO PAINEL 🐾'}
            </button>
          </form>

          <button
            onClick={onBackToInvite}
            className="text-xs text-pink-300 hover:text-white underline block mx-auto pt-2 cursor-pointer"
          >
            ← Voltar ao Convite
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-pink-500/20 pb-4">
        <div>
          <button
            onClick={onBackToInvite}
            className="text-xs text-pink-300 hover:text-white flex items-center gap-1 cursor-pointer font-bold mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Convite</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-arcade text-white">
            PAINEL DOS PAIS • GÊMEAS ADA E GABI 🐾
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-[#2e0854] text-pink-300 border border-pink-500/30 hover:text-white cursor-pointer"
            title="Atualizar dados"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setAdminToken(null);
              sessionStorage.removeItem('alans_admin_token');
            }}
            className="px-3 py-1.5 rounded-xl bg-purple-950 text-pink-300 hover:text-white text-xs font-bold border border-pink-500/30 cursor-pointer"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Cards de Métricas em Tempo Real */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#2e0854] border border-pink-500/30">
          <span className="text-[10px] font-arcade text-pink-300 uppercase block">TOTAL CONFIRMADOS</span>
          <div className="text-2xl font-black text-white mt-1">{stats.totalHeadcount}</div>
          <span className="text-[11px] text-pink-200">pessoas confirmadas</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#2e0854] border border-pink-500/30">
          <span className="text-[10px] font-arcade text-pink-300 uppercase block">FAMÍLIAS (SIM)</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{stats.attendingCount}</div>
          <span className="text-[11px] text-pink-200">respostas 'Sim'</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#2e0854] border border-pink-500/30">
          <span className="text-[10px] font-arcade text-pink-300 uppercase block">TALVEZ</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{stats.maybeCount}</div>
          <span className="text-[11px] text-pink-200">famílias em dúvida</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#2e0854] border border-pink-500/30">
          <span className="text-[10px] font-arcade text-pink-300 uppercase block">CHECK-IN NO LOCAL</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">{stats.checkedInCount}</div>
          <span className="text-[11px] text-pink-200">{stats.checkedInPercentage}% dos confirmados</span>
        </div>
      </div>

      {/* Abas do Admin */}
      <div className="flex gap-2 border-b border-pink-500/20 pb-2">
        <button
          onClick={() => setActiveTab('rsvps')}
          className={`px-4 py-2 rounded-xl text-xs font-arcade tracking-wider cursor-pointer ${
            activeTab === 'rsvps' ? 'bg-pink-600 text-white' : 'text-pink-300 hover:text-white'
          }`}
        >
          Lista de Convidados ({rsvps.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-arcade tracking-wider cursor-pointer ${
            activeTab === 'settings' ? 'bg-pink-600 text-white' : 'text-pink-300 hover:text-white'
          }`}
        >
          Configurações (PIX & WhatsApp)
        </button>
      </div>

      {activeTab === 'rsvps' && (
        <div className="space-y-4">
          {/* Barra de Filtros e Busca */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-pink-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome ou recado..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#240443] border border-pink-500/30 text-white text-xs focus:outline-none focus:border-pink-300"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#240443] border border-pink-500/30 text-pink-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">Todos os status</option>
                <option value="YES">Apenas SIM</option>
                <option value="MAYBE">Apenas TALVEZ</option>
                <option value="NO">Apenas NÃO</option>
              </select>

              <button
                onClick={() => setIsAddingRsvp(!isAddingRsvp)}
                className="px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Convidado</span>
              </button>
            </div>
          </div>

          {/* Formulário de Adicionar Manual */}
          {isAddingRsvp && (
            <form onSubmit={handleManualAdd} className="p-4 rounded-2xl bg-[#240443] border border-pink-500/40 space-y-3">
              <h4 className="text-xs font-arcade text-pink-300">ADICIONAR CONVIDADO MANUALMENTE</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nome do convidado ou família..."
                  required
                  className="px-3 py-2 rounded-xl bg-[#1e0538] border border-pink-500/30 text-white text-xs"
                />
                <select
                  value={newStatus}
                  onChange={(e: any) => setNewStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#1e0538] border border-pink-500/30 text-pink-200 text-xs"
                >
                  <option value="YES">Confirmado (SIM)</option>
                  <option value="MAYBE">Talvez</option>
                  <option value="NO">Não vai</option>
                </select>
                <input
                  type="number"
                  min="1"
                  value={newGuestCount}
                  onChange={(e) => setNewGuestCount(Number(e.target.value))}
                  placeholder="Total de pessoas"
                  className="px-3 py-2 rounded-xl bg-[#1e0538] border border-pink-500/30 text-white text-xs"
                />
              </div>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Observação ou recado..."
                className="w-full px-3 py-2 rounded-xl bg-[#1e0538] border border-pink-500/30 text-white text-xs"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingRsvp(false)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-pink-600 text-white font-bold text-xs"
                >
                  Salvar
                </button>
              </div>
            </form>
          )}

          {/* Tabela de Convidados */}
          <div className="rounded-2xl border border-pink-500/20 bg-[#2e0854] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-pink-100">
                <thead className="bg-[#240443] text-pink-300 uppercase text-[10px] font-arcade border-b border-pink-500/20">
                  <tr>
                    <th className="p-3">Convidado / Família</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Pessoas</th>
                    <th className="p-3">Recado</th>
                    <th className="p-3">Check-in no Local</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-500/10">
                  {filteredRsvps.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-pink-300/60">
                        Nenhum convidado encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredRsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="hover:bg-pink-500/5 transition-colors">
                        <td className="p-3 font-bold text-white">{rsvp.name}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rsvp.status === 'YES' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            rsvp.status === 'MAYBE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-zinc-700 text-zinc-300'
                          }`}>
                            {rsvp.status === 'YES' ? 'Sim 🐾' : rsvp.status === 'MAYBE' ? 'Talvez' : 'Não'}
                          </span>
                        </td>
                        <td className="p-3 font-semibold">{rsvp.guestCount || 1}</td>
                        <td className="p-3 max-w-xs truncate italic text-zinc-300">{rsvp.message || '—'}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleCheckIn(rsvp)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                              rsvp.checkedIn
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#1e0538] text-pink-300 border border-pink-500/30 hover:border-pink-400'
                            }`}
                          >
                            {rsvp.checkedIn ? '✓ Chegou' : 'Pendente'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteRsvp(rsvp.id, rsvp.name)}
                            className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950 cursor-pointer"
                            title="Remover"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-5">
          <form onSubmit={handleSaveConfig} className="p-5 rounded-2xl bg-[#2e0854] border border-pink-500/30 space-y-4 max-w-lg">
            <h4 className="text-xs font-arcade text-pink-300">CONFIGURAÇÃO DA CHAVE PIX & WHATSAPP</h4>
            
            {configSaved && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs">
                Configurações salvas com sucesso!
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-pink-200 block">
                Chave PIX (E-mail, CPF ou Telefone dos Pais):
              </label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Ex: 34776327880"
                className="w-full px-3 py-2.5 rounded-xl bg-[#240443] border border-pink-500/30 text-white text-xs font-mono"
              />
              <span className="text-[11px] text-pink-300/80 block">
                Esta chave será exibida com botão de cópia na lista de presentes.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-pink-200 block">
                WhatsApp dos Pais (com DDD):
              </label>
              <input
                type="text"
                value={whatsAppPhone}
                onChange={(e) => setWhatsAppPhone(e.target.value)}
                placeholder="Ex: 5511999999999"
                className="w-full px-3 py-2.5 rounded-xl bg-[#240443] border border-pink-500/30 text-white text-xs font-mono"
              />
              <span className="text-[11px] text-pink-300/80 block">
                Deixe vazio para abrir o WhatsApp diretamente no seletor de contatos do convidado.
              </span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Salvar Configurações
            </button>
          </form>

          {/* Zona de Limpeza Completa do Backend */}
          <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-3 max-w-lg">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <h4 className="text-xs font-bold text-rose-200 uppercase tracking-wider">
                Limpeza Completa do Backend (100% Limpo)
              </h4>
            </div>

            <p className="text-xs text-rose-200/80 leading-relaxed">
              Como este é um novo site para o aniversário de Ada & Gabi, esta opção apaga definitivamente quaisquer confirmações antigas (RSVP) e reservas de mimos no Firestore e no banco de dados local.
            </p>

            {clearSuccess && (
              <div className="p-3 rounded-xl bg-emerald-900/80 border border-emerald-400 text-emerald-100 text-xs">
                Backend limpo com sucesso! Todos os registros foram resetados para 0.
              </div>
            )}

            <button
              type="button"
              onClick={handleClearEntireBackend}
              disabled={isClearing}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isClearing ? 'Limpando...' : 'Zerar Banco de Dados Agora (100% Limpo)'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
