'use client';

import type { ReactNode } from 'react';
import { Clock } from 'lucide-react';

interface OpeningHoursSectionProps {
  openingTime?: string;
  closingTime?: string;
}

/**
 * Sección de horario de atención
 * Muestra horarios de lunes a domingo
 */
export function OpeningHoursSection({
  openingTime,
  closingTime,
}: OpeningHoursSectionProps): ReactNode {
  const formatTime = (time?: string): string => {
    if (!time) return '--:--';
    return time;
  };

  const days = [
    { label: 'Lunes - Viernes', isWeekend: false },
    { label: 'Sábado', isWeekend: true },
    { label: 'Domingo', isWeekend: true, isClosed: true },
  ];

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <h3 className="text-lg font-bold text-white font-poppins mb-4">
        Horario de Atención
      </h3>
      <div className="space-y-3">
        {days.map((day) => (
          <div key={day.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock
                className="w-5 h-5 flex-shrink-0"
                style={{ color: '#D4AF37' }}
                strokeWidth={2}
              />
              <span className="text-sm text-white font-poppins">{day.label}</span>
            </div>
            {day.isClosed ? (
              <span className="text-sm text-neutral-400 font-poppins">Cerrado</span>
            ) : (
              <span className="text-sm text-white font-poppins">
                {openingTime && closingTime
                  ? `${formatTime(openingTime)} - ${formatTime(closingTime)}`
                  : '--:-- - --:--'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

