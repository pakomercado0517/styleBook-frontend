'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { ProviderBusinessPageContent } from './components/ProviderBusinessPageContent';
import { ProviderBusinessPageSkeleton } from './components/ProviderBusinessPageSkeleton';

/**
 * Página de negocio del proveedor
 * Muestra información del negocio: contacto, horarios, descripción, galería
 */
export default function ProviderBusinessPage(): ReactNode {
  return (
    <Suspense fallback={<ProviderBusinessPageSkeleton />}>
      <ProviderBusinessPageContent />
    </Suspense>
  );
}
