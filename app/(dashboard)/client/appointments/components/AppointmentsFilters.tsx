'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import type { AppointmentStatus } from '@/lib/types/appointments';

const statusFilters: { value: AppointmentStatus; label: string }[] = [
  { value: 'pending', label: 'Pendientes' },
  { value: 'confirmed', label: 'Confirmadas' },
  { value: 'completed', label: 'Completadas' },
  { value: 'cancelled', label: 'Canceladas' },
];

export function AppointmentsFilters() {
  const [activeFilter, setActiveFilter] =
    useState<AppointmentStatus>('pending');

  return (
    <div className="flex flex-wrap gap-3">
      {statusFilters.map(({ value, label }) => (
        <Button
          key={value}
          variant={activeFilter === value ? 'primary' : 'outline'}
          onClick={() => setActiveFilter(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
