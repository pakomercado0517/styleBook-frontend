'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateEmployee,
  useUpdateEmployee,
  useEmployee,
} from '@/lib/hooks/useEmployees';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from '@/lib/schemas/employees.schema';
import type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from '@/lib/schemas/employees.schema';
import { cn } from '@/lib/utils/cn';

interface EmployeeFormModalProps {
  providerId: number;
  employeeId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal para crear o editar un empleado
 */
export function EmployeeFormModal({
  providerId,
  employeeId,
  isOpen,
  onClose,
}: EmployeeFormModalProps): ReactNode {
  const isEditing = employeeId !== null;
  const { data: employeeData, isLoading: isLoadingEmployee } = useEmployee(
    employeeId || 0
  );
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateEmployeeInput | UpdateEmployeeInput>({
    resolver: zodResolver(isEditing ? updateEmployeeSchema : createEmployeeSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      specialty: '',
      photo_url: '',
    },
  });

  // Pre-llenar formulario cuando se carga el empleado para editar
  useEffect(() => {
    if (isEditing && employeeData) {
      setValue('name', employeeData.name);
      setValue('email', employeeData.email);
      setValue('phone', employeeData.phone || '');
      setValue('specialty', employeeData.specialty || '');
      if (employeeData.photo_url) {
        setValue('photo_url', employeeData.photo_url);
      }
    } else {
      reset();
    }
  }, [isEditing, employeeData, setValue, reset]);

  const onSubmit = (data: CreateEmployeeInput | UpdateEmployeeInput): void => {
    if (isEditing && employeeId) {
      // Para actualizar, omitimos provider_id y campos vacíos
      const updateData: UpdateEmployeeInput = {};
      if (data.name) updateData.name = data.name;
      if (data.email) updateData.email = data.email;
      if (data.phone !== undefined) {
        updateData.phone = data.phone || undefined;
      }
      if (data.specialty !== undefined) {
        updateData.specialty = data.specialty || undefined;
      }
      if (data.photo_url !== undefined) {
        updateData.photo_url = data.photo_url || undefined;
      }

      updateEmployee.mutate(
        {
          id: employeeId,
          data: updateData,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      // Para crear, incluimos provider_id y omitimos campos vacíos
      const createData: CreateEmployeeInput = {
        provider_id: providerId,
        name: data.name!,
        email: data.email!,
      };
      if (data.phone && data.phone.trim() !== '') {
        createData.phone = data.phone;
      }
      if (data.specialty && data.specialty.trim() !== '') {
        createData.specialty = data.specialty;
      }
      if (data.photo_url && data.photo_url.trim() !== '') {
        createData.photo_url = data.photo_url;
      }

      createEmployee.mutate(createData, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const isLoading =
    createEmployee.isPending || updateEmployee.isPending || isLoadingEmployee;

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
            {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-sm text-neutral-600 mb-4">
            {isEditing
              ? 'Actualiza la información del empleado'
              : 'Completa los datos para agregar un nuevo empleado a tu equipo'}
          </DialogPrimitive.Description>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nombre completo"
              type="text"
              placeholder="Ej: Sofía Hernández"
              error={errors.name?.message}
              disabled={isLoading}
              {...register('name')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Ej: sofia.hernandez@elegance.com"
              error={errors.email?.message}
              disabled={isLoading}
              {...register('email')}
            />

            <Input
              label="Teléfono (opcional)"
              type="tel"
              placeholder="Ej: 5551111111"
              error={errors.phone?.message}
              helperText="Máximo 20 caracteres"
              disabled={isLoading}
              {...register('phone')}
            />

            <Input
              label="Especialidad (opcional)"
              type="text"
              placeholder="Ej: Colorista, Estilista Senior"
              error={errors.specialty?.message}
              helperText="Máximo 50 caracteres"
              disabled={isLoading}
              {...register('specialty')}
            />

            <Input
              label="URL de foto (opcional)"
              type="url"
              placeholder="https://example.com/foto.jpg"
              error={errors.photo_url?.message}
              helperText="URL de la foto de perfil del empleado"
              disabled={isLoading}
              {...register('photo_url')}
            />

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
                    ? 'Actualizar Empleado'
                    : 'Crear Empleado'}
              </Button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

