'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { ReviewsPageContent } from './components/ReviewsPageContent';
import { ReviewsPageSkeleton } from './components/ReviewsPageSkeleton';

/**
 * Página de reseñas del proveedor
 * Muestra reseñas de clientes y permite responder
 */
export default function ReviewsPage(): ReactNode {
  return (
    <Suspense fallback={<ReviewsPageSkeleton />}>
      <ReviewsPageContent />
    </Suspense>
  );
}

