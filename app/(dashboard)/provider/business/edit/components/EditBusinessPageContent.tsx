'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useMyProviderProfile } from '@/lib/hooks/useMyProviderProfile';
import { useAuth } from '@/lib/hooks/useAuth';
import { updateProviderProfile } from '@/lib/api/providers';
import { EditBusinessHeader } from './EditBusinessHeader';
import { BusinessNameField } from './BusinessNameField';
import { AddressField } from './AddressField';
import { PhoneField } from './PhoneField';
import { DescriptionField } from './DescriptionField';
import { OpeningHoursFields } from './OpeningHoursFields';
import { GalleryEditSection } from './GalleryEditSection';
import { GeneralInfoSection } from './GeneralInfoSection';
import { LocationSection } from './LocationSection';

/**
 * Contenido principal de la página de edición del negocio
 * Diseño mobile-first
 */
export function EditBusinessPageContent(): ReactNode {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: providerProfile, isLoading } = useMyProviderProfile();

  // Estados del formulario
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  // Horarios por día
  const [schedules, setSchedules] = useState<Record<string, { start: string; end: string; isOpen: boolean }>>({
    monday: { start: '09:00', end: '19:00', isOpen: true },
    tuesday: { start: '09:00', end: '19:00', isOpen: true },
    wednesday: { start: '', end: '', isOpen: false },
    thursday: { start: '09:00', end: '19:00', isOpen: true },
    friday: { start: '09:00', end: '20:00', isOpen: true },
    saturday: { start: '10:00', end: '14:00', isOpen: true },
    sunday: { start: '', end: '', isOpen: false },
  });

  // Cargar datos del perfil cuando esté disponible
  useEffect(() => {
    if (providerProfile) {
      setBusinessName(providerProfile.business_name || '');
      setAddress(
        [providerProfile.address, providerProfile.city, providerProfile.country]
          .filter(Boolean)
          .join(', ')
      );
      setPhone(user?.phone || '');
      setDescription(providerProfile.description || '');
      // Inicializar horarios desde el perfil
      const openingTime = providerProfile.opening_time || '09:00';
      const closingTime = providerProfile.closing_time || '19:00';
      setSchedules({
        monday: { start: openingTime, end: closingTime, isOpen: true },
        tuesday: { start: openingTime, end: closingTime, isOpen: true },
        wednesday: { start: '', end: '', isOpen: false },
        thursday: { start: openingTime, end: closingTime, isOpen: true },
        friday: { start: openingTime, end: closingTime, isOpen: true },
        saturday: { start: '10:00', end: '14:00', isOpen: true },
        sunday: { start: '', end: '', isOpen: false },
      });
      // Cargar imágenes de la galería (por ahora solo cover_url)
      if (providerProfile.cover_url) {
        setGalleryImages([providerProfile.cover_url]);
      }
    }
  }, [providerProfile, user]);

  // Mutation para actualizar el perfil
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!providerProfile?.id) {
        throw new Error('Perfil de proveedor no encontrado');
      }

      // Parsear dirección (asumiendo formato: "dirección, ciudad, país")
      const addressParts = address.split(',').map((s) => s.trim());
      const parsedAddress = addressParts[0] || '';
      const parsedCity = addressParts[1] || providerProfile.city || '';
      const parsedCountry = addressParts[2] || providerProfile.country || '';

      // Usar horarios de lunes como horario principal
      const mondaySchedule = schedules.monday || { start: '09:00', end: '19:00', isOpen: true };
      const updateData = {
        business_name: businessName,
        address: parsedAddress,
        city: parsedCity,
        country: parsedCountry,
        description: description,
        opening_time: mondaySchedule.isOpen ? mondaySchedule.start : '',
        closing_time: mondaySchedule.isOpen ? mondaySchedule.end : '',
      };

      const result = await updateProviderProfile(providerProfile.id, updateData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success('Negocio actualizado', {
        description: 'La información de tu negocio se ha actualizado correctamente.',
      });
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['my-provider-profile'] });
      queryClient.invalidateQueries({ queryKey: ['provider-profile'] });
      // Redirigir a la página de negocio
      router.push('/provider/business');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar', {
        description: error.message || 'No se pudo actualizar el negocio.',
      });
    },
  });

  const handleSave = (): void => {
    // Validaciones básicas
    if (!businessName.trim()) {
      toast.error('Error de validación', {
        description: 'El nombre del establecimiento es requerido.',
      });
      return;
    }

    updateMutation.mutate();
  };

  const handleRemoveImage = (index: number): void => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddImage = (): void => {
    // TODO: Implementar selector de imágenes
    toast.info('Función de añadir imágenes próximamente');
  };

  const handleScheduleChange = (
    day: string,
    schedule: { start: string; end: string; isOpen: boolean }
  ): void => {
    setSchedules((prev) => ({ ...prev, [day]: schedule }));
  };

  const handleCancel = (): void => {
    router.push('/provider/business');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col">
        <div className="px-4 py-4 border-b border-white/10">
          <div className="h-8 bg-white/5 rounded w-32 animate-pulse" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white font-poppins">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!providerProfile) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col">
        <div className="px-4 py-4 border-b border-white/10">
          <h1 className="text-xl font-bold text-white font-poppins">Editar Negocio</h1>
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
    <div className="min-h-full bg-[#121212] flex flex-col">
      {/* Header */}
      <EditBusinessHeader
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={updateMutation.isPending}
      />

      {/* Contenido principal */}
      <div className="flex-1 px-4 py-6 pb-24 md:px-8 md:py-8 space-y-6 overflow-y-auto">
        {/* Mobile: Campos individuales */}
        <div className="md:hidden space-y-6">
          <BusinessNameField value={businessName} onChange={setBusinessName} />
          <AddressField value={address} onChange={setAddress} />
          <PhoneField value={phone} onChange={setPhone} />
          <DescriptionField value={description} onChange={setDescription} />
        </div>

        {/* Desktop: Secciones agrupadas */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-6">
          {/* Información General */}
          <GeneralInfoSection
            businessName={businessName}
            phone={phone}
            description={description}
            onBusinessNameChange={setBusinessName}
            onPhoneChange={setPhone}
            onDescriptionChange={setDescription}
          />

          {/* Ubicación */}
          <LocationSection address={address} onAddressChange={setAddress} />
        </div>

        {/* Horarios de Atención */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 md:block">
          <OpeningHoursFields
            schedules={schedules}
            onScheduleChange={handleScheduleChange}
          />
        </div>

        {/* Galería Multimedia */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 md:block">
          <GalleryEditSection
            images={galleryImages}
            onRemoveImage={handleRemoveImage}
            onAddImage={handleAddImage}
          />
        </div>
      </div>
    </div>
  );
}

