'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Link } from 'lucide-react';
import { GoogleCalendarEvent } from '@/lib/types';

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const NEON_COLORS = ['#00f5ff', '#bf00ff', '#ff006e', '#00ff88'];

export default function CalendarView() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/google/events?year=${year}&month=${month}`);
      if (res.status === 401) {
        setConnected(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events ?? []);
        setConnected(true);
      }
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function prevMonth() {
    setDirection(-1);
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    setDirection(1);
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const eventsByDay = new Map<number, GoogleCalendarEvent[]>();
  events.forEach((ev) => {
    const dateStr = ev.start.dateTime ?? ev.start.date ?? '';
    if (!dateStr) return;
    const d = new Date(dateStr).getDate();
    if (!eventsByDay.has(d)) eventsByDay.set(d, []);
    eventsByDay.get(d)!.push(ev);
  });

  const monthName = new Date(year, month - 1)
    .toLocaleString('en-US', { month: 'long' })
    .toUpperCase();

  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() + 1 &&
    year === today.getFullYear();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-orbitron text-xl font-bold text-white tracking-widest">
            CAL <span className="text-[#00f5ff] text-glow-cyan">SYNC</span>
          </h2>
          <p className="font-space text-xs text-white/30 mt-0.5">
            {connected ? 'Google Calendar synced' : 'No calendar connected'}
          </p>
        </div>
        {connected && (
          <div className="flex items-center gap-1.5 text-[#00ff88]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-glow-pulse" />
            <span className="font-orbitron text-[9px] tracking-widest">CONNECTED</span>
          </div>
        )}
      </div>

      {/* Calendar grid */}
      <div className="glass rounded-sm">
        {/* Month navigation */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f5ff]/10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevMonth}
            className="p-1.5 rounded-sm border border-[#00f5ff]/20 text-[#00f5ff]/60 hover:text-[#00f5ff] hover:border-[#00f5ff]/50 transition-all"
          >
            <ChevronLeft size={16} />
          </motion.button>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${year}-${month}`}
              custom={direction}
              initial={{ opacity: 0, x: direction * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="font-orbitron text-sm font-bold text-[#00f5ff] text-glow-cyan tracking-widest"
            >
              {monthName} {year}
            </motion.div>
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextMonth}
            className="p-1.5 rounded-sm border border-[#00f5ff]/20 text-[#00f5ff]/60 hover:text-[#00f5ff] hover:border-[#00f5ff]/50 transition-all"
          >
            <ChevronRight size={16} />
          </motion.button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 border-b border-[#00f5ff]/5">
          {DAY_LABELS.map((d) => (
            <div
              key={d}
              className="p-2 text-center font-orbitron text-[9px] tracking-widest text-white/20"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const dayEvents = day ? (eventsByDay.get(day) ?? []) : [];
            return (
              <div
                key={idx}
                className={`min-h-[72px] p-2 border-r border-b border-[#00f5ff]/5 ${
                  day ? 'hover:bg-[#00f5ff]/3 transition-colors' : ''
                }`}
              >
                {day && (
                  <>
                    <div
                      className={`w-6 h-6 rounded-sm flex items-center justify-center font-orbitron text-[10px] mb-1 ${
                        isToday(day)
                          ? 'bg-[#00f5ff]/20 text-[#00f5ff] font-bold'
                          : 'text-white/40'
                      }`}
                      style={
                        isToday(day)
                          ? { boxShadow: '0 0 8px #00f5ff44', textShadow: '0 0 10px #00f5ff' }
                          : {}
                      }
                    >
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 3).map((ev, i) => (
                        <div
                          key={ev.id}
                          className="truncate font-space text-[9px] px-1 py-0.5 rounded-sm"
                          style={{
                            background: `${NEON_COLORS[i % NEON_COLORS.length]}18`,
                            color: NEON_COLORS[i % NEON_COLORS.length],
                            borderLeft: `2px solid ${NEON_COLORS[i % NEON_COLORS.length]}`,
                          }}
                          title={ev.summary}
                        >
                          {ev.summary}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="font-orbitron text-[8px] text-white/20 pl-1">
                          +{dayEvents.length - 3} MORE
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Connect CTA — shown when not loading and not connected */}
      {!loading && !connected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-sm p-8 flex flex-col items-center gap-4 text-center"
        >
          <div className="w-14 h-14 rounded-full border border-[#bf00ff]/30 flex items-center justify-center animate-float">
            <Calendar size={24} className="text-[#bf00ff]/50" />
          </div>
          <div>
            <p className="font-orbitron text-xs tracking-widest text-white/30 mb-1">
              NO CALENDAR LINKED
            </p>
            <p className="font-space text-xs text-white/20">
              Connect your Google Calendar to view events
            </p>
          </div>
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="/api/google/auth"
            className="flex items-center gap-2 px-5 py-2.5 font-orbitron text-[10px] tracking-widest border border-[#bf00ff]/50 text-[#bf00ff] rounded-sm hover:bg-[#bf00ff]/10 hover:border-[#bf00ff] transition-all glow-purple"
          >
            <Link size={12} />
            CONNECT GOOGLE CALENDAR
          </motion.a>
        </motion.div>
      )}
    </div>
  );
}
