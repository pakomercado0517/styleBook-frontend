'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/Button';
import type { AppointmentStatus } from '@/lib/types/appointments';

interface AppointmentsFiltersProps {
  selectedStatus: AppointmentStatus | 'all';
  onStatusChange: (status: AppointmentStatus | 'all') => void;
  selectedDateRange: {
    start?: string;
    end?: string;
  };
  onDateRangeChange: (range: { start?: string; end?: string }) => void;
}

const statusFilters: Array<{
  value: AppointmentStatus | 'all';
  label: string;
  icon: string;
}> = [
  { value: 'all', label: 'Todas', icon: '✨' },
  { value: 'pending', label: 'Pendientes', icon: '⏳' },
  { value: 'confirmed', label: 'Confirmadas', icon: '✅' },
  { value: 'completed', label: 'Completadas', icon: '✔️' },
  { value: 'cancelled', label: 'Canceladas', icon: '❌' },
];

/**
 * AppointmentsFilters - Filtros para citas
 * Permite filtrar por estado y rango de fechas
 */
export const AppointmentsFilters = ({
  selectedStatus,
  onStatusChange,
  selectedDateRange,
  onDateRangeChange,
}: AppointmentsFiltersProps): ReactNode => {
  const handleStatusClick = (status: AppointmentStatus | 'all'): void => {
    onStatusChange(status);
  };

  const handleStatusKeyDown = (
    e: React.KeyboardEvent,
    status: AppointmentStatus | 'all'
  ): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStatusClick(status);
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onDateRangeChange({
      ...selectedDateRange,
      start: e.target.value || undefined,
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onDateRangeChange({
      ...selectedDateRange,
      end: e.target.value || undefined,
    });
  };

  const handleClearDates = (): void => {
    onDateRangeChange({});
  };

  const hasDateFilter = selectedDateRange.start || selectedDateRange.end;

  return (
    <div className="space-y-6">
      {/* Filtros por Estado */}
      <div>
        <h3 className="font-poppins font-semibold text-primary-800 mb-3 text-sm md:text-base">
          Estado
        </h3>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => {
            const isActive = selectedStatus === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => handleStatusClick(filter.value)}
                onKeyDown={(e) => handleStatusKeyDown(e, filter.value)}
                className={`
                  px-4 py-2 rounded-full
                  font-poppins text-sm font-medium
                  border-2 transition-all duration-200
                  min-h-[44px] flex items-center gap-2
                  ${
                    isActive
                      ? 'bg-accent-500 text-primary-900 border-accent-600 shadow-md'
                      : 'bg-white text-primary-800 border-neutral-200 hover:border-accent-500/50'
                  }
                `}
                type="button"
                aria-label={`Filtrar por ${filter.label}`}
                aria-pressed={isActive}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtros por Fecha */}
      <div>
        <h3 className="font-poppins font-semibold text-primary-800 mb-3 text-sm md:text-base">
          Rango de Fechas
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="start-date"
              className="block text-sm font-medium text-primary-800 mb-2"
            >
              Desde
            </label>
            <input
              id="start-date"
              type="date"
              value={selectedDateRange.start || ''}
              onChange={handleStartDateChange}
              className="
                w-full px-4 py-3
                bg-white border-2 border-neutral-200
                rounded-lg
                font-poppins text-sm
                text-primary-800
                hover:border-accent-500/50
                focus:border-accent-500
                focus:outline-none
                focus:ring-2 focus:ring-accent-500/20
                transition-all duration-200
              "
              aria-label="Fecha de inicio"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="end-date"
              className="block text-sm font-medium text-primary-800 mb-2"
            >
              Hasta
            </label>
            <input
              id="end-date"
              type="date"
              value={selectedDateRange.end || ''}
              onChange={handleEndDateChange}
              className="
                w-full px-4 py-3
                bg-white border-2 border-neutral-200
                rounded-lg
                font-poppins text-sm
                text-primary-800
                hover:border-accent-500/50
                focus:border-accent-500
                focus:outline-none
                focus:ring-2 focus:ring-accent-500/20
                transition-all duration-200
              "
              aria-label="Fecha de fin"
            />
          </div>
          {hasDateFilter && (
            <div className="flex items-end">
              <button
                onClick={handleClearDates}
                className="
                  px-4 py-3
                  bg-white border-2 border-neutral-200
                  rounded-lg
                  font-poppins text-sm font-medium
                  text-primary-800
                  hover:border-accent-500/50
                  transition-all duration-200
                  min-h-[44px]
                "
                type="button"
                aria-label="Limpiar filtros de fecha"
              >
                Limpiar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
