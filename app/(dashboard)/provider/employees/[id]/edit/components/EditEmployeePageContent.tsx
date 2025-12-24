'use client';

import type { ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEmployee, useUpdateEmployee, useDeleteEmployee } from '@/lib/hooks/useEmployees';
import { useProviderServices } from '@/lib/hooks/useServices';
import { EditEmployeeHeader } from './EditEmployeeHeader';
import { EmployeeProfilePicture } from './EmployeeProfilePicture';
import { EmployeeProfileCard } from './EmployeeProfileCard';
import { EmployeePersonalInfo } from './EmployeePersonalInfo';
import { EmployeePersonalInfoCard } from './EmployeePersonalInfoCard';
import { AssignedServicesSection } from './AssignedServicesSection';
import { EmployeeAvailabilitySection, type DaySchedule } from './EmployeeAvailabilitySection';
import { DeleteEmployeeButton } from './DeleteEmployeeButton';
import { useState, useEffect } from 'react';
import type { UpdateEmployeeData } from '@/lib/types/employees';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateEmployeeSchema } from '@/lib/schemas/employees.schema';
import type { UpdateEmployeeInput } from '@/lib/schemas/employees.schema';

/**
 * Contenido principal de la página de edición de empleado
 * Diseño mobile-first según la imagen proporcionada
 */
export function EditEmployeePageContent(): ReactNode {
  const params = useParams();
  const router = useRouter();
  const employeeId = Number(params.id);
  
  const { data: employee, isLoading: isLoadingEmployee } = useEmployee(employeeId);
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();
  
  // Obtener servicios del proveedor para la sección de servicios asignados
  const { data: servicesResponse } = useProviderServices(employee?.provider_id, {
    limit: 100,
  });
  const services = servicesResponse?.data?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UpdateEmployeeInput>({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      specialty: '',
      photo_url: '',
    },
  });

  // Servicios asignados (por ahora solo visual, sin backend)
  const [assignedServiceIds, setAssignedServiceIds] = useState<Set<number>>(new Set());

  // Disponibilidad semanal (por ahora solo visual, sin backend)
  const [weeklySchedule] = useState<DaySchedule[]>([
    { day: 'monday', status: 'active', startTime: '09:00', endTime: '18:00' },
    { day: 'tuesday', status: 'active', startTime: '09:00', endTime: '18:00' },
    { day: 'wednesday', status: 'active', startTime: '09:00', endTime: '18:00' },
    { day: 'thursday', status: 'active', startTime: '09:00', endTime: '18:00' },
    { day: 'friday', status: 'active', startTime: '09:00', endTime: '18:00' },
    { day: 'saturday', status: 'active', startTime: '09:00', endTime: '18:00' },
    { day: 'sunday', status: 'rest', startTime: '-', endTime: '-' },
  ]);

  // Pre-llenar formulario cuando se carga el empleado
  useEffect(() => {
    if (employee) {
      setValue('name', employee.name);
      setValue('email', employee.email);
      setValue('phone', employee.phone || '');
      setValue('specialty', employee.specialty || '');
      if (employee.photo_url) {
        setValue('photo_url', employee.photo_url);
      }
    }
  }, [employee, setValue]);

  const handleSave = (): void => {
    handleSubmit((data) => {
      const updateData: UpdateEmployeeData = {};
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
            router.push('/provider/employees');
          },
        }
      );
    })();
  };

  const handleDelete = (): void => {
    deleteEmployee.mutate(employeeId, {
      onSuccess: () => {
        router.push('/provider/employees');
      },
    });
  };

  const handleChangePhoto = (): void => {
    // TODO: Implementar cambio de foto
    console.log('Cambiar foto');
  };

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

  const handleCopySchedule = (): void => {
    // TODO: Implementar copiar horario
    console.log('Copiar horario');
  };

  const handleCancel = (): void => {
    router.push('/provider/employees');
  };

  if (isLoadingEmployee) {
    return (
      <div className="min-h-screen bg-[#201d12] flex flex-col">
        <EditEmployeeHeader onSave={handleSave} isSaving={false} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white font-poppins">Cargando empleado...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-[#201d12] flex flex-col">
        <EditEmployeeHeader onSave={handleSave} isSaving={false} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-400 font-poppins">Empleado no encontrado</p>
        </div>
      </div>
    );
  }

  const isSaving = updateEmployee.isPending;

  const employeeName = watch('name') || employee.name;
  const employeePhotoUrl = watch('photo_url') || employee.photo_url || undefined;

  return (
    <div className="min-h-screen bg-[#201d12] flex flex-col pb-20 md:pb-0">
      {/* Header */}
      <EditEmployeeHeader
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        employeeName={employeeName}
      />

      {/* Contenido */}
      <div className="flex-1 px-4 py-6 md:px-8 md:py-8">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          {/* Foto de perfil */}
          <EmployeeProfilePicture
            photoUrl={employeePhotoUrl}
            employeeName={employeeName}
            onChangePhoto={handleChangePhoto}
          />

          {/* Información Personal */}
          <EmployeePersonalInfo
            register={register}
            errors={errors}
          />

          {/* Servicios Asignados */}
          <AssignedServicesSection
            services={services}
            assignedServiceIds={assignedServiceIds}
            onToggleService={handleToggleService}
          />

          {/* Disponibilidad - Mobile */}
          <EmployeeAvailabilitySection
            schedules={weeklySchedule}
            onCopySchedule={handleCopySchedule}
          />

          {/* Botón Eliminar */}
          <DeleteEmployeeButton onDelete={handleDelete} />
        </div>

        {/* Desktop Layout - Grid de 2 columnas */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-6">
          {/* Columna Izquierda */}
          <div className="space-y-6">
            {/* Card de Perfil */}
            <EmployeeProfileCard
              photoUrl={employeePhotoUrl}
              employeeName={employeeName}
              specialty={watch('specialty') || employee.specialty}
              employeeId={employee.id}
              onChangePhoto={handleChangePhoto}
            />

            {/* Card de Información Personal */}
            <EmployeePersonalInfoCard
              register={register}
              errors={errors}
            />
          </div>

          {/* Columna Derecha */}
          <div className="space-y-6">
            {/* Servicios Asignados */}
            <AssignedServicesSection
              services={services}
              assignedServiceIds={assignedServiceIds}
              onToggleService={handleToggleService}
            />

            {/* Disponibilidad */}
            <EmployeeAvailabilitySection
              schedules={weeklySchedule}
              onCopySchedule={handleCopySchedule}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

