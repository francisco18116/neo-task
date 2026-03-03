export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  created_at: string;
}

export interface PriorityConfig {
  label: string;
  color: string;
  glow: string;
  border: string;
  text: string;
}

export const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  low: {
    label: 'LOW',
    color: '#00ff88',
    glow: 'glow-green',
    border: 'border-[#00ff88]/30',
    text: 'text-[#00ff88]',
  },
  medium: {
    label: 'MED',
    color: '#00f5ff',
    glow: 'glow-cyan',
    border: 'border-[#00f5ff]/30',
    text: 'text-[#00f5ff]',
  },
  high: {
    label: 'HIGH',
    color: '#ff006e',
    glow: 'glow-pink',
    border: 'border-[#ff006e]/30',
    text: 'text-[#ff006e]',
  },
};
