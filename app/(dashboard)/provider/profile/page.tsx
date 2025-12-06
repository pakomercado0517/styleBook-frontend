'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { PersonalProfilePageContent } from './components/PersonalProfilePageContent';
import { PersonalProfilePageSkeleton } from './components/PersonalProfilePageSkeleton';

/**
 * Página de perfil personal - Proveedor
 * Mobile: Template según imagen (foto, email, teléfono, cambiar contraseña)
 * Desktop: Se puede mantener el diseño anterior o adaptar
 */
export default function ProviderProfilePage(): ReactNode {
  return (
    <Suspense fallback={<PersonalProfilePageSkeleton />}>
      <PersonalProfilePageContent />
    </Suspense>
  );
}
