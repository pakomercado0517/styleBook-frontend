'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '@/lib/api/services';
import type { Service } from '@/lib/types/services';

/**
 * Carrusel horizontal de servicios recomendados
 * Diseño tipo card con imagen y gradiente overlay
 */
export function RecommendedServicesCarousel(): ReactNode {
  const { data, isLoading } = useQuery({
    queryKey: ['services', 'recommended'],
    queryFn: async () => {
      const result = await getServices({ limit: 6, is_active: true });
      if (!result.success) {
        return { services: [] };
      }
      // La respuesta puede venir en diferentes formatos según el backend
      const servicesData = result.data?.data?.services || result.data?.services || [];
      return { services: servicesData };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const services = data?.services || [];

  if (isLoading) {
    return (
      <div className="flex space-x-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative h-48 w-64 shrink-0 overflow-hidden rounded-xl bg-white/10 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-neutral-300 font-poppins text-sm">
          No hay servicios disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="flex space-x-4 overflow-x-auto px-4 pb-4 md:px-0 scrollbar-hide">
      {services.slice(0, 6).map((service: Service) => {
        const providerName = service.provider?.business_name || 'Proveedor';
        const imageUrl =
          service.image_url ||
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';

        return (
          <Link
            key={service.id}
            href={`/client/book/${service.id}`}
            className="relative h-48 w-64 md:h-56 md:w-80 shrink-0 overflow-hidden rounded-xl group cursor-pointer"
            tabIndex={0}
            role="button"
            aria-label={`Servicio: ${service.name} de ${providerName}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = `/client/book/${service.id}`;
              }
            }}
          >
            {/* Imagen de fondo */}
            <div className="absolute inset-0 z-0">
              {service.image_url ? (
                <Image
                  src={imageUrl}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 256px, 320px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent-500/20 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-accent-400" strokeWidth={2} />
                  </div>
                </div>
              )}
            </div>

            {/* Overlay gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10 group-hover:from-black/80 transition-colors"></div>

            {/* Contenido */}
            <div className="absolute bottom-0 left-0 p-4 md:p-5 z-20 w-full">
              <p className="text-lg md:text-xl font-bold text-white font-playfair mb-1 line-clamp-1">
                {service.name}
              </p>
              <p className="text-sm md:text-base text-neutral-200 font-poppins line-clamp-1">
                {providerName}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

