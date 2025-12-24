'use client';

import type { ReactNode } from 'react';
import { Copy, Pencil } from 'lucide-react';

export interface DaySchedule {
  day: string;
  status: 'active' | 'rest';
  startTime: string;
  endTime: string;
}

interface EmployeeAvailabilitySectionProps {
  schedules: DaySchedule[];
  onScheduleChange?: (day: string, schedule: Partial<Omit<DaySchedule, 'day'>>) => void;
  onCopySchedule?: () => void;
}

/**
 * Sección de disponibilidad semanal del empleado
 * Muestra tabla con días de la semana, estados y horarios
 */
export function EmployeeAvailabilitySection({
  schedules,
  onCopySchedule,
}: EmployeeAvailabilitySectionProps): ReactNode {
  const dayLabels: Record<string, string> = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  const handleEdit = (day: string): void => {
    // TODO: Implementar modal de edición de horario
    console.log('Editar horario de', day);
  };

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-playfair mb-2">
            Disponibilidad
          </h2>
          <p className="text-sm text-neutral-300 font-poppins">
            Configura el horario semanal recurrente.
          </p>
        </div>
        {onCopySchedule && (
          <button
            onClick={onCopySchedule}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium font-poppins hover:bg-white/10 transition-colors"
            type="button"
          >
            <Copy className="w-4 h-4" strokeWidth={2} />
            <span className="hidden md:inline">Copiar horario</span>
          </button>
        )}
      </div>

      {/* Tabla de disponibilidad - Solo desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-semibold text-white font-poppins">
                DÍA
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-white font-poppins">
                ESTADO
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-white font-poppins">
                INICIO
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-white font-poppins">
                FIN
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-white font-poppins">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr
                key={schedule.day}
                className="border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-4 text-base text-white font-poppins">
                  {dayLabels[schedule.day] || schedule.day}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`text-sm font-medium font-poppins ${
                      schedule.status === 'active'
                        ? 'text-green-400'
                        : 'text-neutral-400'
                    }`}
                  >
                    {schedule.status === 'active' ? '• Activo' : '• Descanso'}
                  </span>
                </td>
                <td className="py-4 px-4 text-base text-white font-poppins">
                  {schedule.status === 'active' ? schedule.startTime : '-'}
                </td>
                <td className="py-4 px-4 text-base text-white font-poppins">
                  {schedule.status === 'active' ? schedule.endTime : '-'}
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleEdit(schedule.day)}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                    aria-label={`Editar horario de ${dayLabels[schedule.day]}`}
                    type="button"
                  >
                    <Pencil className="w-4 h-4 text-white" strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lista mobile */}
      <div className="md:hidden space-y-3">
        {schedules.map((schedule) => (
          <div
            key={schedule.day}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-white font-poppins">
                {dayLabels[schedule.day] || schedule.day}
              </h3>
              <span
                className={`text-sm font-medium font-poppins ${
                  schedule.status === 'active'
                    ? 'text-green-400'
                    : 'text-neutral-400'
                }`}
              >
                {schedule.status === 'active' ? '• Activo' : '• Descanso'}
              </span>
            </div>
            {schedule.status === 'active' && (
              <div className="flex items-center gap-4 text-sm text-neutral-300 font-poppins">
                <span>{schedule.startTime} - {schedule.endTime}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

