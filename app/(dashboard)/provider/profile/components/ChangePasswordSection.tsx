'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

interface ChangePasswordSectionProps {
  onPasswordChange?: (currentPassword: string, newPassword: string) => void;
}

/**
 * Sección de cambio de contraseña
 * Desktop: Card con dos campos lado a lado
 */
export function ChangePasswordSection({
  onPasswordChange: _onPasswordChange, // eslint-disable-line @typescript-eslint/no-unused-vars
}: ChangePasswordSectionProps): ReactNode {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // TODO: Agregar botón para cambiar contraseña que llame a onPasswordChange

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white font-poppins mb-6">
        Cambiar Contraseña
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contraseña Actual */}
        <div>
          <label className="block text-sm font-semibold text-white font-poppins mb-2">
            Contraseña Actual
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
            placeholder="••••••••"
            aria-label="Contraseña actual"
          />
        </div>

        {/* Nueva Contraseña */}
        <div>
          <label className="block text-sm font-semibold text-white font-poppins mb-2">
            Nueva Contraseña
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
            placeholder="••••••••"
            aria-label="Nueva contraseña"
          />
        </div>
      </div>
    </div>
  );
}

