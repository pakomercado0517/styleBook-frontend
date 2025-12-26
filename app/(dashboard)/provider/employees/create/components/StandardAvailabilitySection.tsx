'use client';

import type { ReactNode } from 'react';
import { Calendar, Clock, Pencil } from 'lucide-react';

/**
 * Sección de disponibilidad semanal
 * Mobile: texto simple con icono de calendario
 * Desktop: card con tabla de disponibilidad semanal e icono de reloj, botón "Editar Horario"
 */
export function StandardAvailabilitySection(): ReactNode {
  const weeklySchedule = [
    { day: 'LUN', label: 'Lunes', hours: '9-18h' },
    { day: 'MAR', label: 'Martes', hours: '9-18h' },
    { day: 'MIE', label: 'Miércoles', hours: '9-18h' },
    { day: 'JUE', label: 'Jueves', hours: '9-18h' },
    { day: 'VIE', label: 'Viernes', hours: '9-15h' },
    { day: 'SAB', label: 'Sábado', hours: 'Libre', isFree: true },
    { day: 'DOM', label: 'Domingo', hours: 'Libre', isFree: true },
  ];

  const handleEditSchedule = (): void => {
    // TODO: Implementar edición de horario
    console.log('Editar horario');
  };

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-playfair">
            Disponibilidad Estándar
          </h2>
          <Calendar
            className="w-6 h-6 text-[#D4AF37]"
            strokeWidth={2}
          />
        </div>
        <p className="text-sm text-neutral-300 font-poppins">
          Lunes a Viernes, 9:00 - 18:00
        </p>
      </div>

      {/* Desktop - Card */}
      <div className="hidden md:block bg-white/5 rounded-xl p-6 border border-white/10">
        {/* Header con título, icono y botón */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#D4AF37]" strokeWidth={2} />
            <h2 className="text-xl font-bold text-white font-playfair">
              Disponibilidad Semanal
            </h2>
          </div>
          <button
            type="button"
            onClick={handleEditSchedule}
            className="text-sm font-semibold font-poppins transition-opacity hover:opacity-80 flex items-center gap-2"
            style={{ color: '#D4AF37' }}
          >
            <Pencil className="w-4 h-4" strokeWidth={2} />
            Editar Horario
          </button>
        </div>

        {/* Tabla de disponibilidad */}
        <div className="grid grid-cols-7 gap-2">
          {weeklySchedule.map((schedule) => (
            <div
              key={schedule.day}
              className={`p-3 rounded-xl border text-center ${
                schedule.isFree
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="text-xs font-semibold text-neutral-400 font-poppins mb-1">
                {schedule.day}
              </div>
              <div
                className={`text-sm font-medium font-poppins ${
                  schedule.isFree ? 'text-neutral-400' : 'text-white'
                }`}
              >
                {schedule.hours}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

