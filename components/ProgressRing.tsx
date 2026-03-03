'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface ProgressRingProps {
  total: number;
  completed: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionVal, value, { duration: 0.8, ease: 'easeOut' });
    return controls.stop;
  }, [value, motionVal]);

  useEffect(() => {
    return rounded.on('change', (v) => {
      if (displayRef.current) displayRef.current.textContent = String(v);
    });
  }, [rounded]);

  return <span ref={displayRef}>0</span>;
}

export default function ProgressRing({ total, completed }: ProgressRingProps) {
  const radius = 70;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const offset = circumference - (percent / 100) * circumference;
  const pending = total - completed;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Ring */}
      <div className="relative">
        {/* Outer decorative ring */}
        <svg
          width={200}
          height={200}
          className="absolute inset-0 animate-spin-slow opacity-20"
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <rect
              key={angle}
              x={99}
              y={4}
              width={2}
              height={10}
              fill="#00f5ff"
              transform={`rotate(${angle} 100 100)`}
            />
          ))}
        </svg>

        <svg width={200} height={200} style={{ filter: 'drop-shadow(0 0 12px #00f5ff66)' }}>
          {/* Background track */}
          <circle
            cx={100}
            cy={100}
            r={radius}
            fill="none"
            stroke="rgba(0, 245, 255, 0.08)"
            strokeWidth={stroke}
          />
          {/* Progress arc */}
          <motion.circle
            cx={100}
            cy={100}
            r={radius}
            fill="none"
            stroke="#00f5ff"
            strokeWidth={stroke}
            strokeLinecap="butt"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ transformOrigin: '100px 100px', rotate: '-90deg' }}
          />
          {/* Inner glow circle */}
          <circle
            cx={100}
            cy={100}
            r={radius - stroke - 4}
            fill="rgba(0, 245, 255, 0.03)"
            stroke="rgba(0, 245, 255, 0.05)"
            strokeWidth={1}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-orbitron text-4xl font-black text-[#00f5ff] text-glow-cyan leading-none">
            <AnimatedNumber value={percent} />
            <span className="text-2xl">%</span>
          </div>
          <div className="font-orbitron text-[10px] text-white/30 tracking-widest mt-1">COMPLETE</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {[
          { label: 'TOTAL', value: total, color: 'text-white/70' },
          { label: 'DONE', value: completed, color: 'text-[#00f5ff]' },
          { label: 'PENDING', value: pending, color: 'text-[#bf00ff]' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="glass rounded-sm p-3 text-center"
          >
            <div className={`font-orbitron text-xl font-bold ${color}`}>{value}</div>
            <div className="font-orbitron text-[9px] text-white/30 tracking-widest mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
