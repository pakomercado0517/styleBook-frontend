'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

type CalendarView = 'week' | 'month';

/**
 * Calendario de citas con toggle Semana/Mes
 */
export function AppointmentCalendar(): ReactNode {
  const [view, setView] = useState<CalendarView>('week');

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white font-playfair">
          Calendario de Citas
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
      <div className="h-64 flex items-center justify-center">
        <p className="text-neutral-400 font-poppins text-sm">
          Contenido del calendario aquí
        </p>
      </div>
    </div>
  );
}

