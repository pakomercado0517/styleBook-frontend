'use client';

import type { ReactNode } from 'react';
import { Calendar, Star, X } from 'lucide-react';

interface ActivityItem {
  id: number;
  type: 'booking' | 'review' | 'cancellation';
  title: string;
  description: string;
  time: string;
}

/**
 * Lista de actividad reciente del proveedor
 */
export function RecentActivity(): ReactNode {
  // Datos de ejemplo - se pueden obtener del backend
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: 'booking',
      title: 'Nueva reserva confirmada',
      description: 'María P. - Manicura | Hace 5 min',
      time: '5 min',
    },
    {
      id: 2,
      type: 'review',
      title: 'Reseña de 5 estrellas recibida',
      description: 'De Juan G. | Hace 1 hora',
      time: '1 hora',
    },
    {
      id: 3,
      type: 'cancellation',
      title: 'Cancelación de cita',
      description: 'Laura M. - Mañana 11:00 AM | Hace 2 horas',
      time: '2 horas',
    },
    {
      id: 4,
      type: 'booking',
      title: 'Nueva reserva confirmada',
      description: 'Ana C. - Pedicura | Hace 4 horas',
      time: '4 horas',
    },
  ];

  const getIcon = (type: ActivityItem['type']): ReactNode => {
    switch (type) {
      case 'booking':
        return (
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
        );
      case 'review':
        return (
          <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 text-primary-900" fill="currentColor" strokeWidth={2} />
          </div>
        );
      case 'cancellation':
        return (
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
            <X className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
        );
    }
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <h2 className="text-lg font-bold text-white font-playfair mb-4">
        Actividad Reciente
      </h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            {getIcon(activity.type)}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white font-poppins mb-1">
                {activity.title}
              </h3>
              <p className="text-sm text-neutral-300 font-poppins">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

