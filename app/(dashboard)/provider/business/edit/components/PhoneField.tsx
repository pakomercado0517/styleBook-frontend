'use client';

import type { ReactNode } from 'react';

interface PhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Campo de número de teléfono
 */
export function PhoneField({ value, onChange }: PhoneFieldProps): ReactNode {
  return (
    <div>
      <label className="block text-sm font-semibold text-white font-poppins mb-2">
        Número de teléfono
      </label>
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
        placeholder="+34 912 345 678"
        aria-label="Número de teléfono"
      />
    </div>
  );
}

