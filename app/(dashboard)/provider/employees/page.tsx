'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { EmployeesPageContent } from './components/EmployeesPageContent';
import { EmployeesPageSkeleton } from './components/EmployeesPageSkeleton';

/**
 * Página de gestión de empleados del proveedor
 * Wrapper con Suspense para cumplir con Next.js 15
 */
export default function ProviderEmployeesPage(): ReactNode {
  return (
    <Suspense fallback={<EmployeesPageSkeleton />}>
      <EmployeesPageContent />
    </Suspense>
  );
}

