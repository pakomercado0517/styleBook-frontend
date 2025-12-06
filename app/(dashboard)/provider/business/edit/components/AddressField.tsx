'use client';

import type { ReactNode } from 'react';
import { Search, MapPin } from 'lucide-react';

interface AddressFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Campo de dirección con preview del mapa
 */
export function AddressField({ value, onChange }: AddressFieldProps): ReactNode {
  return (
    <div>
      <label className="block text-sm font-semibold text-white font-poppins mb-2">
        Dirección
      </label>
      <div className="relative mb-3">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-5 h-5 text-neutral-400" strokeWidth={2} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
          placeholder="Buscar dirección..."
          aria-label="Dirección"
        />
      </div>
      {/* Preview del mapa */}
      <div className="w-full h-32 rounded-lg overflow-hidden bg-gradient-to-br from-teal-100 to-teal-200 relative flex items-center justify-center">
        {/* Placeholder del mapa */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin
              className="w-8 h-8 mx-auto mb-2"
              style={{ color: '#0F766E' }}
              strokeWidth={2}
            />
            <p className="text-teal-800 font-semibold font-poppins text-sm">Mapa</p>
          </div>
        </div>
        {/* Líneas de mapa decorativas */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="20" x2="100" y2="20" stroke="#0F766E" strokeWidth="0.5" />
            <line x1="0" y1="40" x2="100" y2="40" stroke="#0F766E" strokeWidth="0.5" />
            <line x1="0" y1="60" x2="100" y2="60" stroke="#0F766E" strokeWidth="0.5" />
            <line x1="0" y1="80" x2="100" y2="80" stroke="#0F766E" strokeWidth="0.5" />
            <line x1="20" y1="0" x2="20" y2="100" stroke="#0F766E" strokeWidth="0.5" />
            <line x1="40" y1="0" x2="40" y2="100" stroke="#0F766E" strokeWidth="0.5" />
            <line x1="60" y1="0" x2="60" y2="100" stroke="#0F766E" strokeWidth="0.5" />
            <line x1="80" y1="0" x2="80" y2="100" stroke="#0F766E" strokeWidth="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

