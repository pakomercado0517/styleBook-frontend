'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Building2 } from 'lucide-react';
import type { ProviderProfile } from '@/lib/types/provider';

interface ProviderCardProps {
  provider: ProviderProfile;
}

/**
 * ProviderCard - Card de proveedor
 * Diseño mobile-first con icono, nombre, tipo y rating
 */
export const ProviderCard = ({ provider }: ProviderCardProps): ReactNode => {
  const router = useRouter();

  // Mapeo de tipos de negocio a español
  const businessTypeLabels: Record<string, string> = {
    salon: 'Salón de Belleza',
    barbershop: 'Barbería',
    spa: 'Spa',
    nails: 'Uñas',
    makeup: 'Maquillaje',
    hair: 'Peluquería',
    other: 'Otro',
  };

  const rating = provider.average_rating || 0;
  const distance = '1.2 km'; // Valor por defecto, se podría calcular con geolocalización

  const handleCardClick = (): void => {
    router.push(`/client/providers/${provider.id}`);
  };

  return (
    <div
      className="bg-white/5 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-white/10"
      onClick={handleCardClick}
    >
      {/* Contenido de la card */}
      <div className="px-4 py-6">
        {/* Icono de edificio centrado */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-neutral-300" strokeWidth={1.5} />
          </div>
        </div>

        {/* Nombre del proveedor */}
        <h3 className="text-xl font-bold text-white font-playfair mb-2 text-center">
          {provider.business_name}
        </h3>

        {/* Tipo de negocio */}
        <p className="text-sm text-neutral-300 font-poppins mb-4 text-center">
          {businessTypeLabels[provider.business_type] || provider.business_type}
        </p>

        {/* Rating y distancia */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4"
                style={{ color: '#D4AF37' }}
                fill="#D4AF37"
                strokeWidth={2}
              />
            ))}
          </div>
          <span className="text-sm text-white font-poppins">
            {rating.toFixed(1)} a {distance}
          </span>
        </div>
      </div>
    </div>
  );
};
