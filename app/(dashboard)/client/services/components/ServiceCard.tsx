'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { Service } from '@/lib/types/services';

interface ServiceCardProps {
  service: Service;
  onSelect?: (serviceId: number) => void;
}

/**
 * ServiceCard - Tarjeta de servicio con información y acciones
 * Muestra detalles del servicio, proveedor, precio y duración
 */
export const ServiceCard = ({
  service,
  onSelect,
}: ServiceCardProps): ReactNode => {
  const router = useRouter();
  const canSelect = onSelect !== undefined;

  const handleCardClick = (): void => {
    if (canSelect) {
      onSelect(service.id);
    } else {
      // Navegar a la página de detalles del servicio
      router.push(`/client/services/${service.id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };


  // Formatear precio como "Desde $XX.XX"
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(service.price);

  const rating = service.average_rating?.toFixed(1) || '4.8';
  const reviews = service.total_reviews || 120;
  const providerName = service.provider?.business_name || 'Salón';

  return (
    <div
      className="
        relative flex flex-col items-stretch justify-start rounded-xl overflow-hidden
        hover:scale-[1.02] transition-all duration-300 cursor-pointer
        shadow-lg hover:shadow-2xl
      "
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Servicio: ${service.name}`}
    >
      {/* Imagen del servicio */}
      <div className="w-full bg-center bg-no-repeat aspect-video bg-cover relative">
        {service.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
            <span className="text-6xl">💇</span>
          </div>
        )}
      </div>

      {/* Overlay oscuro con información */}
      <div className="w-full bg-[#2C2C2C] p-4 flex flex-col gap-2">
        {/* Nombre del salón */}
        <p className="text-neutral-300 text-sm font-normal leading-normal font-poppins">
          {providerName}
        </p>

        {/* Nombre del servicio */}
        <p className="text-white text-xl font-bold leading-tight tracking-[-0.015em] font-playfair">
          {service.name}
        </p>

        {/* Precio */}
        <p className="text-white text-base font-normal leading-normal font-poppins">
          Desde {formattedPrice}
        </p>

        {/* Rating y Botón */}
        <div className="flex items-center justify-between mt-2">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-accent-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <p className="text-white text-sm font-medium leading-normal font-poppins">
              {rating}{' '}
              <span className="text-neutral-400 font-normal">
                ({reviews} {reviews === 1 ? 'reseña' : 'reseñas'})
              </span>
            </p>
          </div>

          {/* Botón "Detalles" */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/client/services/${service.id}`);
            }}
            className="
              bg-accent-500 text-white px-4 py-2 rounded-lg
              font-poppins text-sm font-semibold
              hover:bg-accent-400 transition-colors duration-200
              shadow-md hover:shadow-lg
            "
            style={{ backgroundColor: '#D4AF37' }}
            type="button"
            aria-label="Ver detalles del servicio"
          >
            Detalles
          </button>
        </div>
      </div>
    </div>
  );
};
