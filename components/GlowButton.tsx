'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'cyan' | 'purple' | 'pink' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variants = {
  cyan: 'bg-[#00f5ff]/10 border border-[#00f5ff]/50 text-[#00f5ff] hover:bg-[#00f5ff]/20 hover:border-[#00f5ff] glow-cyan',
  purple: 'bg-[#bf00ff]/10 border border-[#bf00ff]/50 text-[#bf00ff] hover:bg-[#bf00ff]/20 hover:border-[#bf00ff] glow-purple',
  pink: 'bg-[#ff006e]/10 border border-[#ff006e]/50 text-[#ff006e] hover:bg-[#ff006e]/20 hover:border-[#ff006e] glow-pink',
  ghost: 'bg-transparent border border-white/10 text-white/60 hover:border-white/30 hover:text-white/80',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

export default function GlowButton({
  children,
  variant = 'cyan',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}: GlowButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`
        font-orbitron tracking-widest rounded-sm transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || loading}
      {...(props as object)}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          PROCESSING...
        </span>
      ) : children}
    </motion.button>
  );
}
