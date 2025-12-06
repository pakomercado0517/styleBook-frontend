'use client';

import type { ReactNode } from 'react';

type TimeFrame = 'today' | 'weekly' | 'monthly' | 'annual' | 'custom';

interface TimeFrameFiltersProps {
  selectedTimeFrame: TimeFrame;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
}

/**
 * Filtros de período de tiempo
 * Mobile: Botones horizontales scrollables
 * Desktop: Botones en header
 */
export function TimeFrameFilters({
  selectedTimeFrame,
  onTimeFrameChange,
}: TimeFrameFiltersProps): ReactNode {
  const timeFrames: Array<{ value: TimeFrame; label: string }> = [
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' },
    { value: 'annual', label: 'Anual' },
    { value: 'custom', label: 'Personalizado' },
  ];

  return (
    <>
      {/* Mobile: Scroll horizontal */}
      <div className="flex gap-3 px-4 py-4 overflow-x-auto scrollbar-hide md:hidden">
        {timeFrames.map((timeFrame) => {
          const isSelected = selectedTimeFrame === timeFrame.value;
          return (
            <button
              key={timeFrame.value}
              onClick={() => onTimeFrameChange(timeFrame.value)}
              className="px-6 py-3 rounded-xl font-semibold font-poppins transition-colors whitespace-nowrap shrink-0"
              style={
                isSelected
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
              {timeFrame.label}
            </button>
          );
        })}
      </div>

      {/* Desktop: Botones en header */}
      <div className="hidden md:flex items-center gap-3">
        {timeFrames.map((timeFrame) => {
          const isSelected = selectedTimeFrame === timeFrame.value;
          return (
            <button
              key={timeFrame.value}
              onClick={() => onTimeFrameChange(timeFrame.value)}
              className="px-4 py-2 rounded-xl font-semibold font-poppins transition-colors text-sm"
              style={
                isSelected
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
              {timeFrame.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

