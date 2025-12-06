'use client';

import type { ReactNode } from 'react';
import { NotificationCard } from './NotificationCard';

interface Notification {
  id: number;
  type:
    | 'new_reservation'
    | 'new_message'
    | 'cancellation'
    | 'new_review'
    | 'payment_received';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  metadata?: {
    clientName?: string;
    serviceName?: string;
    date?: string;
    time?: string;
    rating?: number;
    amount?: number;
  };
}

interface NotificationsListProps {
  notifications: Notification[];
  onNotificationClick?: (notificationId: number) => void;
  isLoading?: boolean;
}

/**
 * Lista de notificaciones
 * Muestra cards de notificaciones apiladas verticalmente
 */
export function NotificationsList({
  notifications,
  onNotificationClick,
  isLoading = false,
}: NotificationsListProps): ReactNode {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-white font-poppins">Cargando notificaciones...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white text-lg mb-2 font-poppins">No hay notificaciones</p>
        <p className="text-neutral-300 font-poppins">
          No tienes notificaciones en este momento
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-4">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onClick={() => onNotificationClick?.(notification.id)}
        />
      ))}
    </div>
  );
}

