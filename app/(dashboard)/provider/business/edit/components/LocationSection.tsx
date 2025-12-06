'use client';

import type { ReactNode } from 'react';
import { AddressField } from './AddressField';

interface LocationSectionProps {
  address: string;
  onAddressChange: (value: string) => void;
}

/**
 * Sección de ubicación
 * Desktop: agrupa dirección y mapa
 */
export function LocationSection({
  address,
  onAddressChange,
}: LocationSectionProps): ReactNode {
  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white font-poppins mb-6">Ubicación</h2>
      <AddressField value={address} onChange={onAddressChange} />
    </div>
  );
}

