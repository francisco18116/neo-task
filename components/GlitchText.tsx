'use client';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span>{text}</span>
      <span
        aria-hidden="true"
        className="animate-glitch-1 absolute inset-0 pointer-events-none"
        style={{ color: '#00f5ff', textShadow: '2px 0 #bf00ff' }}
      >
        {text}
      </span>
      <span
        aria-hidden="true"
        className="animate-glitch-2 absolute inset-0 pointer-events-none"
        style={{ color: '#ff006e', textShadow: '-2px 0 #00f5ff' }}
      >
        {text}
      </span>
    </span>
  );
}
