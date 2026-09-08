import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle, AlertCircle, Loader2, Send, Beer, Laugh, Sparkles } from 'lucide-react';
import { RsvpStatus, RsvpSubmission } from '../types';

interface RsvpSectionProps {
  onRsvpSubmitted?: (rsvp: RsvpSubmission) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ onRsvpSubmitted }) => {
  const [status, setStatus] = useState<RsvpStatus>('YES');
  const [name, setName] = useState('');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRsvp, setSubmittedRsvp] = useState<RsvpSubmission | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please tell Dad who you are (enter your name)!');
      return;
    }

    setError(null);
    setLoading(true);

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

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit RSVP.');
      }

      setSubmittedRsvp(data.rsvp);
      if (onRsvpSubmitted) {
        onRsvpSubmitted(data.rsvp);
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
      setError(err.message || "Error reaching Dad's server.");
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

  return (
    <section id="rsvp" className="py-12 px-4 relative">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e293b] border-2 border-[#22C55E] text-[#22C55E] text-xs font-arcade uppercase tracking-wider sticker-badge">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MANDATORY ROLL CALL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-cinzel font-black tracking-wide text-retro-gold">
            ARE YOU IN?
          </h2>
          <p className="text-sm sm:text-base text-amber-200/90 font-playfair italic">
            "Are you coming or do I have to come over there and ask why?"
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#111c35] border-2 border-[#F5B942] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!submittedRsvp ? (
              <form onSubmit={handleSubmit} className="space-y-6" id="rsvp-form">
                {/* 1. ARE YOU COMING? */}
                <div>
                  <label className="block text-xs font-arcade uppercase tracking-widest text-[#F5B942] mb-3 font-bold">
                    SELECT YOUR ATTENDANCE STATUS
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
                          YES — Obviously
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
                          MAYBE — I'm negotiating
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
                          NO — I've disappointed Daddy
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
                      Your Full Name
                    </label>
                    <input
                      id="rsvp-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Favorite Friend"
                      className="w-full px-4 py-3 rounded-xl bg-[#0d1527] border-2 border-[#1e2e54] focus:border-[#F5B942] focus:outline-none text-sm text-[#FFF7E6] placeholder-zinc-500 font-sans"
                    />
                  </div>

                  <div>
                    <label htmlFor="rsvp-headcount" className="block text-xs font-arcade uppercase tracking-wider text-[#38BDF8] mb-2 font-bold">
                      Headcount
                    </label>
                    <select
                      id="rsvp-headcount"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-[#0d1527] border-2 border-[#1e2e54] focus:border-[#F5B942] focus:outline-none text-sm text-[#FFF7E6] font-sans cursor-pointer"
                    >
                      <option value={1}>Just me (1)</option>
                      <option value={2}>Me + 1 (+1)</option>
                      <option value={3}>Squad (3)</option>
                      <option value={4}>Dad Crew (4+)</option>
                    </select>
                  </div>
                </div>

                {/* 3. MESSAGE OR DAD JOKE */}
                <div>
                  <label htmlFor="rsvp-message" className="block text-xs font-arcade uppercase tracking-wider text-[#FF8A3D] mb-2 font-bold">
                    Message or Dad Joke for Alan (Optional)
                  </label>
                  <textarea
                    id="rsvp-message"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hit Alan with your best Dad joke or birthday wish..."
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
                      <span>TRANSMITTING TO DAD...</span>
                    </>
                  ) : (
                    <span>CONFIRM MY RSVP (SUBMIT) 🚀</span>
                  )}
                </button>
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
                    DADDY HAS BEEN NOTIFIED.
                  </span>
                  <h4 className="text-xl sm:text-2xl font-cinzel font-black text-[#FFF7E6]">
                    Thanks, {submittedRsvp.name}!
                  </h4>
                </div>

                <p className="text-sm sm:text-base text-amber-200 font-playfair italic max-w-sm mx-auto">
                  "Excellent. Your presence has been officially approved. Now don't forget to show up on Friday, Sept 18!"
                </p>

                <div className="pt-3">
                  <button
                    onClick={handleReset}
                    className="px-5 py-2 rounded-xl bg-[#172554] hover:bg-[#1e2e54] border border-[#38BDF8] text-xs font-space text-sky-200 transition-colors cursor-pointer"
                  >
                    Edit Response
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
