'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Wifi } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import GlitchText from './GlitchText';

interface HudBarProps {
  userEmail: string;
}

export default function HudBar({ userEmail }: HudBarProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const supabase = createClient();

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase());
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="glass-strong border-b border-[#00f5ff]/10 px-6 py-3 flex items-center justify-between relative z-10"
    >
      {/* Left: App name */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#00f5ff] animate-glow-pulse" />
        <h1 className="font-orbitron text-lg font-black text-glow-cyan tracking-widest">
          <GlitchText text="NEOTASK" />
        </h1>
        <span className="font-orbitron text-[10px] text-white/20 tracking-widest hidden sm:block">
          v2.0
        </span>
      </div>

      {/* Center: Date + Time */}
      <div className="flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
        <div className="text-center hidden sm:block">
          <div className="font-orbitron text-xs text-white/30 tracking-widest">{date}</div>
          <div className="font-orbitron text-base font-bold text-[#00f5ff] text-glow-cyan tabular-nums">
            {time}
          </div>
        </div>
      </div>

      {/* Right: User + Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[#00ff88]">
          <Wifi size={12} />
          <span className="font-orbitron text-[9px] tracking-widest hidden sm:block">ONLINE</span>
        </div>
        <div className="hidden sm:block text-right">
          <div className="font-orbitron text-[9px] text-white/20 tracking-widest">OPERATOR</div>
          <div className="font-space text-xs text-white/60 truncate max-w-32">{userEmail}</div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#ff006e]/30 text-[#ff006e]/60 hover:text-[#ff006e] hover:border-[#ff006e] transition-all duration-200 font-orbitron text-[10px] tracking-widest"
        >
          <LogOut size={12} />
          <span className="hidden sm:block">EXIT</span>
        </motion.button>
      </div>
    </motion.header>
  );
}
