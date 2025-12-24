'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { EditEmployeePageContent } from './components/EditEmployeePageContent';
import { EditEmployeePageSkeleton } from './components/EditEmployeePageSkeleton';

/**
 * Página de edición de empleado
 * Wrapper con Suspense para cumplir con Next.js 15
 */
export default function EditEmployeePage(): ReactNode {
  return (
    <Suspense fallback={<EditEmployeePageSkeleton />}>
      <EditEmployeePageContent />
    </Suspense>
  );
}

