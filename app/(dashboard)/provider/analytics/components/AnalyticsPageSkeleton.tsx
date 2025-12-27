'use client';

import type { ReactNode } from 'react';

/**
 * Skeleton loader para la página de análisis
 */
export function AnalyticsPageSkeleton(): ReactNode {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <div className="px-4 py-6 border-b border-white/10">
        <div className="h-8 bg-white/5 rounded w-32 animate-pulse" />
      </div>
      <div className="flex-1 px-4 py-6 space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

