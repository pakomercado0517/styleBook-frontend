'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMyProviderProfile } from '@/lib/hooks/useMyProviderProfile';
import { ProfileHeader } from './ProfileHeader';
import { ContactInfoSection } from './ContactInfoSection';
import { OpeningHoursSection } from './OpeningHoursSection';
import { AboutUsSection } from './AboutUsSection';
import { GallerySection } from './GallerySection';
import { EditProfileButton } from './EditProfileButton';

/**
 * Contenido principal de la página de negocio del proveedor
 * Diseño mobile-first
 */
export function ProviderBusinessPageContent(): ReactNode {
  const router = useRouter();
  const { user } = useAuth();
  const { data: providerProfile, isLoading } = useMyProviderProfile();

  const handleEditProfile = (): void => {
    // Redirige a la página de edición de negocio, independiente de la información del perfil
    router.push('/provider/business/edit');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#201d12] flex flex-col">
        <div className="px-4 py-6 border-b border-white/10">
          <div className="h-8 bg-white/5 rounded w-32 animate-pulse" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white font-poppins">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!providerProfile || !user) {
    return (
      <div className="min-h-screen bg-[#201d12] flex flex-col">
        <div className="px-4 py-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white font-poppins">
            Mi Negocio
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-400 font-poppins">
            No se pudo cargar el perfil del negocio
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#201d12] flex flex-col">
      {/* Header */}
      <ProfileHeader
        businessName={providerProfile.business_name}
        rating={providerProfile.average_rating || 0}
        reviewsCount={128} // TODO: Obtener del backend cuando esté disponible
        editHref="/provider/business/edit"
      />

      {/* Contenido principal */}
      <div className="flex-1 px-4 py-6 pb-24 md:px-8 md:py-8 space-y-4 md:space-y-6">
        {/* Desktop: Descripción después del header */}
        <AboutUsSection description={providerProfile.description} />

        {/* Mobile: Información de Contacto */}
        <div className="md:hidden">
          <ContactInfoSection
            address={providerProfile.address}
            city={providerProfile.city}
            country={providerProfile.country}
            phone={user.phone}
            latitude={providerProfile.latitude}
            longitude={providerProfile.longitude}
          />
        </div>

        {/* Mobile: Horario de Atención */}
        <div className="md:hidden">
          <OpeningHoursSection
            openingTime={providerProfile.opening_time}
            closingTime={providerProfile.closing_time}
          />
        </div>

        {/* Desktop: Dos columnas - Contacto y Horarios */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-6">
          <ContactInfoSection
            address={providerProfile.address}
            city={providerProfile.city}
            country={providerProfile.country}
            phone={user.phone}
            latitude={providerProfile.latitude}
            longitude={providerProfile.longitude}
          />
          <OpeningHoursSection
            openingTime={providerProfile.opening_time}
            closingTime={providerProfile.closing_time}
          />
        </div>

        {/* Galería */}
        <GallerySection coverUrl={providerProfile.cover_url} />

        {/* Mobile: Botón Editar Perfil */}
        <div className="md:hidden">
          <EditProfileButton onClick={handleEditProfile} />
        </div>
      </div>
    </div>
  );
}
