'use client';

import type { ReactNode } from 'react';
import { Calendar, MessageSquare, Star, X, DollarSign, CalendarPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

type NotificationType =
  | 'new_reservation'
  | 'new_message'
  | 'cancellation'
  | 'new_review'
  | 'payment_received';

interface Notification {
  id: number;
  type: NotificationType;
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

interface NotificationCardProps {
  notification: Notification;
  onClick?: () => void;
}

/**
 * Card de notificación
 * Muestra icono, título, mensaje, timestamp y estado de lectura
 */
export function NotificationCard({
  notification,
  onClick,
}: NotificationCardProps): ReactNode {
  const formattedDate = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: es,
  });

  const getIcon = (): ReactNode => {
    const iconClass = 'w-6 h-6';
    const iconColor = notification.isRead ? '#6B7280' : '#D4AF37';
    const bgColor = notification.isRead
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(212, 175, 55, 0.2)';

    switch (notification.type) {
      case 'new_reservation':
        return (
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: bgColor,
            }}
          >
            <CalendarPlus
              className={iconClass}
              style={{ color: iconColor }}
              strokeWidth={2}
            />
          </div>
        );
      case 'new_message':
        return (
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: bgColor,
            }}
          >
            <MessageSquare
              className={iconClass}
              style={{ color: iconColor }}
              strokeWidth={2}
            />
          </div>
        );
      case 'cancellation':
        return (
          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: bgColor,
            }}
          >
            <Calendar
              className={iconClass}
              style={{ color: iconColor }}
              strokeWidth={2}
            />
            <X
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: iconColor }}
              strokeWidth={3}
            />
          </div>
        );
      case 'new_review':
        return (
          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: bgColor,
            }}
          >
            <MessageSquare
              className={iconClass}
              style={{ color: iconColor }}
              strokeWidth={2}
            />
            <Star
              className="absolute bottom-1 right-1 w-3 h-3"
              style={{ color: iconColor }}
              fill={iconColor}
              strokeWidth={2}
            />
          </div>
        );
      case 'payment_received':
        return (
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: bgColor,
            }}
          >
            <DollarSign
              className={iconClass}
              style={{ color: iconColor }}
              strokeWidth={2}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-start gap-3 cursor-pointer hover:bg-white/10 transition-colors"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={notification.title}
    >
      {/* Icono con indicador de no leída */}
      <div className="relative shrink-0">
        {getIcon()}
        {!notification.isRead && (
          <div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: '#D4AF37' }}
          />
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <h3
          className={`text-base font-semibold font-poppins mb-1 ${
            notification.isRead ? 'text-white' : 'text-white'
          }`}
        >
          {notification.title}
        </h3>
        <p className="text-sm text-neutral-300 font-poppins leading-relaxed mb-2">
          {notification.message}
        </p>
        {/* Rating para reseñas */}
        {notification.type === 'new_review' && notification.metadata?.rating && (
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const rating = notification.metadata?.rating || 0;
              return (
                <Star
                  key={star}
                  className="w-4 h-4"
                  style={{ color: '#D4AF37' }}
                  fill={star <= rating ? '#D4AF37' : 'transparent'}
                  strokeWidth={2}
                />
              );
            })}
          </div>
        )}
        <span className="text-xs text-neutral-400 font-poppins">{formattedDate}</span>
      </div>
    </div>
  );
}

