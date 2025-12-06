'use client';

import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';

interface AddServiceButtonProps {
  onClick: () => void;
}

/**
 * Botón para añadir nuevo servicio
 * Diseño mobile: botón grande dorado con icono plus
 */
export function AddServiceButton({ onClick }: AddServiceButtonProps): ReactNode {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold font-poppins transition-colors"
      style={{
        backgroundColor: '#D4AF37',
        color: '#1A1A1A',
      }}
      type="button"
    >
      <Plus className="w-5 h-5" strokeWidth={2.5} />
      <span>Añadir Nuevo Servicio</span>
    </button>
  );
}

