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
  XCircle,
  HelpCircle,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  Check,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { RsvpSubmission, WishlistItem, AdminStats } from '../types';
import { INITIAL_WISHLIST } from '../data/initialWishlist';

// --- ADMIN PASSWORD CONFIGURATION FOR GITHUB PAGES ---
// You can edit this fallback password directly in the code for your static site!
const GITHUB_PAGES_ADMIN_PASSWORD = 'daddy2026';

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
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'YES' | 'MAYBE' | 'NO'>('ALL');

  // Add Manual Guest Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualStatus, setManualStatus] = useState<'YES' | 'MAYBE' | 'NO'>('YES');
  const [manualGuests, setManualGuests] = useState(1);
  const [manualMessage, setManualMessage] = useState('');

  // Active view tab in admin
  const [adminTab, setAdminTab] = useState<'guests' | 'wishlist'>('guests');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const calculateLocalStats = (rsvpList: RsvpSubmission[], wishlistItems: WishlistItem[]): AdminStats => {
    const totalHeadcount = rsvpList
      .filter(r => r.status === 'YES')
      .reduce((sum, r) => sum + (r.guestCount || 1), 0);
    const yesCount = rsvpList.filter(r => r.status === 'YES').length;
    const maybeCount = rsvpList.filter(r => r.status === 'MAYBE').length;
    const noCount = rsvpList.filter(r => r.status === 'NO').length;
    const reservedWishlistCount = wishlistItems.filter(w => w.isReserved).length;

    return {
      totalRsvps: rsvpList.length,
      totalHeadcount,
      yesCount,
      yesHeadcount: totalHeadcount,
      maybeCount,
      noCount,
      reservedWishlistCount,
      totalWishlistCount: wishlistItems.length
    };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsAuthenticating(true);

    const trimmedPassword = password.trim();

    try {
      let tokenToSave: string | null = null;
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: trimmedPassword })
        });

        if (res.ok) {
          const data = await res.json();
          tokenToSave = data.token || trimmedPassword;
        } else if (res.status === 401) {
          throw new Error('Incorrect password.');
        } else {
          // Trigger fallback for 404/static server responses
          throw new Error('FALLBACK');
        }
      } catch (networkErr: any) {
        if (networkErr.message === 'Incorrect password.') {
          throw networkErr;
        }
        // Fallback for static GitHub Pages or server unreachable
        const clientSideAdminPassword = (import.meta as any).env?.VITE_ADMIN_PASSWORD || GITHUB_PAGES_ADMIN_PASSWORD;
        if (trimmedPassword === clientSideAdminPassword) {
          tokenToSave = trimmedPassword;
        } else {
          throw new Error('Incorrect password.');
        }
      }

      if (tokenToSave) {
        setAdminToken(tokenToSave);
        sessionStorage.setItem('alans_admin_token', tokenToSave);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Incorrect password.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const fetchAdminData = async () => {
    if (!adminToken) return;
    setIsLoading(true);
    try {
      let dataLoaded = false;
      try {
        const res = await fetch('/api/admin/rsvps', {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });
        if (res.status === 401) {
          setAdminToken(null);
          sessionStorage.removeItem('alans_admin_token');
          setLoginError('Session expired. Please re-enter backend password.');
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setRsvps(data.rsvps || []);
          setWishlist(data.wishlist || []);
          setStats(data.stats || null);
          dataLoaded = true;
        }
      } catch {
        // Fallback to local storage for static hosting
      }

      if (!dataLoaded) {
        const localRsvps: RsvpSubmission[] = JSON.parse(localStorage.getItem('alans_rsvps') || '[]');
        const myRes: Record<string, boolean> = JSON.parse(localStorage.getItem('alans_my_reservations') || '{}');
        const localWishlist = INITIAL_WISHLIST.map(item => ({
          ...item,
          isReserved: !!myRes[item.id] || item.isReserved
        }));
        setRsvps(localRsvps);
        setWishlist(localWishlist);
        setStats(calculateLocalStats(localRsvps, localWishlist));
      }
    } catch (err) {
      console.error('Error loading admin records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchAdminData();
    }
  }, [adminToken]);

  const handleToggleCheckIn = async (rsvp: RsvpSubmission) => {
    if (!adminToken) return;
    try {
      try {
        await fetch(`/api/admin/rsvps/${rsvp.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify({ checkedIn: !rsvp.checkedIn })
        });
      } catch {}

      setRsvps(prev => {
        const updated = prev.map(r => (r.id === rsvp.id ? { ...r, checkedIn: !rsvp.checkedIn } : r));
        try {
          localStorage.setItem('alans_rsvps', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      showNotification(`Updated check-in status for ${rsvp.name}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRsvp = async (id: string, name: string) => {
    if (!adminToken || !window.confirm(`Remove ${name} from RSVP list?`)) return;
    try {
      try {
        await fetch(`/api/admin/rsvps/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` }
        });
      } catch {}

      setRsvps(prev => {
        const updated = prev.filter(r => r.id !== id);
        try {
          localStorage.setItem('alans_rsvps', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      showNotification(`Removed ${name} from registry.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddManualGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !manualName.trim()) return;

    try {
      const newRsvp: RsvpSubmission = {
        id: `rsvp-${Date.now()}`,
        name: manualName.trim(),
        status: manualStatus,
        guestCount: manualGuests,
        message: manualMessage.trim(),
        checkedIn: false,
        createdAt: new Date().toISOString()
      };

      try {
        await fetch('/api/admin/rsvps', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(newRsvp)
        });
      } catch {}

      setRsvps(prev => {
        const updated = [newRsvp, ...prev];
        try {
          localStorage.setItem('alans_rsvps', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setShowAddModal(false);
      setManualName('');
      setManualMessage('');
      setManualGuests(1);
      showNotification('Guest added successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadCsv = () => {
    if (!adminToken) return;
    try {
      // Build client-side CSV Blob for guaranteed instant download everywhere
      const headers = ['Name', 'Status', 'Headcount', 'Message', 'Checked In', 'Submitted At'];
      const rows = rsvps.map(r => [
        `"${(r.name || '').replace(/"/g, '""')}"`,
        `"${r.status}"`,
        r.guestCount || 1,
        `"${(r.message || '').replace(/"/g, '""')}"`,
        r.checkedIn ? 'YES' : 'NO',
        `"${r.createdAt || ''}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `alans-30-birthday-rsvps-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.location.href = `/api/admin/export/csv?password=${encodeURIComponent(adminToken)}`;
    }
  };

  const handleResetWishlist = async () => {
    if (!adminToken || !window.confirm('Reset all wishlist reservations to available?')) return;
    try {
      try {
        await fetch('/api/admin/wishlist/reset', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` }
        });
      } catch {}

      localStorage.removeItem('alans_my_reservations');
      setWishlist(INITIAL_WISHLIST);
      showNotification('Wishlist reservations reset.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    sessionStorage.removeItem('alans_admin_token');
  };

  // Filtered RSVPs
  const filteredRsvps = rsvps.filter(r => {
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.message && r.message.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // 1. Password Lock Screen
  if (!adminToken) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#111319] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-cinzel font-bold text-gold-gradient">
              Executive Vault
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-1">
              Backend password protected area for Daddy Alan.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-amber-400/90 mb-2">
                Backend Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-[#161822] border border-[#272c3d] focus:border-amber-400 focus:outline-none text-sm text-zinc-100 placeholder-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-zinc-500 font-mono mt-1.5 flex items-center justify-between">
                <span>Default passcode: <code className="text-amber-300 font-bold">daddy2026</code></span>
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 px-4 rounded-xl bg-gold-gradient text-neutral-950 font-cinzel font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isAuthenticating ? 'VERIFYING...' : 'UNLOCK DASHBOARD'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#222634] text-center">
            <button
              onClick={onBackToInvite}
              className="text-xs text-zinc-400 hover:text-amber-300 flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Invitation</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. Full Admin Dashboard Screen
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222633] mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
              ADMINISTRATIVE VAULT
            </span>
            <span className="text-xs text-zinc-400 font-mono">Live Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-gold-gradient mt-1">
            Alan's 30+ Guest Registry
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchAdminData}
            className="p-2 rounded-lg bg-[#161822] hover:bg-[#1e2230] border border-[#272c3d] text-zinc-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="px-3 py-2 rounded-lg bg-[#161822] hover:bg-[#1e2230] border border-[#272c3d] text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-lg bg-gold-gradient text-neutral-950 text-xs font-cinzel font-bold flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Guest</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-xs transition-colors cursor-pointer"
          >
            Lock Vault
          </button>
        </div>
      </div>

      {actionSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </motion.div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
        {/* Total Headcount */}
        <div className="p-4 rounded-2xl bg-[#111319] border border-amber-500/30 shadow-lg">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
            Total Headcount
          </div>
          <div className="text-2xl sm:text-3xl font-cinzel font-black text-amber-300">
            {stats ? stats.totalHeadcount : 0}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Confirmed attendees</div>
        </div>

        {/* YES RSVPs */}
        <div className="p-4 rounded-2xl bg-[#111319] border border-[#242836]">
          <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-1">
            Attending (YES)
          </div>
          <div className="text-2xl sm:text-3xl font-cinzel font-bold text-zinc-100">
            {stats ? stats.yesCount : 0}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Confirmed parties</div>
        </div>

        {/* MAYBE */}
        <div className="p-4 rounded-2xl bg-[#111319] border border-[#242836]">
          <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1">
            Negotiating
          </div>
          <div className="text-2xl sm:text-3xl font-cinzel font-bold text-zinc-100">
            {stats ? stats.maybeCount : 0}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Probable guests</div>
        </div>

        {/* NO */}
        <div className="p-4 rounded-2xl bg-[#111319] border border-[#242836]">
          <div className="text-[11px] font-mono text-red-400 uppercase tracking-wider mb-1">
            Declined (NO)
          </div>
          <div className="text-2xl sm:text-3xl font-cinzel font-bold text-zinc-100">
            {stats ? stats.noCount : 0}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Disappointed Daddy</div>
        </div>

        {/* Total Registrations */}
        <div className="p-4 rounded-2xl bg-[#111319] border border-[#242836]">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
            Total Forms
          </div>
          <div className="text-2xl sm:text-3xl font-cinzel font-bold text-zinc-100">
            {stats ? stats.totalRsvps : 0}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Total responses</div>
        </div>

        {/* Wishlist Claimed */}
        <div className="p-4 rounded-2xl bg-[#111319] border border-[#242836]">
          <div className="text-[11px] font-mono text-amber-300 uppercase tracking-wider mb-1">
            Gifts Claimed
          </div>
          <div className="text-2xl sm:text-3xl font-cinzel font-bold text-amber-300">
            {stats ? `${stats.reservedWishlistCount}/${stats.totalWishlistCount}` : '0/8'}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Tributes locked</div>
        </div>
      </div>

      {/* Tab Switcher: RSVPs vs Wishlist Manager */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setAdminTab('guests')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all cursor-pointer ${
            adminTab === 'guests'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-[#14161f] text-zinc-400 hover:text-zinc-200 border border-[#232736]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>GUEST PROTOCOL LIST ({rsvps.length})</span>
          </span>
        </button>

        <button
          onClick={() => setAdminTab('wishlist')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all cursor-pointer ${
            adminTab === 'wishlist'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-[#14161f] text-zinc-400 hover:text-zinc-200 border border-[#232736]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5" />
            <span>WISHLIST STATUS ({stats?.reservedWishlistCount || 0}/8 RESERVED)</span>
          </span>
        </button>
      </div>

      {/* 1. GUEST REGISTRATION TAB */}
      {adminTab === 'guests' && (
        <div className="space-y-4">
          {/* Controls bar: Search & Filters */}
          <div className="bg-[#111319] border border-[#242836] p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest or message..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#161822] border border-[#272c3d] text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {(['ALL', 'YES', 'MAYBE', 'NO'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    statusFilter === filter
                      ? 'bg-amber-400 text-neutral-950 font-bold'
                      : 'bg-[#181b26] text-zinc-400 hover:text-zinc-200 border border-[#262b3a]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Registrations List */}
          <div className="bg-[#111319] border border-[#242836] rounded-2xl overflow-hidden shadow-xl">
            {filteredRsvps.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-sm font-sans">
                No matching RSVP protocols found.
              </div>
            ) : (
              <div className="divide-y divide-[#202432]">
                {filteredRsvps.map((rsvp) => (
                  <div
                    key={rsvp.id}
                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#141721] transition-colors"
                  >
                    {/* Left: Guest details */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-cinzel font-bold text-base text-zinc-100 tracking-wide">
                          {rsvp.name}
                        </h3>

                        {/* Status Badge */}
                        {rsvp.status === 'YES' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                            YES • {rsvp.guestCount} {rsvp.guestCount > 1 ? 'people' : 'person'}
                          </span>
                        )}
                        {rsvp.status === 'MAYBE' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                            MAYBE • {rsvp.guestCount} {rsvp.guestCount > 1 ? 'people' : 'person'}
                          </span>
                        )}
                        {rsvp.status === 'NO' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-[10px] font-mono font-bold">
                            DECLINED 💔
                          </span>
                        )}

                        {/* Check-in status tag */}
                        {rsvp.checkedIn && (
                          <span className="px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] font-mono">
                            ✓ ARRIVED
                          </span>
                        )}
                      </div>

                      {/* Guest Message */}
                      {rsvp.message && (
                        <p className="text-xs text-zinc-300 font-sans italic bg-[#171a24] p-2.5 rounded-lg border border-[#232736] max-w-xl">
                          "{rsvp.message}"
                        </p>
                      )}

                      {/* Timestamp */}
                      <div className="text-[10px] text-zinc-500 font-mono">
                        Registered: {new Date(rsvp.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-start md:self-center">
                      <button
                        onClick={() => handleToggleCheckIn(rsvp)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer ${
                          rsvp.checkedIn
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : 'bg-[#1c202c] hover:bg-[#252b3c] text-zinc-400 border border-[#2d3345]'
                        }`}
                        title="Toggle venue check-in status"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{rsvp.checkedIn ? 'Checked In' : 'Check In'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteRsvp(rsvp.id, rsvp.name)}
                        className="p-2 rounded-lg bg-[#1c202c] hover:bg-red-500/20 text-zinc-500 hover:text-red-400 border border-[#2d3345] transition-colors cursor-pointer"
                        title="Delete RSVP"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. WISHLIST MANAGEMENT TAB */}
      {adminTab === 'wishlist' && (
        <div className="space-y-4">
          <div className="bg-[#111319] border border-[#242836] p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="font-cinzel font-bold text-zinc-100 text-sm">
                Wishlist Items Live Inventory
              </h3>
              <p className="text-xs text-zinc-400">
                Anonymous zero-knowledge reservations. You can reset or monitor claims.
              </p>
            </div>
            <button
              onClick={handleResetWishlist}
              className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-mono cursor-pointer transition-colors"
            >
              Reset All Claims
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#111319] border border-[#242836] flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-cinzel font-bold text-sm text-zinc-100">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    {item.price}
                  </div>
                </div>

                <div className="text-right">
                  {item.isReserved ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                      RESERVED
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                      AVAILABLE
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Manual Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#111319] border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#242836]">
              <h3 className="font-cinzel font-bold text-zinc-100 text-base">
                Manual Guest Registration
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddManualGuest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Guest Name / Nickname
                </label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. Kasia Kowalska"
                  className="w-full px-3 py-2 rounded-lg bg-[#161822] border border-[#272c3d] text-sm text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Status
                  </label>
                  <select
                    value={manualStatus}
                    onChange={(e) => setManualStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#161822] border border-[#272c3d] text-sm text-zinc-100 focus:outline-none"
                  >
                    <option value="YES">YES (Attending)</option>
                    <option value="MAYBE">MAYBE</option>
                    <option value="NO">NO (Declined)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Headcount
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={manualGuests}
                    onChange={(e) => setManualGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#161822] border border-[#272c3d] text-sm text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Note / Message (Optional)
                </label>
                <input
                  type="text"
                  value={manualMessage}
                  onChange={(e) => setManualMessage(e.target.value)}
                  placeholder="Direct WhatsApp message note..."
                  className="w-full px-3 py-2 rounded-lg bg-[#161822] border border-[#272c3d] text-sm text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-lg bg-[#1a1d28] text-zinc-400 text-xs font-medium hover:bg-[#232736]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-gold-gradient text-neutral-950 text-xs font-cinzel font-bold hover:brightness-110"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
