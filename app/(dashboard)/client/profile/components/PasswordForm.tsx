'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { changePassword } from '@/lib/api/profile';
import { changePasswordSchema, type ChangePasswordInput } from '@/lib/schemas';

/**
 * Formulario de cambio de contraseña
 * Requiere contraseña actual y validación de nueva contraseña
 */
export function PasswordForm(): ReactNode {
  const [showPasswords, setShowPasswords] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Contraseña actualizada correctamente');
        reset();
      } else {
        // Mostrar el mensaje de error detallado del backend
        toast.error(result.error || 'Error al cambiar contraseña', {
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

  const onSubmit = (data: ChangePasswordInput): void => {
    passwordMutation.mutate(data);
  };

  // Usar el estado de la mutación en lugar de isSubmitting
  const isLoading = passwordMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Contraseña actual"
        type={showPasswords ? 'text' : 'password'}
        placeholder="••••••••"
        error={errors.currentPassword?.message}
        disabled={isLoading}
        {...register('currentPassword')}
      />

      <Input
        label="Nueva contraseña"
        type={showPasswords ? 'text' : 'password'}
        placeholder="••••••••"
        error={errors.newPassword?.message}
        disabled={isLoading}
        helperText="Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números"
        {...register('newPassword')}
      />

      <Input
        label="Confirmar nueva contraseña"
        type={showPasswords ? 'text' : 'password'}
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        disabled={isLoading}
        {...register('confirmPassword')}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="show_passwords"
          checked={showPasswords}
          onChange={(e) => setShowPasswords(e.target.checked)}
          className="w-4 h-4 accent-accent-600"
        />
        <label
          htmlFor="show_passwords"
          className="text-sm text-neutral-600 font-poppins"
        >
          Mostrar contraseñas
        </label>
      </div>

      <div className="pt-4 border-t border-neutral-200 mt-6">
        <Button
          type="submit"
          variant="gold"
          size="lg"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
        </Button>
      </div>
    </form>
  );
}
