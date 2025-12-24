'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { Search, Scissors, Palette, Sparkles, Hand, Footprints, Droplets, User, CircleUser, Waves, Flower2, Sparkle, CircleDot, Activity } from 'lucide-react';
import type { Service } from '@/lib/types/services';
import type { ServiceCategory } from '@/lib/types/services';
import type { LucideIcon } from 'lucide-react';

interface AssignedServicesSectionProps {
  services: Service[];
  assignedServiceIds: Set<number>;
  onToggleService: (serviceId: number) => void;
}

/**
 * Mapea la categoría del servicio a un icono de Lucide
 */
function getServiceIcon(category: ServiceCategory | undefined): LucideIcon {
  const iconMap: Record<ServiceCategory, LucideIcon> = {
    corte: Scissors,
    tinte: Palette,
    peinado: Sparkles,
    manicure: Hand,
    pedicure: Footprints,
    tratamiento_capilar: Droplets,
    barba: User,
    afeitado: Scissors,
    masaje: Activity,
    facial: CircleUser,
    corporal: Waves,
    aromaterapia: Flower2,
    limpieza_dental: CircleDot,
    estetica_dental: Sparkle,
  };

  return category ? iconMap[category] : Scissors;
}

/**
 * Formatea la duración en minutos a formato legible
 */
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} mins`;
}

/**
 * Formatea el precio a formato de moneda
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(price);
}

/**
 * Sección de servicios asignados al empleado
 * Mobile: Lista vertical simple
 * Desktop: Grid con búsqueda y subtítulo
 */
export function AssignedServicesSection({
  services,
  assignedServiceIds,
  onToggleService,
}: AssignedServicesSectionProps): ReactNode {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar servicios por búsqueda
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
      {/* Título de sección */}
      <div>
        <h2 className="text-xl font-bold text-white font-playfair mb-2">
          Servicios Asignados
        </h2>
        {/* Subtítulo solo en desktop */}
        <p className="hidden md:block text-sm text-neutral-300 font-poppins">
          Gestiona los servicios que este empleado puede realizar.
        </p>
      </div>

      {/* Barra de búsqueda solo en desktop */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-5 h-5 text-neutral-400" strokeWidth={2} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar servicio..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
            aria-label="Buscar servicio"
          />
        </div>
      </div>

      {/* Lista de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredServices.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-neutral-300 text-sm font-poppins">
              {searchQuery ? 'No se encontraron servicios' : 'No hay servicios disponibles'}
            </p>
          </div>
        ) : (
          filteredServices.map((service) => {
            const Icon = getServiceIcon(service.category);
            const isAssigned = assignedServiceIds.has(service.id);
            const duration = formatDuration(service.duration_minutes);
            const price = formatPrice(service.price);

            return (
              <button
                key={service.id}
                onClick={() => onToggleService(service.id)}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left"
                type="button"
              >
                {/* Icono del servicio */}
                <div className="flex-shrink-0">
                  <Icon
                    className={`w-6 h-6 ${isAssigned ? 'text-[#D4AF37]' : 'text-neutral-400'}`}
                    strokeWidth={2}
                  />
                </div>

                {/* Información del servicio */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white font-poppins mb-1 truncate">
                    {service.name}
                  </h3>
                  <p className="text-sm text-neutral-300 font-poppins">
                    {duration} • {price}
                  </p>
                </div>

                {/* Checkbox */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      isAssigned
                        ? 'bg-[#D4AF37] border-[#D4AF37]'
                        : 'border-white/30 bg-transparent'
                    }`}
                  >
                    {isAssigned && (
                      <svg
                        className="w-4 h-4 text-primary-900"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
