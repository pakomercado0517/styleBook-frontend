'use client';

import type { ReactNode } from 'react';

/**
 * Skeleton de carga para la página de edición de empleado
 */
export function EditEmployeePageSkeleton(): ReactNode {
  return (
    <div className="min-h-screen bg-[#201d12] flex flex-col">
      <div className="px-4 py-4 border-b border-white/10">
        <div className="h-6 w-32 bg-white/10 rounded animate-pulse"></div>
      </div>
      <div className="flex-1 px-4 py-6 space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 rounded-full bg-white/10 animate-pulse"></div>
          <div className="h-4 w-40 bg-white/10 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-48 bg-white/10 rounded animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-12 bg-white/10 rounded animate-pulse"></div>
            <div className="h-12 bg-white/10 rounded animate-pulse"></div>
            <div className="h-12 bg-white/10 rounded animate-pulse"></div>
            <div className="h-12 bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

