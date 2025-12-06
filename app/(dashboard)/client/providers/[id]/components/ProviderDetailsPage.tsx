'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star, MapPin, Clock, Plus, Heart, Share2 } from 'lucide-react';
import { useProvider } from '@/lib/hooks/useProviders';
import { useProviderServices } from '@/lib/hooks/useServices';
import { getServicesByProvider } from '@/lib/api/services';
import type { Service } from '@/lib/types/services';

interface ProviderDetailsPageProps {
  providerId: number;
}

/**
 * ProviderDetailsPage - Vista detallada del proveedor
 * Diseño mobile-first con imagen, descripción, servicios, ubicación y reseñas
 */
export const ProviderDetailsPage = ({
  providerId,
}: ProviderDetailsPageProps): ReactNode => {
  const router = useRouter();

  // Obtener información del proveedor
  const { data: provider, isLoading, isError, error } = useProvider(providerId);

  // Obtener servicios del proveedor
  const { data: servicesResponse } = useQuery({
    queryKey: ['provider-services', providerId],
    queryFn: async () => {
      const result = await getServicesByProvider(providerId, { limit: 20 });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!providerId,
    staleTime: 2 * 60 * 1000,
  });

  const services: Service[] = servicesResponse?.data?.data || [];
  const providerImage = provider?.cover_url || provider?.avatar_url;
  const rating = provider?.average_rating || 0;
  const reviewsCount = 215; // Valor por defecto, se podría obtener del backend

  const handleBack = (): void => {
    router.back();
  };

  const handleServiceClick = (serviceId: number): void => {
    router.push(`/client/services/${serviceId}`);
  };

  const handleBookNow = (): void => {
    if (services.length > 0) {
      router.push(`/client/services?provider=${providerId}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#201d12] flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
          <div className="h-6 bg-white/10 rounded w-32 animate-pulse"></div>
          <div className="w-10"></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !provider) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error al cargar el proveedor';

    return (
      <div className="min-h-screen bg-[#201d12] flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Volver"
            type="button"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
          <h1 className="text-xl font-bold text-white font-playfair">Proveedor</h1>
          <div className="w-10"></div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-red-400 font-poppins mb-4">{errorMessage}</p>
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-lg bg-accent-500 text-primary-900 font-semibold font-poppins"
              type="button"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#201d12] flex flex-col md:min-h-full">
      {/* Mobile: Header con imagen */}
      <div className="relative w-full h-80 md:hidden">
        {providerImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={providerImage}
            alt={provider.business_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
            <span className="text-6xl">🏢</span>
          </div>
        )}

        {/* Overlay oscuro para mejor legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Botón de volver */}
        <div className="absolute top-4 left-4">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
            aria-label="Volver"
            type="button"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
        </div>

        {/* Nombre y rating sobre la imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl font-bold text-white font-playfair mb-2">
            {provider.business_name}
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-5 h-5"
                  style={{ color: '#D4AF37' }}
                  fill={star <= Math.round(rating) ? '#D4AF37' : 'transparent'}
                  strokeWidth={2}
                />
              ))}
            </div>
            <span className="text-base text-white font-poppins font-semibold">
              {rating.toFixed(1)}
            </span>
            <span className="text-sm text-neutral-200 font-poppins">
              ({reviewsCount} {reviewsCount === 1 ? 'reseña' : 'reseñas'})
            </span>
          </div>
        </div>
      </div>

      {/* Desktop: Header con título, iconos y botón */}
      <div className="hidden md:flex items-center justify-between px-0 py-6 mb-6 border-b border-white/10">
        <button
          onClick={handleBack}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Volver"
          type="button"
        >
          <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
        <h1 className="text-4xl font-bold text-white font-playfair">
          {provider.business_name}
        </h1>
        <div className="flex items-center gap-4">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Agregar a favoritos"
            type="button"
          >
            <Heart className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Compartir"
            type="button"
          >
            <Share2 className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
          <button
            onClick={handleBookNow}
            className="px-6 py-3 rounded-xl font-semibold font-poppins transition-colors"
            style={{
              backgroundColor: '#D4AF37',
              color: '#1A1A1A',
            }}
            type="button"
          >
            Reservar Ahora
          </button>
        </div>
      </div>

      {/* Contenido principal - Desktop: Dos columnas */}
      <div className="flex-1 px-4 py-6 pb-40 md:px-0 md:py-0 md:pb-0">
        <div className="w-full md:grid md:grid-cols-3 md:gap-8">
          {/* Columna izquierda - Contenido principal */}
          <div className="md:col-span-2 space-y-6">
            {/* Desktop: Imagen del salón */}
            <div className="hidden md:block w-full rounded-xl overflow-hidden">
              {providerImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={providerImage}
                  alt={provider.business_name}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
                  <span className="text-6xl">🏢</span>
                </div>
              )}
            </div>

            {/* Desktop: Título y rating debajo de la imagen */}
            <div className="hidden md:block">
              <h2 className="text-3xl font-bold text-white font-playfair mb-3">
                {provider.business_name}
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5"
                      style={{ color: '#D4AF37' }}
                      fill={star <= Math.round(rating) ? '#D4AF37' : 'transparent'}
                      strokeWidth={2}
                    />
                  ))}
                </div>
                <span className="text-base text-white font-poppins font-semibold">
                  {rating.toFixed(1)}
                </span>
                <span className="text-sm text-neutral-200 font-poppins">
                  ({reviewsCount} {reviewsCount === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
            </div>

            {/* Descripción */}
            {provider.description && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-sm md:text-base text-white font-poppins leading-relaxed">
                  {provider.description}
                </p>
              </div>
            )}

            {/* Servicios */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white font-playfair mb-4">
                Servicios
              </h2>
              <div className="space-y-3">
                {services.length > 0 ? (
                  services.map((service) => {
                    const hours = Math.floor(service.duration_minutes / 60);
                    const minutes = service.duration_minutes % 60;
                    const formattedDuration =
                      hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
                    const formattedPrice = new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                      minimumFractionDigits: 0,
                    }).format(service.price);

                    return (
                      <div
                        key={service.id}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-white font-poppins mb-1">
                            {service.name}
                          </h3>
                          <p className="text-sm text-neutral-300 font-poppins">
                            {formattedDuration} • Desde {formattedPrice}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleServiceClick(service.id);
                          }}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 hover:bg-accent-600 transition-colors flex-shrink-0"
                          aria-label={`Ver ${service.name}`}
                          type="button"
                        >
                          <Plus className="w-5 h-5 text-primary-900" strokeWidth={2} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                    <p className="text-neutral-300 font-poppins">
                      No hay servicios disponibles
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: Ubicación y Horarios */}
            <div className="md:hidden">
              <h2 className="text-xl font-bold text-white font-playfair mb-4">
                Ubicación y Horarios
              </h2>

              {/* Mapa */}
              <div className="bg-white/5 rounded-xl overflow-hidden mb-4 border border-white/10">
                <div className="w-full h-48 bg-gradient-to-br from-teal-100 to-teal-200 relative flex items-center justify-center">
                  {/* Placeholder del mapa */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin
                        className="w-12 h-12 mx-auto mb-2"
                        style={{ color: '#0F766E' }}
                        strokeWidth={2}
                      />
                      <p className="text-teal-800 font-semibold font-poppins">BOBO</p>
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

              {/* Dirección */}
              {provider.address && (
                <div className="flex items-start gap-3 mb-3">
                  <MapPin
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    style={{ color: '#D4AF37' }}
                    strokeWidth={2}
                  />
                  <div>
                    <p className="text-sm text-white font-poppins">{provider.address}</p>
                    {provider.city && (
                      <p className="text-sm text-neutral-300 font-poppins">
                        {provider.city}
                        {provider.country && `, ${provider.country}`}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Horarios */}
              {provider.opening_time && provider.closing_time && (
                <div className="flex items-start gap-3">
                  <Clock
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    style={{ color: '#D4AF37' }}
                    strokeWidth={2}
                  />
                  <div>
                    <p className="text-sm text-white font-poppins">Lunes a Sábado</p>
                    <p className="text-sm text-neutral-300 font-poppins">
                      {provider.opening_time} - {provider.closing_time}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile: Reseñas de Clientes */}
            <div className="md:hidden">
              <h2 className="text-xl font-bold text-white font-playfair mb-4">
                Reseñas de Clientes
              </h2>
              <div className="space-y-4">
                {/* Placeholder de reseñas - Se podría obtener del backend */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">SG</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-white font-poppins mb-1">
                        Sofía García
                      </h4>
                      <div className="flex items-center gap-1 mb-2">
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
                      <p className="text-sm text-neutral-300 font-poppins leading-relaxed">
                        ¡Experiencia increíble! El trato fue exquisito y el resultado superó mis
                        expectativas. Volveré sin duda.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">ER</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-white font-poppins mb-1">
                        Elena Rodriguez
                      </h4>
                      <div className="flex items-center gap-1 mb-2">
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
                      <p className="text-sm text-neutral-300 font-poppins leading-relaxed">
                        Un lugar precioso con profesionales de primera. Mi balayage quedó perfecto. Lo
                        recomiendo al 100%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Sidebar Desktop */}
          <div className="hidden md:block md:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Ubicación y Horarios */}
              <div>
                <h2 className="text-xl font-bold text-white font-playfair mb-4">
                  Ubicación y Horarios
                </h2>

                {/* Mapa */}
                <div className="bg-white/5 rounded-xl overflow-hidden mb-4 border border-white/10">
                  <div className="w-full h-48 bg-gradient-to-br from-teal-100 to-teal-200 relative flex items-center justify-center">
                    {/* Placeholder del mapa */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin
                          className="w-12 h-12 mx-auto mb-2"
                          style={{ color: '#0F766E' }}
                          strokeWidth={2}
                        />
                        <p className="text-teal-800 font-semibold font-poppins">BOBO</p>
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

                {/* Dirección */}
                {provider.address && (
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: '#D4AF37' }}
                      strokeWidth={2}
                    />
                    <div>
                      <p className="text-sm text-white font-poppins">{provider.address}</p>
                      {provider.city && (
                        <p className="text-sm text-neutral-300 font-poppins">
                          {provider.city}
                          {provider.country && `, ${provider.country}`}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Horarios */}
                {provider.opening_time && provider.closing_time && (
                  <div className="flex items-start gap-3">
                    <Clock
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: '#D4AF37' }}
                      strokeWidth={2}
                    />
                    <div>
                      <p className="text-sm text-white font-poppins">Lunes a Sábado</p>
                      <p className="text-sm text-neutral-300 font-poppins">
                        {provider.opening_time} - {provider.closing_time}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Reseñas de Clientes */}
              <div>
                <h2 className="text-xl font-bold text-white font-playfair mb-4">
                  Reseñas de Clientes
                </h2>
                <div className="space-y-4">
                  {/* Placeholder de reseñas - Se podría obtener del backend */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">SG</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-white font-poppins mb-1">
                          Sofía García
                        </h4>
                        <div className="flex items-center gap-1 mb-2">
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
                        <p className="text-sm text-neutral-300 font-poppins leading-relaxed">
                          ¡Experiencia increíble! El trato fue exquisito y el resultado superó mis
                          expectativas. Volveré sin duda.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">ER</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-white font-poppins mb-1">
                          Elena Rodriguez
                        </h4>
                        <div className="flex items-center gap-1 mb-2">
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
                        <p className="text-sm text-neutral-300 font-poppins leading-relaxed">
                          Un lugar precioso con profesionales de primera. Mi balayage quedó perfecto. Lo
                          recomiendo al 100%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón fijo "Reservar Ahora" */}
      <div className="fixed bottom-20 left-0 right-0 z-[60] mx-auto max-w-md border-t border-white/10 bg-[#201d12]/95 px-4 py-4 backdrop-blur-lg md:hidden">
        <button
          onClick={handleBookNow}
          className="w-full h-14 rounded-xl font-semibold font-poppins transition-colors"
          style={{
            backgroundColor: '#D4AF37',
            color: '#1A1A1A',
          }}
          type="button"
        >
          Reservar Ahora
        </button>
      </div>
    </div>
  );
};

