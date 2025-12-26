'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useMyProviderProfile } from '@/lib/hooks/useMyProviderProfile';
import { useCreateEmployee } from '@/lib/hooks/useEmployees';
import { useProviderServices } from '@/lib/hooks/useServices';
import { CreateEmployeeHeader } from './CreateEmployeeHeader';
import { UploadPhotoSection } from './UploadPhotoSection';
import { PersonalInfoFields } from './PersonalInfoFields';
import { AssignedServicesCreateSection } from './AssignedServicesCreateSection';
import { StandardAvailabilitySection } from './StandardAvailabilitySection';
import { CreateEmployeeButton } from './CreateEmployeeButton';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEmployeeSchema } from '@/lib/schemas/employees.schema';
import type { CreateEmployeeInput } from '@/lib/schemas/employees.schema';
import type { CreateEmployeeData } from '@/lib/types/employees';

/**
 * Contenido principal de la página de creación de empleado
 * Diseño mobile-first según la imagen proporcionada
 */
export function CreateEmployeePageContent(): ReactNode {
  const router = useRouter();
  const { data: providerProfile, isLoading: isLoadingProfile } =
    useMyProviderProfile();
  const createEmployee = useCreateEmployee();

  // Obtener servicios del proveedor
  const { data: servicesResponse } = useProviderServices(providerProfile?.id, {
    limit: 100,
  });
  const services = servicesResponse?.data?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateEmployeeInput>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      provider_id: 0,
      name: '',
      email: '',
      phone: '',
      specialty: '',
      photo_url: '',
    },
  });

  // Actualizar provider_id cuando se carga el perfil
  useEffect(() => {
    if (providerProfile?.id) {
      setValue('provider_id', providerProfile.id);
    }
  }, [providerProfile, setValue]);

  // Servicios asignados
  const [assignedServiceIds, setAssignedServiceIds] = useState<Set<number>>(
    new Set()
  );

  // Rol seleccionado
  const [selectedRole, setSelectedRole] = useState<string>('');

  const handleToggleService = (serviceId: number): void => {
    setAssignedServiceIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (): void => {
    if (assignedServiceIds.size === services.length) {
      // Deseleccionar todos
      setAssignedServiceIds(new Set());
    } else {
      // Seleccionar todos
      setAssignedServiceIds(new Set(services.map((s) => s.id)));
    }
  };

  const onSubmit = (data: CreateEmployeeInput): void => {
    if (!providerProfile) return;

    const createData: CreateEmployeeData = {
      provider_id: providerProfile.id,
      name: data.name,
      email: data.email,
    };
    if (data.phone && data.phone.trim() !== '') {
      createData.phone = data.phone;
    }
    if (selectedRole && selectedRole.trim() !== '') {
      createData.specialty = selectedRole;
    } else if (data.specialty && data.specialty.trim() !== '') {
      createData.specialty = data.specialty;
    }
    if (data.photo_url && data.photo_url.trim() !== '') {
      createData.photo_url = data.photo_url;
    }

    createEmployee.mutate(createData, {
      onSuccess: () => {
        router.push('/provider/employees');
      },
    });
  };

  const handleSave = (): void => {
    handleSubmit(onSubmit)();
  };

  const handleCancel = (): void => {
    router.push('/provider/employees');
  };

  const handleChangePhoto = (): void => {
    // TODO: Implementar cambio de foto
    console.log('Cambiar foto');
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-[#201d12] flex flex-col">
        <CreateEmployeeHeader onSave={handleSave} isSaving={false} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white font-poppins">Cargando perfil del proveedor...</p>
        </div>
      </div>
    );
  }

  if (!providerProfile) {
    return (
      <div className="min-h-screen bg-[#201d12] flex flex-col">
        <CreateEmployeeHeader onSave={handleSave} isSaving={false} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-400 font-poppins">
            No se pudo cargar el perfil del proveedor
          </p>
        </div>
      </div>
    );
  }

  const isSaving = createEmployee.isPending;

  return (
    <div className="min-h-screen bg-[#201d12] flex flex-col pb-20 md:pb-0">
      {/* Header */}
      <CreateEmployeeHeader
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
      />

      {/* Contenido */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 px-4 py-6 md:px-8 md:py-8"
      >
        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          {/* Sección de foto */}
          <UploadPhotoSection
            photoUrl={watch('photo_url')}
            onChangePhoto={handleChangePhoto}
          />

          {/* Campos de información personal */}
          <PersonalInfoFields
            register={register}
            errors={errors}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
          />

          {/* Servicios Asignados */}
          <AssignedServicesCreateSection
            services={services}
            assignedServiceIds={assignedServiceIds}
            onToggleService={handleToggleService}
            onSelectAll={handleSelectAll}
          />

          {/* Disponibilidad Estándar */}
          <StandardAvailabilitySection />

          {/* Botón Crear Empleado */}
          <CreateEmployeeButton isLoading={isSaving} />
        </div>

        {/* Desktop Layout - Grid de 2 columnas */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-6">
          {/* Columna Izquierda */}
          <div className="space-y-6">
            {/* Card de Foto */}
            <UploadPhotoSection
              photoUrl={watch('photo_url')}
              onChangePhoto={handleChangePhoto}
            />

            {/* Card de Información Personal */}
            <PersonalInfoFields
              register={register}
              errors={errors}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
            />
          </div>

          {/* Columna Derecha */}
          <div className="space-y-6">
            {/* Card de Servicios Asignados */}
            <AssignedServicesCreateSection
              services={services}
              assignedServiceIds={assignedServiceIds}
              onToggleService={handleToggleService}
              onSelectAll={handleSelectAll}
            />

            {/* Card de Disponibilidad Semanal */}
            <StandardAvailabilitySection />
          </div>
        </div>
      </form>
    </div>
  );
}

