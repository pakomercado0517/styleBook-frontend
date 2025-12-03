'use client';

import type { ReactNode } from 'react';
import { Select } from '@/components/Select';
import { Input } from '@/components/Input';
import type { AppointmentStatus } from '@/lib/types/appointments';
import { useMyProviderProfile } from '@/lib/hooks/useMyProviderProfile';
import { useEmployeesByProvider } from '@/lib/hooks/useEmployees';

interface AppointmentsFiltersProps {
  selectedStatus: AppointmentStatus | 'all';
  selectedDateRange: { start?: string; end?: string };
  selectedEmployee: number | 'all';
  onStatusChange: (status: AppointmentStatus | 'all') => void;
  onDateRangeChange: (range: { start?: string; end?: string }) => void;
  onEmployeeChange: (employeeId: number | 'all') => void;
}

/**
 * Filtros para citas del proveedor
 */
export function AppointmentsFilters({
  selectedStatus,
  selectedDateRange,
  selectedEmployee,
  onStatusChange,
  onDateRangeChange,
  onEmployeeChange,
}: AppointmentsFiltersProps): ReactNode {
  const { data: providerProfile } = useMyProviderProfile();
  const { data: employeesData } = useEmployeesByProvider(
    providerProfile?.id || 0
  );

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'confirmed', label: 'Confirmadas' },
    { value: 'completed', label: 'Completadas' },
    { value: 'cancelled', label: 'Canceladas' },
    { value: 'no_show', label: 'No asistió' },
  ];

  const employeeOptions = [
    { value: 'all', label: 'Todos los empleados' },
    ...(employeesData?.data?.data?.map((employee) => ({
      value: employee.id.toString(),
      label: employee.name,
    })) || []),
  ];

  return (
    <div className="bg-white rounded-2xl border-2 border-neutral-200 p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por estado */}
        <Select
          label="Estado"
          value={selectedStatus}
          onChange={(e) =>
            onStatusChange(e.target.value as AppointmentStatus | 'all')
          }
          options={statusOptions}
        />

        {/* Filtro por empleado */}
        <Select
          label="Empleado"
          value={
            selectedEmployee === 'all'
              ? 'all'
              : selectedEmployee.toString()
          }
          onChange={(e) =>
            onEmployeeChange(
              e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10)
            )
          }
          options={employeeOptions}
        />

        {/* Filtro por fecha inicio */}
        <Input
          label="Desde"
          type="date"
          value={selectedDateRange.start || ''}
          onChange={(e) =>
            onDateRangeChange({
              ...selectedDateRange,
              start: e.target.value || undefined,
            })
          }
        />

        {/* Filtro por fecha fin */}
        <Input
          label="Hasta"
          type="date"
          value={selectedDateRange.end || ''}
          onChange={(e) =>
            onDateRangeChange({
              ...selectedDateRange,
              end: e.target.value || undefined,
            })
          }
        />
      </div>
    </div>
  );
}

