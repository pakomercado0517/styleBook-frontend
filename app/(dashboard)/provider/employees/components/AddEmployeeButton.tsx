'use client';

import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';

interface AddEmployeeButtonProps {
  onClick: () => void;
}

/**
 * Botón para añadir nuevo empleado
 * Diseño mobile: botón grande dorado con icono plus
 */
export function AddEmployeeButton({ onClick }: AddEmployeeButtonProps): ReactNode {
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
      <span>Añadir Nuevo Empleado</span>
    </button>
  );
}

