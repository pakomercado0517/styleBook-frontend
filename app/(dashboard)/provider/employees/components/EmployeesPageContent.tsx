'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useMyProviderProfile } from '@/lib/hooks/useMyProviderProfile';
import { useEmployeesByProvider, useDeleteEmployee } from '@/lib/hooks/useEmployees';
import { EmployeesList } from './EmployeesList';
import { EmployeesHeader } from './EmployeesHeader';
import { AddEmployeeButton } from './AddEmployeeButton';

/**
 * Contenido principal de la página de empleados del proveedor
 * Diseño mobile-first
 */
export function EmployeesPageContent(): ReactNode {
  const router = useRouter();
  const { data: providerProfile, isLoading: isLoadingProfile } =
    useMyProviderProfile();
  const deleteEmployee = useDeleteEmployee();

  // Query para obtener empleados del proveedor
  const {
    data: employees = [],
    isLoading: isLoadingEmployees,
    isError,
    error,
  } = useEmployeesByProvider(providerProfile?.id || 0, {
    limit: 50, // Obtener todos los empleados
  });

  const handleCreateEmployee = (): void => {
    router.push('/provider/employees/create');
  };

  const handleEditEmployee = (employeeId: number): void => {
    router.push(`/provider/employees/${employeeId}/edit`);
  };

  const handleDeleteEmployee = (employeeId: number): void => {
    deleteEmployee.mutate(employeeId);
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col">
        <EmployeesHeader onCreateEmployee={handleCreateEmployee} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white font-poppins">Cargando perfil del proveedor...</p>
        </div>
      </div>
    );
  }

  if (!providerProfile) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col">
        <EmployeesHeader onCreateEmployee={handleCreateEmployee} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-400 font-poppins">
            No se pudo cargar el perfil del proveedor
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#121212] flex flex-col">
      {/* Header */}
      <EmployeesHeader onCreateEmployee={handleCreateEmployee} />

      {/* Contenido principal */}
      <div className="flex-1 px-4 py-6 pb-20 md:px-8 md:py-8 space-y-4">
        {/* Mobile: Botón Añadir Nuevo Empleado */}
        <div className="md:hidden">
          <AddEmployeeButton onClick={handleCreateEmployee} />
        </div>

        {/* Lista de empleados */}
        <EmployeesList
          employees={employees}
          isLoading={isLoadingEmployees}
          isError={isError}
          error={error?.message}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
        />
      </div>
    </div>
  );
}

