'use client';

import type { ReactNode } from 'react';

/**
 * Skeleton loader para la página de negocio del proveedor
 */
export function ProviderBusinessPageSkeleton(): ReactNode {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <div className="px-4 py-6 border-b border-white/10">
        <div className="h-8 bg-white/5 rounded w-32 mb-4 animate-pulse" />
        <div className="h-6 bg-white/5 rounded w-48 mb-2 animate-pulse" />
        <div className="h-4 bg-white/5 rounded w-32 animate-pulse" />
      </div>
      <div className="flex-1 px-4 py-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

