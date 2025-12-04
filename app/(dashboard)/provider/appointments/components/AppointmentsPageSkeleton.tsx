import type { ReactNode } from 'react';

/**
 * Skeleton loader para la página de citas del proveedor
 */
export function AppointmentsPageSkeleton(): ReactNode {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-12">
      {/* Header skeleton */}
      <div className="mb-6 md:mb-8">
        <div className="h-10 w-64 bg-neutral-200 rounded-lg animate-pulse mb-2" />
        <div className="h-6 w-96 bg-neutral-200 rounded-lg animate-pulse" />
      </div>

      {/* Filters skeleton */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="h-12 flex-1 bg-neutral-200 rounded-xl animate-pulse" />
        <div className="h-12 w-48 bg-neutral-200 rounded-xl animate-pulse" />
        <div className="h-12 w-48 bg-neutral-200 rounded-xl animate-pulse" />
      </div>

      {/* Appointments grid skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border-2 border-neutral-200 p-6 animate-pulse"
          >
            <div className="h-6 w-3/4 bg-neutral-200 rounded mb-4" />
            <div className="h-4 w-full bg-neutral-200 rounded mb-2" />
            <div className="h-4 w-2/3 bg-neutral-200 rounded mb-4" />
            <div className="flex gap-2">
              <div className="h-10 flex-1 bg-neutral-200 rounded-lg" />
              <div className="h-10 w-24 bg-neutral-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

