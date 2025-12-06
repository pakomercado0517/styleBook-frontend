'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, Clock, Star, MapPin } from 'lucide-react';
import { useService } from '@/lib/hooks/useServices';
import { useEmployeesByProvider } from '@/lib/hooks/useEmployees';
import { useFavoriteMutations, useFavoriteServiceIds } from '@/lib/hooks/useFavorites';

interface ServiceDetailsPageProps {
  serviceId: number;
}

/**
 * Página de detalles del servicio
 * Muestra información completa del servicio, profesionales disponibles y proveedor
 */
export function ServiceDetailsPage({ serviceId }: ServiceDetailsPageProps): ReactNode {
  const router = useRouter();
  const { data: service, isLoading, error } = useService(serviceId);
  const favoriteServiceIds = useFavoriteServiceIds();
  const { toggleServiceFavorite } = useFavoriteMutations();

  // Obtener empleados del proveedor
  const { data: employees = [] } = useEmployeesByProvider(
    service?.provider_id || 0,
    { limit: 20 }
  );

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md md:max-w-7xl flex-col bg-[#201d12]">
        <div className="relative w-full h-80 bg-white/5 animate-pulse"></div>
        <main className="flex-grow px-6 pb-32 pt-6">
          <div className="flex flex-col gap-6">
            <div className="h-8 bg-white/10 rounded animate-pulse"></div>
            <div className="h-6 bg-white/10 rounded animate-pulse"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md md:max-w-7xl flex-col bg-[#201d12] p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4 font-playfair">Error</h2>
          <p className="text-neutral-300 mb-6 font-poppins">No se pudo cargar el servicio.</p>
          <button
            onClick={() => router.back()}
            className="bg-accent-500 text-primary-900 px-6 py-3 rounded-lg font-semibold font-poppins"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Formatear precio
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(service.price);

  // Formatear duración
  const hours = Math.floor(service.duration_minutes / 60);
  const minutes = service.duration_minutes % 60;
  const formattedDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const rating = service.average_rating?.toFixed(1) || '4.9';
  const reviews = service.total_reviews || 95;
  const isFavorite = favoriteServiceIds.includes(service.id);

  const handleToggleFavorite = (): void => {
    toggleServiceFavorite(service.id, isFavorite);
  };

  const handleReserveNow = (): void => {
    // Navegar a la página de reservación
    router.push(`/client/book/${serviceId}`);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md md:max-w-7xl flex-col bg-[#201d12]">
      {/* Botones de acción - Solo móvil */}
      <div className="md:hidden relative w-full">
        <div className="h-80 w-full bg-cover bg-center relative">
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

        {/* Botón de retroceso */}
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-14 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
          aria-label="Volver"
          type="button"
        >
          <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
        </button>

        {/* Botón de favorito */}
        <button
          onClick={handleToggleFavorite}
          className="absolute right-4 top-14 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          type="button"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Layout Desktop: Dos columnas */}
      <div className="hidden md:flex md:gap-8 md:px-8 md:py-8">
        {/* Columna izquierda - Detalles del servicio */}
        <div className="flex-1">
          {/* Imagen del servicio - Desktop */}
          <div className="relative w-full mb-6 rounded-xl overflow-hidden">
            <div className="h-96 w-full bg-cover bg-center relative">
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
          </div>

          {/* Título, Precio y Rating */}
          <div className="mb-6">
            <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-white mb-4">
              {service.name}
            </h1>
            <div className="flex items-center gap-6 mb-4">
              <p className="text-3xl font-semibold font-poppins" style={{ color: '#D4AF37' }}>
                {formattedPrice}
              </p>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent-500 fill-accent-500" strokeWidth={2} />
                <p className="text-base font-medium text-white font-poppins">
                  {rating}{' '}
                  <span className="text-neutral-400">({reviews} {reviews === 1 ? 'reseña' : 'reseñas'})</span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Clock className="w-5 h-5" strokeWidth={2} />
                <p className="text-base font-poppins">{formattedDuration}</p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white font-playfair mb-4">
              Descripción del servicio
            </h2>
            <p className="text-base leading-relaxed text-neutral-300 font-poppins">
              {service.description}
            </p>
          </div>
        </div>

        {/* Columna derecha - Proveedor y Reserva */}
        <div className="w-80 lg:w-96 flex-shrink-0">
          <div className="sticky top-8 space-y-6">
            {/* Card del Proveedor */}
            {service.provider && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-xl font-semibold text-white font-poppins mb-2">
                  {service.provider.business_name}
                </p>
                <p className="text-sm text-neutral-300 font-poppins mb-3">
                  {service.provider.address}, {service.provider.city}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-accent-500 fill-accent-500" strokeWidth={2} />
                  <p className="text-sm text-neutral-300 font-poppins">
                    {service.provider.average_rating?.toFixed(1) || rating} ({reviews} {reviews === 1 ? 'reseña' : 'reseñas'})
                  </p>
                </div>
                <Link
                  href={`/client/providers/${service.provider.id}`}
                  className="flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors font-poppins"
                  style={{
                    backgroundColor: '#2C2C2C',
                    color: '#FFFFFF',
                  }}
                >
                  Ver perfil del proveedor
                </Link>
              </div>
            )}

            {/* Mapa */}
            <div className="h-48 w-full overflow-hidden rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-neutral-400 mx-auto mb-2" strokeWidth={2} />
                <p className="text-sm text-neutral-400 font-poppins">Mapa de ubicación</p>
              </div>
            </div>

            {/* Profesionales Disponibles */}
            {employees.length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white font-playfair mb-4">
                  Profesionales Disponibles
                </h2>
                <div className="space-y-4">
                  {employees.map((employee) => {
                    return (
                      <div key={employee.id} className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {employee.photo_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={employee.photo_url}
                              alt={`Foto de perfil de ${employee.name}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-lg text-white font-poppins">
                              {employee.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-base font-semibold text-white font-poppins truncate">
                            {employee.name}
                          </p>
                          <p className="text-sm text-neutral-400 font-poppins truncate">
                            {employee.specialty || 'Profesional'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Botón Reservar Ahora - Desktop */}
            <button
              onClick={handleReserveNow}
              className="h-14 w-full rounded-xl text-lg font-bold transition-colors font-poppins"
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
      </div>

      {/* Contenido principal - Solo móvil */}
      <main className="flex-grow px-6 pb-28 pt-6 md:hidden">
        <div className="flex flex-col gap-6">
          {/* Título, Precio y Rating */}
          <div className="flex flex-col gap-3">
            <h1 className="font-playfair text-3xl font-bold text-white">
              {service.name}
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-semibold font-poppins" style={{ color: '#D4AF37' }}>
                {formattedPrice}
              </p>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent-500 fill-accent-500" strokeWidth={2} />
                <p className="text-base font-medium text-white font-poppins">
                  {rating}{' '}
                  <span className="text-neutral-400">({reviews} {reviews === 1 ? 'reseña' : 'reseñas'})</span>
                </p>
              </div>
            </div>
          </div>

          {/* Divisor */}
          <div className="h-px w-full bg-white/10"></div>

          {/* Descripción */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-white font-playfair">Descripción</h2>
            <p className="text-base leading-relaxed text-neutral-300 font-poppins">
              {service.description}
            </p>
            <div className="flex items-center gap-2 text-neutral-300">
              <Clock className="w-5 h-5" strokeWidth={2} />
              <p className="text-base font-poppins">Duración: {formattedDuration}</p>
            </div>
          </div>

          {/* Profesionales Disponibles */}
          {employees.length > 0 && (
            <div id="professionals-section" className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-white font-playfair">
                Profesionales Disponibles
              </h2>
              {employees.map((employee) => {
                return (
                  <div key={employee.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                      {employee.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={employee.photo_url}
                          alt={`Foto de perfil de ${employee.name}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl text-white font-poppins">
                          {employee.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="text-lg font-semibold text-white font-poppins">
                        {employee.name}
                      </p>
                      <p className="text-sm text-neutral-400 font-poppins">
                        {employee.specialty || 'Profesional'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Divisor */}
          <div className="h-px w-full bg-white/10"></div>

          {/* Proveedor */}
          {service.provider && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-white font-playfair">Proveedor</h2>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                  {(service.provider as { avatar_url?: string; cover_url?: string })?.avatar_url ||
                  (service.provider as { avatar_url?: string; cover_url?: string })?.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        (service.provider as { avatar_url?: string; cover_url?: string })?.avatar_url ||
                        (service.provider as { avatar_url?: string; cover_url?: string })?.cover_url ||
                        ''
                      }
                      alt={`Logo de ${service.provider.business_name}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-white font-poppins">
                      {service.provider.business_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-grow">
                  <p className="text-lg font-semibold text-white font-poppins">
                    {service.provider.business_name}
                  </p>
                  <p className="text-sm text-neutral-400 font-poppins">
                    {service.provider.address}, {service.provider.city}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent-500 fill-accent-500" strokeWidth={2} />
                    <p className="text-sm text-neutral-400 font-poppins">
                      {service.provider.average_rating?.toFixed(1) || rating} ({reviews} {reviews === 1 ? 'reseña' : 'reseñas'})
                    </p>
                  </div>
                </div>
              </div>

              {/* Mapa placeholder */}
              <div className="h-40 w-full overflow-hidden rounded-lg bg-white/5 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-neutral-400 mx-auto mb-2" strokeWidth={2} />
                  <p className="text-sm text-neutral-400 font-poppins">Mapa de ubicación</p>
                </div>
              </div>

              {/* Botón Ver perfil del proveedor */}
              <Link
                href={`/client/providers/${service.provider.id}`}
                className="flex h-12 w-full items-center justify-center rounded-xl border text-base font-semibold transition-colors font-poppins"
                style={{
                  borderColor: '#D4AF37',
                  color: '#D4AF37',
                  backgroundColor: 'transparent',
                }}
              >
                Ver perfil del proveedor
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Botón fijo al final - Solo móvil */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] mx-auto max-w-md border-t border-white/10 bg-[#201d12]/95 px-6 py-4 backdrop-blur-lg md:hidden">
        {/* Botón Realizar reservación */}
        <button
          onClick={handleReserveNow}
          className="h-14 w-full rounded-xl text-lg font-bold transition-colors font-poppins"
          style={{
            backgroundColor: '#D4AF37',
            color: '#1A1A1A',
          }}
          type="button"
        >
          Realizar reservación
        </button>
      </div>
    </div>
  );
}


