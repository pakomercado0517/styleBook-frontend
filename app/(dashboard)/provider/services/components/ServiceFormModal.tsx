'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateService, useUpdateService, useService } from '@/lib/hooks/useServices';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';
import { createServiceSchema, updateServiceSchema } from '@/lib/schemas/services.schema';
import type { CreateServiceInput, UpdateServiceInput } from '@/lib/schemas/services.schema';
import { cn } from '@/lib/utils/cn';

interface ServiceFormModalProps {
  providerId: number;
  serviceId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal para crear o editar un servicio
 */
export function ServiceFormModal({
  providerId,
  serviceId,
  isOpen,
  onClose,
}: ServiceFormModalProps): ReactNode {
  const isEditing = serviceId !== null;
  const { data: serviceData, isLoading: isLoadingService } = useService(
    serviceId || 0
  );
  const createService = useCreateService(providerId);
  const updateService = useUpdateService();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateServiceInput | UpdateServiceInput>({
    resolver: zodResolver(isEditing ? updateServiceSchema : createServiceSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'corte',
      price: 0,
      duration_minutes: 30,
      is_active: true,
      image_url: '',
    },
  });

  // Pre-llenar formulario cuando se carga el servicio para editar
  useEffect(() => {
    if (isEditing && serviceData) {
      setValue('name', serviceData.name);
      setValue('description', serviceData.description);
      setValue('category', serviceData.category);
      setValue('price', serviceData.price);
      setValue('duration_minutes', serviceData.duration_minutes);
      setValue('is_active', serviceData.is_active);
      if (serviceData.image_url) {
        setValue('image_url', serviceData.image_url);
      }
    } else {
      reset();
    }
  }, [isEditing, serviceData, setValue, reset]);

  const onSubmit = (data: CreateServiceInput | UpdateServiceInput): void => {
    if (isEditing && serviceId) {
      updateService.mutate(
        {
          serviceId,
          data: data as UpdateServiceInput,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createService.mutate(data as CreateServiceInput, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const categoryOptions = [
    { value: 'corte', label: 'Corte' },
    { value: 'tinte', label: 'Tinte' },
    { value: 'peinado', label: 'Peinado' },
    { value: 'manicure', label: 'Manicure' },
    { value: 'pedicure', label: 'Pedicure' },
    { value: 'tratamiento_capilar', label: 'Tratamiento Capilar' },
    { value: 'barba', label: 'Barba' },
    { value: 'afeitado', label: 'Afeitado' },
    { value: 'masaje', label: 'Masaje' },
    { value: 'facial', label: 'Facial' },
    { value: 'corporal', label: 'Corporal' },
    { value: 'aromaterapia', label: 'Aromaterapia' },
    { value: 'limpieza_dental', label: 'Limpieza Dental' },
    { value: 'estetica_dental', label: 'Estética Dental' },
  ];

  const isLoading = createService.isPending || updateService.isPending || isLoadingService;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4',
            'border-2 border-neutral-200 bg-white p-6 shadow-2xl',
            'duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'rounded-2xl sm:rounded-3xl',
            'max-h-[90vh] overflow-y-auto'
          )}
        >
          <DialogPrimitive.Title className="text-2xl font-playfair font-bold text-primary-800">
            {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-sm text-neutral-600 mb-4">
            {isEditing
              ? 'Actualiza la información de tu servicio'
              : 'Completa los datos para crear un nuevo servicio'}
          </DialogPrimitive.Description>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nombre del servicio"
              type="text"
              placeholder="Ej: Corte de cabello clásico"
              error={errors.name?.message}
              disabled={isLoading}
              {...register('name')}
            />

            <div>
              <label className="block text-sm font-medium font-poppins text-primary-800 mb-2">
                Descripción
              </label>
              <textarea
                className={cn(
                  'w-full px-4 py-3 rounded-xl font-poppins text-base',
                  'border-2 transition-all duration-300',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  errors.description
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-neutral-200 focus:border-accent-500 focus:ring-accent-500/20',
                  'bg-white text-primary-800',
                  'placeholder:text-neutral-400',
                  'hover:border-accent-400 hover:shadow-md hover:shadow-accent-500/5',
                  'min-h-[100px] resize-y'
                )}
                placeholder="Describe tu servicio..."
                disabled={isLoading}
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 font-poppins">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Categoría"
                error={errors.category?.message}
                disabled={isLoading}
                options={categoryOptions}
                value={watch('category') || 'corte'}
                onChange={(e) => setValue('category', e.target.value as any)}
              />

              <Input
                label="Duración (minutos)"
                type="number"
                placeholder="30"
                error={errors.duration_minutes?.message}
                disabled={isLoading}
                {...register('duration_minutes', { valueAsNumber: true })}
              />
            </div>

            <Input
              label="Precio (MXN)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.price?.message}
              disabled={isLoading}
              {...register('price', { valueAsNumber: true })}
            />

            <Input
              label="URL de imagen (opcional)"
              type="url"
              placeholder="https://example.com/imagen.jpg"
              error={errors.image_url?.message}
              helperText="URL de la imagen del servicio"
              disabled={isLoading}
              {...register('image_url')}
            />

            {isEditing && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  className="w-5 h-5 rounded border-2 border-neutral-300 text-accent-500 focus:ring-2 focus:ring-accent-500/20"
                  disabled={isLoading}
                  {...register('is_active')}
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium font-poppins text-primary-800"
                >
                  Servicio activo (visible para clientes)
                </label>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="gold"
                size="lg"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading
                  ? 'Guardando...'
                  : isEditing
                    ? 'Actualizar Servicio'
                    : 'Crear Servicio'}
              </Button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

