'use client';

import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface CreateEmployeeButtonProps {
  isLoading?: boolean;
}

/**
 * Botón grande para crear empleado
 * Amarillo con icono de checkmark y texto "Crear Empleado"
 */
export function CreateEmployeeButton({
  isLoading = false,
}: CreateEmployeeButtonProps): ReactNode {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold font-poppins transition-opacity disabled:opacity-50"
      style={{
        backgroundColor: '#D4AF37',
        color: '#1A1A1A',
      }}
    >
      <Check className="w-5 h-5" strokeWidth={2.5} />
      <span>{isLoading ? 'Creando...' : 'Crear Empleado'}</span>
    </button>
  );
}

