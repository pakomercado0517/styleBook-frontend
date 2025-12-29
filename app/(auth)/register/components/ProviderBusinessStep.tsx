'use client';

import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/Input';
import {
  createProviderSchema,
  type CreateProviderInput,
} from '@/lib/schemas/provider.schema';
import { cn } from '@/lib/utils/cn';

interface ProviderBusinessStepProps {
  onSubmit: (data: CreateProviderInput) => void;
  onBack: () => void;
  isLoading?: boolean;
}

/**
 * Paso 2: Información del negocio (solo para proveedores)
 * Estilo Luxe Noir - Mobile First
 */
export function ProviderBusinessStep({
  onSubmit,
  onBack,
  isLoading = false,
}: ProviderBusinessStepProps): ReactNode {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProviderInput>({
    resolver: zodResolver(createProviderSchema),
    defaultValues: {
      business_name: '',
      business_type: 'salon',
      description: '',
      opening_time: '',
      closing_time: '',
      address: '',
      city: '',
      country: '',
    },
  });

  const businessTypeOptions = [
    { value: 'salon', label: 'Salón de Belleza' },
    { value: 'barbershop', label: 'Barbería' },
    { value: 'spa', label: 'Spa' },
    { value: 'nails', label: 'Uñas' },
    { value: 'makeup', label: 'Maquillaje' },
    { value: 'hair', label: 'Peluquería' },
    { value: 'other', label: 'Otro' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Nombre del Negocio */}
      <Input
        label="Nombre del Negocio *"
        type="text"
        placeholder="Ej: Salón Elegance"
        error={errors.business_name?.message}
        disabled={isLoading}
        className="bg-primary-800 border-primary-700 text-white placeholder:text-neutral-400 focus:border-accent-500"
        {...register('business_name')}
      />

      {/* Tipo de Negocio */}
      <div className="space-y-2">
        <label
          className={cn(
            'block text-sm lg:text-base font-poppins font-medium',
            errors.business_type ? 'text-red-400' : 'text-white'
          )}
        >
          Tipo de Negocio *
        </label>
        <select
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 font-poppins',
            'bg-primary-800 text-white',
            'focus:outline-none focus:ring-2 focus:ring-accent-500/20',
            'transition-all duration-200',
            '[&>option]:bg-primary-800 [&>option]:text-white',
            errors.business_type
              ? 'border-red-500 focus:border-red-500'
              : 'border-primary-700 hover:border-primary-600 focus:border-accent-500',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
          style={{
            backgroundColor: '#2C2C2C', // primary-800
            color: '#FFFFFF',
          }}
          disabled={isLoading}
          {...register('business_type')}
        >
          {businessTypeOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              style={{
                backgroundColor: '#2C2C2C', // primary-800
                color: '#FFFFFF',
              }}
            >
              {option.label}
            </option>
          ))}
        </select>
        {errors.business_type && (
          <p className="text-sm text-red-400 font-poppins">
            {errors.business_type.message}
          </p>
        )}
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <label
          className={cn(
            'block text-sm lg:text-base font-poppins font-medium text-white'
          )}
        >
          Descripción (opcional)
        </label>
        <textarea
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 font-poppins',
            'bg-primary-800 text-white placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-accent-500/20',
            'transition-all duration-200 resize-none',
            'min-h-[100px]',
            errors.description
              ? 'border-red-500 focus:border-red-500'
              : 'border-primary-700 hover:border-primary-600 focus:border-accent-500',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
          placeholder="Describe tu negocio, servicios especiales, experiencia..."
          disabled={isLoading}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-400 font-poppins">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Horarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Hora de Apertura (opcional)"
          type="time"
          placeholder="09:00"
          error={errors.opening_time?.message}
          disabled={isLoading}
          className="bg-primary-800 border-primary-700 text-white placeholder:text-neutral-400 focus:border-accent-500"
          {...register('opening_time')}
        />

        <Input
          label="Hora de Cierre (opcional)"
          type="time"
          placeholder="19:00"
          error={errors.closing_time?.message}
          disabled={isLoading}
          className="bg-primary-800 border-primary-700 text-white placeholder:text-neutral-400 focus:border-accent-500"
          {...register('closing_time')}
        />
      </div>

      {/* Dirección */}
      <Input
        label="Dirección (opcional)"
        type="text"
        placeholder="Calle y número"
        error={errors.address?.message}
        disabled={isLoading}
        className="bg-primary-800 border-primary-700 text-white placeholder:text-neutral-400 focus:border-accent-500"
        {...register('address')}
      />

      {/* Ciudad y País */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Ciudad (opcional)"
          type="text"
          placeholder="Ciudad"
          error={errors.city?.message}
          disabled={isLoading}
          className="bg-primary-800 border-primary-700 text-white placeholder:text-neutral-400 focus:border-accent-500"
          {...register('city')}
        />

        <Input
          label="País (opcional)"
          type="text"
          placeholder="País"
          error={errors.country?.message}
          disabled={isLoading}
          className="bg-primary-800 border-primary-700 text-white placeholder:text-neutral-400 focus:border-accent-500"
          {...register('country')}
        />
      </div>

      {/* Botones de Navegación */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className={cn(
            'flex-1 px-6 py-3 rounded-xl font-poppins font-semibold',
            'border-2 border-primary-700 text-white',
            'hover:border-primary-600 hover:bg-primary-800/50',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          Anterior
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'flex-1 px-6 py-3 rounded-xl font-poppins font-bold',
            'bg-accent-500 text-primary-900 border-2 border-accent-600',
            'hover:bg-accent-600 hover:border-accent-700',
            'shadow-lg shadow-accent-500/30',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isLoading ? 'Registrando...' : 'Completar Registro'}
        </button>
      </div>
    </form>
  );
}
