'use client';

import type { ReactNode } from 'react';
import { TimeFrameFilters } from './TimeFrameFilters';

type TimeFrame = 'today' | 'weekly' | 'monthly' | 'annual' | 'custom';

interface AnalyticsHeaderProps {
  selectedTimeFrame: TimeFrame;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
}

/**
 * Header de la página de análisis
 * Mobile: solo título
 * Desktop: título a la izquierda, filtros a la derecha
 */
export function AnalyticsHeader({
  selectedTimeFrame,
  onTimeFrameChange,
}: AnalyticsHeaderProps): ReactNode {
  return (
    <>
      {/* Mobile Header */}
      <div className="px-4 py-6 border-b border-white/10 md:hidden">
        <h1 className="text-2xl font-bold text-white font-poppins">Análisis</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-8 py-6 border-b border-white/10">
        <h1 className="text-3xl font-bold text-white font-poppins">Análisis</h1>
        <TimeFrameFilters
          selectedTimeFrame={selectedTimeFrame}
          onTimeFrameChange={onTimeFrameChange}
        />
      </div>
    </>
  );
}

