'use client';

import { motion } from 'framer-motion';
import { Trash2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Todo, PRIORITY_CONFIG } from '@/lib/types';

interface TodoCardProps {
  todo: Todo;
  onChanged: () => void;
}

export default function TodoCard({ todo, onChanged }: TodoCardProps) {
  const supabase = createClient();
  const cfg = PRIORITY_CONFIG[todo.priority];

  async function toggleComplete() {
    await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', todo.id);
    onChanged();
  }

  async function deleteTodo() {
    await supabase.from('todos').delete().eq('id', todo.id);
    onChanged();
  }

  return (
    <motion.div
      layout
      animate={{ opacity: todo.completed ? 0.5 : 1 }}
      transition={{ duration: 0.2 }}
      className={`glass rounded-sm p-4 flex items-center gap-4 group transition-all duration-300 hover:border-opacity-40 ${
        todo.completed ? 'filter grayscale-[50%]' : ''
      }`}
      style={{
        borderColor: todo.completed ? 'rgba(255,255,255,0.05)' : `${cfg.color}22`,
        boxShadow: todo.completed ? 'none' : `0 0 15px ${cfg.color}11, inset 0 0 15px ${cfg.color}06`,
      }}
    >
      {/* Priority indicator bar */}
      <div
        className="w-0.5 self-stretch rounded-full flex-shrink-0"
        style={{
          background: todo.completed ? 'rgba(255,255,255,0.1)' : cfg.color,
          boxShadow: todo.completed ? 'none' : `0 0 8px ${cfg.color}`,
        }}
      />

      {/* Checkbox */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleComplete}
        className="flex-shrink-0 w-6 h-6 rounded-sm border flex items-center justify-center transition-all duration-200"
        style={{
          borderColor: todo.completed ? cfg.color : `${cfg.color}50`,
          background: todo.completed ? `${cfg.color}20` : 'transparent',
          boxShadow: todo.completed ? `0 0 10px ${cfg.color}44` : 'none',
        }}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12 }}
          >
            <Check size={12} style={{ color: cfg.color }} />
          </motion.div>
        )}
      </motion.button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-space text-sm transition-all duration-300 truncate ${
            todo.completed ? 'line-through text-white/30' : 'text-white/90'
          }`}
        >
          {todo.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="font-orbitron text-[9px] tracking-widest px-1.5 py-0.5 rounded-sm border"
            style={{
              color: cfg.color,
              borderColor: `${cfg.color}33`,
              background: `${cfg.color}0f`,
            }}
          >
            {cfg.label}
          </span>
          <span className="text-[10px] text-white/20 font-space">
            {new Date(todo.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Delete button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={deleteTodo}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-[#ff006e]/40 hover:text-[#ff006e] transition-all duration-200"
        aria-label="Delete task"
      >
        <Trash2 size={15} />
      </motion.button>
    </motion.div>
  );
}
