'use client';

import type { ReactNode } from 'react';
import { Clock } from 'lucide-react';

type DaySchedule = {
  start: string;
  end: string;
  isOpen: boolean;
};

interface OpeningHoursFieldsProps {
  schedules: Record<string, DaySchedule>;
  onScheduleChange: (day: string, schedule: DaySchedule) => void;
}

/**
 * Campos de horario de atención
 * Mobile: Lunes-Viernes, Sábado, Domingo
 * Desktop: Todos los días de la semana con estado Abierto/Cerrado
 */
export function OpeningHoursFields({
  schedules,
  onScheduleChange,
}: OpeningHoursFieldsProps): ReactNode {
  const days = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  const handleToggleDay = (day: string): void => {
    const current = schedules[day] || { start: '09:00', end: '19:00', isOpen: false };
    onScheduleChange(day, { ...current, isOpen: !current.isOpen });
  };

  const handleTimeChange = (day: string, field: 'start' | 'end', value: string): void => {
    const current = schedules[day] || { start: '09:00', end: '19:00', isOpen: true };
    onScheduleChange(day, { ...current, [field]: value });
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-white font-poppins mb-4 md:text-xl md:mb-6">
        Horarios de Atención
      </label>
      <div className="space-y-4">
        {/* Mobile: Agrupado */}
        <div className="md:hidden space-y-4">
          {/* Lunes - Viernes */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock
                className="w-5 h-5 shrink-0"
                style={{ color: '#D4AF37' }}
                strokeWidth={2}
              />
              <span className="text-sm text-white font-poppins">Lunes - Viernes</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={schedules.monday?.start || ''}
                onChange={(e) => handleTimeChange('monday', 'start', e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-poppins focus:outline-none focus:border-accent-500 transition-colors"
                aria-label="Hora de apertura Lunes-Viernes"
              />
              <span className="text-white font-poppins">-</span>
              <input
                type="time"
                value={schedules.monday?.end || ''}
                onChange={(e) => handleTimeChange('monday', 'end', e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-poppins focus:outline-none focus:border-accent-500 transition-colors"
                aria-label="Hora de cierre Lunes-Viernes"
              />
            </div>
          </div>

          {/* Sábado */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock
                className="w-5 h-5 shrink-0"
                style={{ color: '#D4AF37' }}
                strokeWidth={2}
              />
              <span className="text-sm text-white font-poppins">Sábado</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={schedules.saturday?.start || ''}
                onChange={(e) => handleTimeChange('saturday', 'start', e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-poppins focus:outline-none focus:border-accent-500 transition-colors"
                aria-label="Hora de apertura Sábado"
              />
              <span className="text-white font-poppins">-</span>
              <input
                type="time"
                value={schedules.saturday?.end || ''}
                onChange={(e) => handleTimeChange('saturday', 'end', e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-poppins focus:outline-none focus:border-accent-500 transition-colors"
                aria-label="Hora de cierre Sábado"
              />
            </div>
          </div>

          {/* Domingo - Cerrado */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock
                className="w-5 h-5 shrink-0"
                style={{ color: '#D4AF37' }}
                strokeWidth={2}
              />
              <span className="text-sm text-white font-poppins">Domingo</span>
            </div>
            <span className="text-sm text-neutral-400 font-poppins">Cerrado</span>
          </div>
        </div>

        {/* Desktop: Todos los días */}
        <div className="hidden md:block space-y-3">
          {days.map((day) => {
            const schedule = schedules[day.key] || { start: '', end: '', isOpen: false };
            return (
              <div key={day.key} className="flex items-center gap-4">
                <div className="w-32">
                  <span className="text-sm text-white font-poppins">{day.label}</span>
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="time"
                    value={schedule.start}
                    onChange={(e) => handleTimeChange(day.key, 'start', e.target.value)}
                    disabled={!schedule.isOpen}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-poppins focus:outline-none focus:border-accent-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Hora de apertura ${day.label}`}
                  />
                  <span className="text-white font-poppins">-</span>
                  <input
                    type="time"
                    value={schedule.end}
                    onChange={(e) => handleTimeChange(day.key, 'end', e.target.value)}
                    disabled={!schedule.isOpen}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-poppins focus:outline-none focus:border-accent-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Hora de cierre ${day.label}`}
                  />
                </div>
                <button
                  onClick={() => handleToggleDay(day.key)}
                  className="px-4 py-2 rounded-lg font-semibold font-poppins text-sm transition-colors shrink-0"
                  style={
                    schedule.isOpen
                      ? {
                          backgroundColor: '#D4AF37',
                          color: '#1A1A1A',
                        }
                      : {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: '#FFFFFF',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }
                  }
                  type="button"
                >
                  {schedule.isOpen ? 'Abierto' : 'Cerrado'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

