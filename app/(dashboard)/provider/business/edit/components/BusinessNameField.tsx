'use client';

import type { ReactNode } from 'react';

interface BusinessNameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Campo de nombre del establecimiento
 */
export function BusinessNameField({
  value,
  onChange,
}: BusinessNameFieldProps): ReactNode {
  return (
    <div>
      <label className="block text-sm font-semibold text-white font-poppins mb-2">
        Nombre del establecimiento
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
        placeholder="Nombre del negocio"
        aria-label="Nombre del establecimiento"
      />
    </div>
  );
}

