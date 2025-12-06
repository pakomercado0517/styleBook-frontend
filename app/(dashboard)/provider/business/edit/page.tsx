'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { EditBusinessPageContent } from './components/EditBusinessPageContent';
import { EditBusinessPageSkeleton } from './components/EditBusinessPageSkeleton';

/**
 * Página de edición del negocio del proveedor
 * Wrapper con Suspense para cumplir con Next.js 15
 */
export default function EditBusinessPage(): ReactNode {
  return (
    <Suspense fallback={<EditBusinessPageSkeleton />}>
      <EditBusinessPageContent />
    </Suspense>
  );
}

