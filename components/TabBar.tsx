'use client';

import { motion } from 'framer-motion';
import { ActiveTab } from '@/lib/types';

interface TabBarProps {
  activeTab: ActiveTab;
  onChange: (tab: ActiveTab) => void;
}

const tabs: { id: ActiveTab; label: string }[] = [
  { id: 'todos', label: 'TODOS' },
  { id: 'calendar', label: 'CALENDAR' },
];

export default function TabBar({ activeTab, onChange }: TabBarProps) {
  return (
    <div className="relative z-10 px-6 pt-4 max-w-6xl mx-auto w-full">
      <div className="flex border border-[#00f5ff]/15 rounded-sm overflow-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex-1 px-6 py-3 font-orbitron text-[11px] tracking-widest transition-colors duration-200 z-10"
            style={{ color: activeTab === tab.id ? '#00f5ff' : 'rgba(255,255,255,0.3)' }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 bg-[#00f5ff]/10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
