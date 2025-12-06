'use client';

import type { ReactNode } from 'react';
import { use } from 'react';
import { AppointmentDetails } from './components/AppointmentDetails';

interface AppointmentDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Página de Detalle de Cita - Proveedor
 * Muestra información completa de una cita específica con acciones del proveedor
 */
export default function ProviderAppointmentDetailPage({
  params,
}: AppointmentDetailPageProps): ReactNode {
  const { id } = use(params);
  const appointmentId = parseInt(id, 10);

  if (isNaN(appointmentId)) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h3 className="font-playfair text-xl font-bold text-red-800 mb-2">
            ID de cita inválido
          </h3>
          <p className="text-red-600 font-poppins">
            El ID de la cita no es válido
          </p>
        </div>
      </div>
    );
  }

  return <AppointmentDetails appointmentId={appointmentId} />;
}




