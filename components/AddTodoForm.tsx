'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Priority, PRIORITY_CONFIG } from '@/lib/types';

interface AddTodoFormProps {
  onAdded: () => void;
}

export default function AddTodoForm({ onAdded }: AddTodoFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('todos').insert({
      title: title.trim(),
      priority,
      user_id: user.id,
      completed: false,
    });

    setTitle('');
    setPriority('medium');
    setLoading(false);
    setOpen(false);
    onAdded();
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  return (
    <>
      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-[#00f5ff]/10 border-2 border-[#00f5ff] text-[#00f5ff] flex items-center justify-center glow-cyan-strong animate-float"
        aria-label="Add task"
      >
        <Plus size={24} />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full border-2 border-[#00f5ff]/40 animate-ping" />
      </motion.button>

      {/* Slide-up Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 glass-strong rounded-t-lg p-6 pb-10 glow-cyan"
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-[#00f5ff]/30 rounded-full mx-auto mb-6" />

              <div className="flex items-center justify-between mb-6">
                <h2 className="font-orbitron text-sm font-bold text-[#00f5ff] tracking-widest text-glow-cyan">
                  &gt; NEW_TASK
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
                {/* Title */}
                <div>
                  <label className="block text-xs font-orbitron tracking-widest text-white/40 mb-2">
                    &gt; TASK_DESCRIPTION
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="neon-input w-full px-4 py-3 rounded-sm font-space text-sm"
                    placeholder="Describe your objective..."
                    autoFocus
                    required
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-orbitron tracking-widest text-white/40 mb-2">
                    &gt; PRIORITY_LEVEL
                  </label>
                  <div className="flex gap-3">
                    {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG[Priority]][]).map(
                      ([key, cfg]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setPriority(key)}
                          style={{
                            borderColor: priority === key ? cfg.color : `${cfg.color}33`,
                            color: cfg.color,
                            boxShadow: priority === key ? `0 0 12px ${cfg.color}44` : 'none',
                          }}
                          className={`flex-1 py-2 rounded-sm text-xs font-orbitron tracking-widest border transition-all duration-200 ${
                            priority === key ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                          }`}
                        >
                          {cfg.label}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="w-full py-3 font-orbitron text-sm tracking-widest bg-[#00f5ff]/10 border border-[#00f5ff]/50 text-[#00f5ff] rounded-sm hover:bg-[#00f5ff]/20 hover:border-[#00f5ff] transition-all duration-200 glow-cyan disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'TRANSMITTING...' : 'DEPLOY TASK'}
                </motion.button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-sm glass-strong border border-[#00f5ff]/40 text-[#00f5ff] font-orbitron text-xs tracking-widest glow-cyan"
          >
            Hi Santiago
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
