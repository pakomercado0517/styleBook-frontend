import type { ReactNode } from 'react';

/**
 * Skeleton loader para la página de servicios
 */
export function ServicesPageSkeleton(): ReactNode {
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

      {/* Services grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border-2 border-neutral-200 p-6 animate-pulse"
          >
            <div className="h-48 bg-neutral-200 rounded-xl mb-4" />
            <div className="h-6 w-3/4 bg-neutral-200 rounded mb-2" />
            <div className="h-4 w-full bg-neutral-200 rounded mb-2" />
            <div className="h-4 w-2/3 bg-neutral-200 rounded mb-4" />
            <div className="flex gap-2">
              <div className="h-10 flex-1 bg-neutral-200 rounded-lg" />
              <div className="h-10 w-10 bg-neutral-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

