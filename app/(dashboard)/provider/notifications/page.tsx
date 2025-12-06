'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { NotificationsPageContent } from './components/NotificationsPageContent';
import { NotificationsPageSkeleton } from './components/NotificationsPageSkeleton';

/**
 * Página de notificaciones del proveedor
 * Muestra notificaciones de reservas, mensajes, reseñas, etc.
 */
export default function NotificationsPage(): ReactNode {
  return (
    <Suspense fallback={<NotificationsPageSkeleton />}>
      <NotificationsPageContent />
    </Suspense>
  );
}

