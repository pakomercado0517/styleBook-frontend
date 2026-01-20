'use client';

import type { ReactNode } from 'react';
import { EmployeeCard } from './EmployeeCard';
import { EmployeeTableRow } from './EmployeeTableRow';
import type { Employee } from '@/lib/types/employees';

interface EmployeesListProps {
  employees: Employee[];
  isLoading: boolean;
  isError: boolean;
  error?: string;
  onEdit: (employeeId: number) => void;
  onDelete: (employeeId: number) => void;
}

/**
 * Lista de empleados - Diseño responsive
 * Mobile: cards verticales
 * Desktop: tabla
 */
export function EmployeesList({
  employees,
  isLoading,
  isError,
  error,
  onEdit,
  onDelete,
}: EmployeesListProps): ReactNode {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-white font-poppins">Cargando empleados...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 font-poppins">
          {error || 'Error al cargar los empleados'}
        </p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white text-lg mb-4 font-poppins">
          No tienes empleados registrados
        </p>
        <p className="text-neutral-300 font-poppins">
          Añade tu primer empleado haciendo clic en &quot;Añadir Nuevo Empleado&quot;
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: Cards */}
      <div className="md:hidden space-y-3">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Desktop: Tabla */}
      <div className="hidden md:block">
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          {/* Headers */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 bg-white/5">
            <div className="col-span-5">
              <h3 className="text-sm font-semibold text-white font-poppins">
                Nombre Completo
              </h3>
            </div>
            <div className="col-span-5">
              <h3 className="text-sm font-semibold text-white font-poppins">
                Rol / Especialidad
              </h3>
            </div>
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-white font-poppins">
                Acciones
              </h3>
            </div>
          </div>

          {/* Filas */}
          <div className="divide-y divide-white/10">
            {employees.map((employee) => (
              <EmployeeTableRow
                key={employee.id}
                employee={employee}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

