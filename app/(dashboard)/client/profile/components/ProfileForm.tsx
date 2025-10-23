'use client';

import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { updateProfile } from '@/lib/api/profile';
import { useAuthStore } from '@/store/authStore';
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/schemas';
import { getUserTimezone } from '@/lib/utils/dateUtils';

/**
 * Formulario de edición de perfil
 * Permite actualizar nombre, teléfono y dirección
 */
export function ProfileForm(): ReactNode {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      timezone: user?.timezone || getUserTimezone(),
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileInput) => {
      if (!user) {
        return Promise.reject(new Error('Usuario no autenticado'));
      }
      return updateProfile(user.id, data);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Perfil actualizado correctamente');
        // Actualizar el store con los nuevos datos
        if (user && token) {
          setAuth({ ...user, ...result.data }, token);
        }
      } else {
        // Mostrar el mensaje de error detallado del backend
        toast.error(result.error || 'Error al actualizar perfil', {
          duration: 7000, // Mostrar por 7 segundos para errores detallados
          style: {
            whiteSpace: 'pre-line', // Permite saltos de línea
          },
        });
      }
    },
    onError: (error) => {
      // Error de red o excepción inesperada
      const message =
        error instanceof Error ? error.message : 'Error de conexión';
      toast.error(message);
    },
  });

  const onSubmit = (data: UpdateProfileInput): void => {
    updateMutation.mutate(data);
  };

  // Usar el estado de la mutación en lugar de isSubmitting
  const isLoading = updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Nombre completo"
        type="text"
        placeholder="Tu nombre"
        error={errors.name?.message}
        disabled={isLoading}
        {...register('name')}
      />

      <Input
        label="Email"
        type="email"
        value={user?.email || ''}
        disabled
        helperText="El email no se puede modificar"
      />

      <Input
        label="Teléfono (opcional)"
        type="tel"
        placeholder="+1 234 567 8900"
        error={errors.phone?.message}
        disabled={isLoading}
        {...register('phone')}
      />

      <Input
        label="Dirección (opcional)"
        type="text"
        placeholder="Calle, ciudad, país"
        error={errors.address?.message}
        disabled={isLoading}
        {...register('address')}
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="gold"
          size="lg"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}
