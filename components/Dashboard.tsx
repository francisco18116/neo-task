'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Todo, ActiveTab } from '@/lib/types';
import HudBar from './HudBar';
import ProgressRing from './ProgressRing';
import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';
import GridBackground from './GridBackground';
import TabBar from './TabBar';
import CalendarView from './CalendarView';
import GlitchText from './GlitchText';

type Filter = 'all' | 'active' | 'completed';


interface DashboardProps {
  initialTodos: Todo[];
  userEmail: string;
}

export default function Dashboard({ initialTodos, userEmail }: DashboardProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<Filter>('all');
  const [activeTab, setActiveTab] = useState<ActiveTab>('todos');
  const supabase = createClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'calendar') setActiveTab('calendar');
  }, []);

  const fetchTodos = useCallback(async () => {
    const { data } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setTodos(data as Todo[]);
  }, [supabase]);

  const completed = todos.filter((t) => t.completed).length;

  const filters: Filter[] = ['all', 'active', 'completed'];

  return (
    <div className="relative min-h-screen flex flex-col">
      <GridBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <HudBar userEmail={userEmail} />
        <TabBar activeTab={activeTab} onChange={setActiveTab} />

        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 mt-4">

            {/* Left Panel */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col gap-6"
            >
              {/* Progress Ring */}
              <div className="glass rounded-sm p-6">
                <div className="font-orbitron text-[10px] text-white/30 tracking-widest mb-4">
                  &gt; MISSION_STATUS
                </div>
                <ProgressRing total={todos.length} completed={completed} />
              </div>

              {/* Priority Legend */}
              <div className="glass rounded-sm p-5">
                <div className="font-orbitron text-[10px] text-white/30 tracking-widest mb-4">
                  &gt; PRIORITY_KEY
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'HIGH PRIORITY', color: '#ff006e' },
                    { label: 'MEDIUM PRIORITY', color: '#00f5ff' },
                    { label: 'LOW PRIORITY', color: '#00ff88' },
                  ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                      />
                      <span className="font-orbitron text-[10px] tracking-widest text-white/40">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System status */}
              <div className="glass rounded-sm p-5">
                <div className="font-orbitron text-[10px] text-white/30 tracking-widest mb-3">
                  &gt; SYSTEM
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'DATABASE', status: 'ONLINE', color: '#00ff88' },
                    { label: 'AUTH', status: 'ACTIVE', color: '#00ff88' },
                    { label: 'SYNC', status: 'LIVE', color: '#00f5ff' },
                  ].map(({ label, status, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="font-orbitron text-[9px] text-white/30 tracking-widest">{label}</span>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full animate-glow-pulse"
                          style={{ background: color }}
                        />
                        <span className="font-orbitron text-[9px] tracking-widest" style={{ color }}>
                          {status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>

            {/* Right: Todo / Calendar Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {activeTab === 'todos' ? (
                  <motion.div
                    key="todos"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="font-orbitron text-xl font-bold text-white tracking-widest">
                          TASK{' '}
                          <GlitchText text="QUEUE" className="text-[#00f5ff] text-glow-cyan" />
                        </h2>
                        <p className="font-space text-xs text-white/30 mt-0.5">
                          {todos.length} tasks loaded into system
                        </p>
                      </div>

                      {/* Filter tabs */}
                      <div className="flex border border-[#00f5ff]/15 rounded-sm overflow-hidden">
                        {filters.map((f) => (
                          <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 font-orbitron text-[10px] tracking-widest transition-all duration-200 ${
                              filter === f
                                ? 'bg-[#00f5ff]/15 text-[#00f5ff]'
                                : 'text-white/30 hover:text-white/60'
                            }`}
                          >
                            {f.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Todo list */}
                    <TodoList todos={todos} filter={filter} onChanged={fetchTodos} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CalendarView />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Floating add button — only in todos tab */}
      {activeTab === 'todos' && <AddTodoForm onAdded={fetchTodos} />}
    </div>
  );
}
