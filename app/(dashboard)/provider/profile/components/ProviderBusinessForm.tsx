'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';
import { updateProviderProfile } from '@/lib/api/providers';
import {
  updateProviderProfileSchema,
  type UpdateProviderProfileInput,
} from '@/lib/schemas/provider.schema';
import { useMyProviderProfile } from '@/lib/hooks/useMyProviderProfile';
import { cn } from '@/lib/utils/cn';

/**
 * Formulario de información del negocio del proveedor
 * Permite actualizar datos específicos del negocio
 */
export function ProviderBusinessForm(): ReactNode {
  const queryClient = useQueryClient();
  const { data: providerProfile, isLoading: isLoadingProfile } =
    useMyProviderProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProviderProfileInput>({
    resolver: zodResolver(updateProviderProfileSchema),
    defaultValues: {
      business_name: '',
      business_type: 'salon',
      description: '',
      opening_time: '',
      closing_time: '',
      address: '',
      city: '',
      country: '',
      is_active: true,
    },
  });

  // Actualizar formulario cuando se carga el perfil
  useEffect(() => {
    if (providerProfile) {
      reset({
        business_name: providerProfile.business_name || '',
        business_type: providerProfile.business_type || 'salon',
        description: providerProfile.description || '',
        opening_time: providerProfile.opening_time || '',
        closing_time: providerProfile.closing_time || '',
        address: providerProfile.address || '',
        city: providerProfile.city || '',
        country: providerProfile.country || '',
        is_active: providerProfile.is_active ?? true,
      });
    }
  }, [providerProfile, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateProviderProfileInput) => {
      if (!providerProfile?.id) {
        throw new Error('Perfil de proveedor no encontrado');
      }
      const result = await updateProviderProfile(providerProfile.id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success('Perfil actualizado', {
        description: 'La información de tu negocio se ha actualizado correctamente.',
      });
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['my-provider-profile'] });
      queryClient.invalidateQueries({ queryKey: ['provider-profile'] });
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar', {
        description: error.message || 'No se pudo actualizar el perfil.',
      });
    },
  });

  const onSubmit = (data: UpdateProviderProfileInput): void => {
    // Filtrar campos vacíos
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => {
        if (value === '' || value === null || value === undefined) {
          return false;
        }
        return true;
      })
    );
    updateMutation.mutate(cleanData);
  };

  const isLoading = updateMutation.isPending || isLoadingProfile;

  // Opciones para tipo de negocio
  const businessTypeOptions = [
    { value: 'salon', label: 'Salón de Belleza' },
    { value: 'barbershop', label: 'Barbería' },
    { value: 'spa', label: 'Spa' },
    { value: 'nails', label: 'Uñas' },
    { value: 'makeup', label: 'Maquillaje' },
    { value: 'hair', label: 'Peluquería' },
    { value: 'other', label: 'Otro' },
  ];

  if (isLoadingProfile) {
    return (
      <div className="space-y-5">
        <div className="h-12 bg-neutral-200 rounded-xl animate-pulse"></div>
        <div className="h-12 bg-neutral-200 rounded-xl animate-pulse"></div>
        <div className="h-12 bg-neutral-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (!providerProfile) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-poppins">
          No se encontró el perfil del proveedor. Por favor, contacta al soporte.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Nombre del Negocio */}
      <Input
        label="Nombre del Negocio"
        type="text"
        placeholder="Ej: Salón Elegance"
        error={errors.business_name?.message}
        disabled={isLoading}
        {...register('business_name')}
      />

      {/* Tipo de Negocio */}
      <Select
        label="Tipo de Negocio"
        options={businessTypeOptions}
        error={errors.business_type?.message}
        disabled={isLoading}
        {...register('business_type')}
      />

      {/* Descripción */}
      <div className="space-y-2">
        <label
          className={cn(
            'block text-sm font-medium font-poppins',
            errors.description ? 'text-red-600' : 'text-primary-800'
          )}
        >
          Descripción (opcional)
        </label>
        <textarea
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 font-poppins',
            'bg-white text-primary-800',
            'focus:outline-none focus:ring-2 focus:ring-accent-500/20',
            'transition-all duration-200 resize-none',
            'min-h-[100px]',
            errors.description
              ? 'border-red-500 focus:border-red-500'
              : 'border-neutral-200 hover:border-neutral-300 focus:border-accent-500',
            isLoading && 'opacity-50 cursor-not-allowed bg-neutral-50'
          )}
          placeholder="Describe tu negocio, servicios especiales, experiencia..."
          disabled={isLoading}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-600 font-poppins">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Horarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Hora de Apertura"
          type="time"
          placeholder="09:00"
          helperText="Formato 24h (HH:mm)"
          error={errors.opening_time?.message}
          disabled={isLoading}
          {...register('opening_time')}
        />
        <Input
          label="Hora de Cierre"
          type="time"
          placeholder="18:00"
          helperText="Formato 24h (HH:mm)"
          error={errors.closing_time?.message}
          disabled={isLoading}
          {...register('closing_time')}
        />
      </div>

      {/* Dirección */}
      <Input
        label="Dirección del Negocio"
        type="text"
        placeholder="Calle, número, colonia"
        error={errors.address?.message}
        disabled={isLoading}
        {...register('address')}
      />

      {/* Ciudad y País */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Ciudad"
          type="text"
          placeholder="Ej: Ciudad de México"
          error={errors.city?.message}
          disabled={isLoading}
          {...register('city')}
        />
        <Input
          label="País"
          type="text"
          placeholder="Ej: México"
          error={errors.country?.message}
          disabled={isLoading}
          {...register('country')}
        />
      </div>

      {/* Estado Activo */}
      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          id="is_active"
          className="w-5 h-5 rounded border-2 border-neutral-300 text-accent-500 focus:ring-2 focus:ring-accent-500/20 cursor-pointer"
          disabled={isLoading}
          {...register('is_active')}
        />
        <label
          htmlFor="is_active"
          className="text-sm font-medium text-primary-800 font-poppins cursor-pointer"
        >
          Negocio activo (visible para clientes)
        </label>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="gold"
          size="lg"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Guardando...' : 'Guardar Cambios del Negocio'}
        </Button>
      </div>
    </form>
  );
}

