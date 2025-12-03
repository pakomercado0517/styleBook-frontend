'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { ServicesPageContent } from './components/ServicesPageContent';
import { ServicesPageSkeleton } from './components/ServicesPageSkeleton';

/**
 * Página de gestión de servicios del proveedor
 * Wrapper con Suspense para cumplir con Next.js 15
 */
export default function ProviderServicesPage(): ReactNode {
  return (
    <Suspense fallback={<ServicesPageSkeleton />}>
      <ServicesPageContent />
    </Suspense>
  );
}

