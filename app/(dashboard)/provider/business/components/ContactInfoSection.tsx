'use client';

import type { ReactNode } from 'react';
import { MapPin, Phone } from 'lucide-react';

interface ContactInfoSectionProps {
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Sección de información de contacto
 * Muestra dirección, teléfono y preview del mapa
 */
export function ContactInfoSection({
  address,
  city,
  country,
  phone,
}: ContactInfoSectionProps): ReactNode {
  const fullAddress = [address, city, country].filter(Boolean).join(', ');

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <h3 className="text-lg font-bold text-white font-poppins mb-4">
        Información de Contacto
      </h3>
      <div className="space-y-3 mb-4">
        {fullAddress && (
          <div className="flex items-start gap-3">
            <MapPin
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              style={{ color: '#D4AF37' }}
              strokeWidth={2}
            />
            <p className="text-sm text-white font-poppins flex-1">{fullAddress}</p>
          </div>
        )}
        {phone && (
          <div className="flex items-start gap-3">
            <Phone
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              style={{ color: '#D4AF37' }}
              strokeWidth={2}
            />
            <p className="text-sm text-white font-poppins">{phone}</p>
          </div>
        )}
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

