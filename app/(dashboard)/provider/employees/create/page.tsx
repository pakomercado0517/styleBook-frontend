'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { CreateEmployeePageContent } from './components/CreateEmployeePageContent';
import { CreateEmployeePageSkeleton } from './components/CreateEmployeePageSkeleton';

/**
 * Página de creación de empleado
 * Wrapper con Suspense para cumplir con Next.js 15
 */
export default function CreateEmployeePage(): ReactNode {
  return (
    <Suspense fallback={<CreateEmployeePageSkeleton />}>
      <CreateEmployeePageContent />
    </Suspense>
  );
}

