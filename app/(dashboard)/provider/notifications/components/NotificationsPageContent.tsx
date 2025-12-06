'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { NotificationsHeader } from './NotificationsHeader';
import { NotificationFilters } from './NotificationFilters';
import { NotificationsList } from './NotificationsList';

type NotificationFilter = 'all' | 'reservations' | 'messages' | 'reviews';

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

/**
 * Contenido principal de la página de notificaciones
 * Diseño mobile-first
 */
export function NotificationsPageContent(): ReactNode {
  const [selectedFilter, setSelectedFilter] = useState<NotificationFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Datos de ejemplo - TODO: Obtener del backend
  const allNotifications: Notification[] = [
    {
      id: 1,
      type: 'new_reservation',
      title: 'Nueva reserva de Sofía Pérez',
      message: 'Manicura completa para el 15 de Mayo a las 11:00 AM.',
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isRead: false,
      metadata: {
        clientName: 'Sofía Pérez',
        serviceName: 'Manicura completa',
        date: '15 de Mayo',
        time: '11:00 AM',
      },
    },
    {
      id: 2,
      type: 'new_message',
      title: 'Nuevo mensaje de Laura Gómez',
      message: '"Hola, ¿tenéis disponibilidad para un tratamiento facial esta tarde?"',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      metadata: {
        clientName: 'Laura Gómez',
      },
    },
    {
      id: 3,
      type: 'cancellation',
      title: 'Cancelación de cita',
      message: 'Juan Rodríguez ha cancelado su cita de corte de pelo de mañana.',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      metadata: {
        clientName: 'Juan Rodríguez',
        serviceName: 'Corte de pelo',
      },
    },
    {
      id: 4,
      type: 'new_review',
      title: 'Has recibido una nueva reseña',
      message: 'de Elena García.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      metadata: {
        clientName: 'Elena García',
        rating: 5,
      },
    },
    {
      id: 5,
      type: 'payment_received',
      title: 'Pago recibido',
      message: 'Has recibido un pago de 45,00€ de Ana Torres.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      metadata: {
        clientName: 'Ana Torres',
        amount: 45.0,
      },
    },
  ];

  // Filtrar notificaciones según el filtro seleccionado, búsqueda y fecha
  const filteredNotifications = allNotifications.filter((notification) => {
    // Filtro por tipo
    let matchesFilter = true;
    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'reservations':
          matchesFilter =
            notification.type === 'new_reservation' ||
            notification.type === 'cancellation';
          break;
        case 'messages':
          matchesFilter = notification.type === 'new_message';
          break;
        case 'reviews':
          matchesFilter = notification.type === 'new_review';
          break;
        default:
          matchesFilter = true;
      }
    }

    // Filtro por búsqueda
    const matchesSearch =
      searchQuery === '' ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.metadata?.clientName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Filtro por fecha
    let matchesDate = true;
    if (selectedDate) {
      const notificationDate = new Date(notification.createdAt).toISOString().split('T')[0];
      matchesDate = notificationDate === selectedDate;
    }

    return matchesFilter && matchesSearch && matchesDate;
  });

  const handleMarkAllAsRead = (): void => {
    // TODO: Implementar llamada al backend
    toast.success('Todas las notificaciones marcadas como leídas');
  };

  const handleNotificationClick = (_notificationId: number): void => {
    // TODO: Implementar navegación o acción según el tipo de notificación
    toast.info('Navegando a la notificación...');
  };

  return (
    <div className="min-h-full bg-[#201d12] flex flex-col">
      {/* Header */}
      <NotificationsHeader
        onMarkAllAsRead={handleMarkAllAsRead}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFilter={selectedFilter}
        onFilterChange={(filter) => setSelectedFilter(filter as NotificationFilter)}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Mobile: Filtros de notificaciones */}
        <div className="md:hidden">
          <NotificationFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>

        {/* Lista de notificaciones */}
        <div className="py-4 md:px-8">
          <NotificationsList
            notifications={filteredNotifications}
            onNotificationClick={handleNotificationClick}
          />
        </div>
      </div>
    </div>
  );
}

