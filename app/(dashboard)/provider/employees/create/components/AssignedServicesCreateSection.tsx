'use client';

import type { ReactNode } from 'react';
import { Scissors, Palette, Sparkles, Hand, Footprints, Droplets, User, CircleUser, Waves, Flower2, Sparkle, CircleDot, Activity, Hand as HandIcon } from 'lucide-react';
import type { Service } from '@/lib/types/services';
import type { ServiceCategory } from '@/lib/types/services';
import type { LucideIcon } from 'lucide-react';

interface AssignedServicesCreateSectionProps {
  services: Service[];
  assignedServiceIds: Set<number>;
  onToggleService: (serviceId: number) => void;
  onSelectAll: () => void;
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
  return `${mins} min`;
}

/**
 * Formatea el precio a formato de moneda
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

/**
 * Sección de servicios asignados para crear empleado
 * Mobile: lista vertical simple
 * Desktop: card con grid 2x2, icono de mano y título
 */
export function AssignedServicesCreateSection({
  services,
  assignedServiceIds,
  onToggleService,
  onSelectAll,
}: AssignedServicesCreateSectionProps): ReactNode {
  // Renderizar servicio individual
  const renderService = (service: Service) => {
    const Icon = getServiceIcon(service.category);
    const isAssigned = assignedServiceIds.has(service.id);
    const duration = formatDuration(service.duration_minutes);
    const price = formatPrice(service.price);

    return (
      <div
        key={service.id}
        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
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

        {/* Toggle Switch */}
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={() => onToggleService(service.id)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isAssigned ? 'bg-[#D4AF37]' : 'bg-white/20'
            }`}
            aria-label={`${isAssigned ? 'Desasignar' : 'Asignar'} ${service.name}`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                isAssigned ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden space-y-4">
        {/* Header con título y botón seleccionar todo */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-playfair">
            Servicios Asignados
          </h2>
          <button
            type="button"
            onClick={onSelectAll}
            className="text-sm font-semibold font-poppins transition-opacity hover:opacity-80"
            style={{ color: '#D4AF37' }}
          >
            SELECCIONAR TODO
          </button>
        </div>

        {/* Lista de servicios */}
        <div className="space-y-3">
          {services.length === 0 ? (
            <p className="text-neutral-300 text-sm font-poppins text-center py-4">
              No hay servicios disponibles
            </p>
          ) : (
            services.map(renderService)
          )}
        </div>
      </div>

      {/* Desktop - Card */}
      <div className="hidden md:block bg-white/5 rounded-xl p-6 border border-white/10">
        {/* Título con icono */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <HandIcon className="w-6 h-6 text-[#D4AF37]" strokeWidth={2} />
            <h2 className="text-xl font-bold text-white font-playfair">
              Servicios Asignados
            </h2>
          </div>
          <button
            type="button"
            onClick={onSelectAll}
            className="text-sm font-semibold font-poppins transition-opacity hover:opacity-80"
            style={{ color: '#D4AF37' }}
          >
            SELECCIONAR TODO
          </button>
        </div>
        {/* Grid de servicios */}
        <div className="grid grid-cols-2 gap-4">
          {services.length === 0 ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-neutral-300 text-sm font-poppins">
                No hay servicios disponibles
              </p>
            </div>
          ) : (
            services.map(renderService)
          )}
        </div>
      </div>
    </>
  );
}

