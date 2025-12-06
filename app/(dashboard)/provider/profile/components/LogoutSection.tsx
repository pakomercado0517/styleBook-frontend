'use client';

import type { ReactNode } from 'react';
import { LogOut } from 'lucide-react';

interface LogoutSectionProps {
  onLogout: () => void;
}

/**
 * Sección de cerrar sesión
 * Desktop: Card con título, descripción y botón a la derecha
 */
export function LogoutSection({ onLogout }: LogoutSectionProps): ReactNode {
  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white font-poppins mb-2">
            Cerrar Sesión
          </h2>
          <p className="text-sm text-neutral-300 font-poppins">
            Finaliza tu sesión actual en este dispositivo.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="px-6 py-3 rounded-xl font-semibold font-poppins transition-colors bg-white/5 border border-white/10 text-white hover:bg-white/10 shrink-0 ml-6"
          type="button"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-5 h-5" strokeWidth={2} />
            <span>Cerrar Sesión</span>
          </div>
        </button>
      </div>
    </div>
  );
}

