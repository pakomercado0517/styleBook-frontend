'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

type CalendarView = 'week' | 'month';

/**
 * Calendario interactivo para desktop
 * Muestra vista de semana o mes
 */
export function InteractiveCalendar(): ReactNode {
  const [view, setView] = useState<CalendarView>('month');

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white font-playfair">
          Calendario Interactivo
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-lg text-sm font-poppins transition-colors ${
              view === 'week'
                ? 'bg-accent-500 text-primary-900 font-semibold'
                : 'bg-white/5 text-white border border-white/10'
            }`}
            type="button"
          >
            Semana
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded-lg text-sm font-poppins transition-colors ${
              view === 'month'
                ? 'bg-accent-500 text-primary-900 font-semibold'
                : 'bg-white/5 text-white border border-white/10'
            }`}
            type="button"
          >
            Mes
          </button>
        </div>
      </div>

      {/* Área del calendario */}
      <div className="flex-1 flex items-center justify-center bg-white/5 rounded-lg border border-white/10">
        <p className="text-neutral-400 font-poppins text-sm">
          Vista del calendario interactivo
        </p>
      </div>
    </div>
  );
}

