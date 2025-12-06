'use client';

import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PersonalProfileHeaderProps {
  onSave: () => void;
  isSaving?: boolean;
}

/**
 * Header de la página de perfil personal
 * Mobile: flecha volver, título, botón guardar
 * Desktop: título "Gestionar Perfil", botón "Guardar Cambios" dorado
 */
export function PersonalProfileHeader({
  onSave,
  isSaving = false,
}: PersonalProfileHeaderProps): ReactNode {
  const router = useRouter();

  const handleBack = (): void => {
    router.back();
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="px-4 py-4 border-b border-white/10 md:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors shrink-0"
            aria-label="Volver"
            type="button"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
          <h1 className="text-xl font-bold text-white font-poppins">Mi Perfil Personal</h1>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl font-semibold font-poppins transition-colors shrink-0"
            style={{
              color: '#D4AF37',
            }}
            type="button"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-8 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white font-poppins">Gestionar Perfil</h1>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-2 rounded-xl font-semibold font-poppins transition-colors"
          style={{
            backgroundColor: '#D4AF37',
            color: '#1A1A1A',
          }}
          type="button"
        >
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </>
  );
}

