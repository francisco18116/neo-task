'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import GlowButton from './GlowButton';

const TITLE_CHARS = 'NEOTASK_';

export default function AuthForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayedTitle, setDisplayedTitle] = useState('');
  const supabase = createClient();

  // Typing effect for title
  useEffect(() => {
    let i = 0;
    setDisplayedTitle('');
    const interval = setInterval(() => {
      if (i < TITLE_CHARS.length) {
        setDisplayedTitle(TITLE_CHARS.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message.toUpperCase());
      } else {
        window.location.href = '/dashboard';
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message.toUpperCase());
      } else {
        setSuccess('ACCOUNT CREATED. CHECK YOUR EMAIL TO VERIFY.');
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md glass-strong rounded-sm p-8 glow-cyan"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#00f5ff] animate-glow-pulse" />
            <div className="w-2 h-2 rounded-full bg-[#bf00ff]" />
            <div className="w-2 h-2 rounded-full bg-[#ff006e]" />
          </div>
          <h1 className="font-orbitron text-3xl font-black text-glow-cyan mt-4">
            {displayedTitle}
            <span className="animate-cursor-blink text-[#00f5ff]">|</span>
          </h1>
          <p className="text-white/30 text-xs font-orbitron tracking-widest mt-1">
            ADVANCED TASK MANAGEMENT SYSTEM v2.0
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex mb-6 border border-[#00f5ff]/20 rounded-sm overflow-hidden">
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-xs font-orbitron tracking-widest transition-all duration-200 ${
                mode === m
                  ? 'bg-[#00f5ff]/15 text-[#00f5ff] text-glow-cyan'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              {m === 'login' ? 'SIGN IN' : 'REGISTER'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-orbitron tracking-widest text-white/40 mb-1.5">
              &gt; EMAIL_ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="neon-input w-full px-4 py-3 rounded-sm font-space text-sm"
              placeholder="user@domain.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-orbitron tracking-widest text-white/40 mb-1.5">
              &gt; SECURITY_KEY
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neon-input w-full px-4 py-3 rounded-sm font-space text-sm"
              placeholder="••••••••••••"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {/* Error / Success */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-[#ff006e] text-xs font-orbitron tracking-wide border border-[#ff006e]/30 bg-[#ff006e]/5 px-3 py-2 rounded-sm glow-pink"
              >
                ⚠ {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-[#00ff88] text-xs font-orbitron tracking-wide border border-[#00ff88]/30 bg-[#00ff88]/5 px-3 py-2 rounded-sm glow-green"
              >
                ✓ {success}
              </motion.div>
            )}
          </AnimatePresence>

          <GlowButton
            type="submit"
            variant="cyan"
            size="lg"
            loading={loading}
            className="w-full justify-center"
          >
            {mode === 'login' ? 'INITIALIZE SESSION' : 'CREATE ACCOUNT'}
          </GlowButton>
        </form>

        {/* Footer */}
        <p className="text-center text-white/20 text-xs font-orbitron tracking-widest mt-6">
          SECURE • ENCRYPTED • FUTURISTIC
        </p>
      </motion.div>
    </div>
  );
}
