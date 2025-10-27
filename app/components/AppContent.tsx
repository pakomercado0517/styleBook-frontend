'use client';

import { Toaster } from 'sonner';
import { useSessionValidator } from '@/lib/hooks/useSessionValidator';
import { useAuthEvents } from '@/lib/hooks/useAuthEvents';

interface AppContentProps {
  children: React.ReactNode;
}

export function AppContent({ children }: AppContentProps) {
  // Usar hooks de autenticación
  useSessionValidator();
  useAuthEvents();

  return (
    <>
      {children}
      {/* Toast notifications */}
      <Toaster position="top-right" richColors />
    </>
  );
}
