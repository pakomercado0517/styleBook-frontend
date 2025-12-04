'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { AppointmentsPageContent } from './components/AppointmentsPageContent';
import { AppointmentsPageSkeleton } from './components/AppointmentsPageSkeleton';

/**
 * Página de gestión de citas del proveedor
 * Wrapper con Suspense para cumplir con Next.js 15
 */
export default function ProviderAppointmentsPage(): ReactNode {
  return (
    <Suspense fallback={<AppointmentsPageSkeleton />}>
      <AppointmentsPageContent />
    </Suspense>
  );
}

