'use client';

import type { ReactNode } from 'react';
import { Lock, ChevronRight } from 'lucide-react';

interface ChangePasswordButtonProps {
  onClick: () => void;
}

/**
 * Botón para cambiar contraseña
 * Muestra icono de candado, texto y flecha
 */
export function ChangePasswordButton({
  onClick,
}: ChangePasswordButtonProps): ReactNode {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
      type="button"
    >
      <div className="flex items-center gap-3">
        <Lock className="w-5 h-5" strokeWidth={2} />
        <span className="font-semibold font-poppins">Cambiar Contraseña</span>
      </div>
      <ChevronRight className="w-5 h-5" strokeWidth={2} />
    </button>
  );
}

