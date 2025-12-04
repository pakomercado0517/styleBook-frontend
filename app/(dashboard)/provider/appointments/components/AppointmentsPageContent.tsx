'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { AppointmentsList } from './AppointmentsList';
import { AppointmentsFilters } from './AppointmentsFilters';
import type { AppointmentStatus } from '@/lib/types/appointments';

/**
 * Contenido principal de la página de citas del proveedor
 */
export function AppointmentsPageContent(): ReactNode {
  const [selectedStatus, setSelectedStatus] = useState<
    AppointmentStatus | 'all'
  >('all');
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start?: string;
    end?: string;
  }>({});
  const [selectedEmployee, setSelectedEmployee] = useState<number | 'all'>(
    'all'
  );

  const handleStatusChange = (status: AppointmentStatus | 'all'): void => {
    setSelectedStatus(status);
  };

  const handleDateRangeChange = (range: {
    start?: string;
    end?: string;
  }): void => {
    setSelectedDateRange(range);
  };

  const handleEmployeeChange = (employeeId: number | 'all'): void => {
    setSelectedEmployee(employeeId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-primary-800 mb-2">
          Mis Citas
        </h1>
        <p className="text-neutral-600 font-poppins text-base md:text-lg">
          Gestiona las citas de tu negocio
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6 md:mb-8">
        <AppointmentsFilters
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={handleDateRangeChange}
          selectedEmployee={selectedEmployee}
          onEmployeeChange={handleEmployeeChange}
        />
      </div>

      {/* Lista de citas */}
      <AppointmentsList
        status={selectedStatus === 'all' ? undefined : selectedStatus}
        startDate={selectedDateRange.start}
        endDate={selectedDateRange.end}
        employeeId={selectedEmployee === 'all' ? undefined : selectedEmployee}
      />
    </div>
  );
}

