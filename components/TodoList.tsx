'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Inbox } from 'lucide-react';
import TodoCard from './TodoCard';
import { Todo } from '@/lib/types';

interface TodoListProps {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  onChanged: () => void;
}

export default function TodoList({ todos, filter, onChanged }: TodoListProps) {
  const filtered = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-16 h-16 rounded-full border border-[#00f5ff]/20 flex items-center justify-center mb-4 animate-float">
          <Inbox size={28} className="text-[#00f5ff]/30" />
        </div>
        <p className="font-orbitron text-xs tracking-widest text-white/20">
          {filter === 'completed' ? 'NO COMPLETED TASKS' : 'NO ACTIVE TASKS'}
        </p>
        <p className="font-space text-xs text-white/10 mt-1">
          {filter === 'all' ? 'Deploy your first task below' : ''}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {filtered.map((todo, i) => (
          <motion.div
            key={todo.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.25, delay: i * 0.05, ease: 'easeOut' }}
          >
            <TodoCard todo={todo} onChanged={onChanged} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
