'use client';

import type { ReactNode } from 'react';
import { Pencil } from 'lucide-react';

interface EditProfileButtonProps {
  onClick: () => void;
}

/**
 * Botón para editar perfil del negocio
 * Diseño mobile: botón grande dorado con icono de lápiz
 */
export function EditProfileButton({
  onClick,
}: EditProfileButtonProps): ReactNode {
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
      <Pencil className="w-5 h-5" strokeWidth={2.5} />
      <span>Editar Información de Negocio</span>
    </button>
  );
}
