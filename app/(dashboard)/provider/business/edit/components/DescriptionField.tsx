'use client';

import type { ReactNode } from 'react';

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Campo de descripción del negocio (textarea)
 */
export function DescriptionField({
  value,
  onChange,
}: DescriptionFieldProps): ReactNode {
  return (
    <div>
      <label className="block text-sm font-semibold text-white font-poppins mb-2">
        Descripción del negocio
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors resize-none"
        placeholder="Describe tu negocio..."
        aria-label="Descripción del negocio"
      />
    </div>
  );
}

