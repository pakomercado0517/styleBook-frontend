'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Scissors,
  Palette,
  Sparkles,
  Hand,
  Footprints,
  Droplets,
  User,
  CircleUser,
  Waves,
  Flower2,
  Sparkle,
  MoreVertical,
  CircleDot,
  Activity,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAppointments } from '@/lib/api/appointments';
import { formatDateShortEn, formatTime12h, isToday } from '@/lib/utils/dateUtils';
import type { Appointment } from '@/lib/types/appointments';
import type { ServiceCategory } from '@/lib/types/services';

/**
 * Mapea la categoría del servicio a un icono de Lucide
 */
function getServiceIcon(category: ServiceCategory | undefined): LucideIcon {
  const iconMap: Record<ServiceCategory, LucideIcon> = {
    corte: Scissors,
    tinte: Palette,
    peinado: Sparkles,
    manicure: Hand,
    pedicure: Footprints,
    tratamiento_capilar: Droplets,
    barba: User,
    afeitado: Scissors, // Usar Scissors para afeitado
    masaje: Activity, // Usar Activity para masaje (representa movimiento/terapia)
    facial: CircleUser,
    corporal: Waves,
    aromaterapia: Flower2,
    limpieza_dental: CircleDot, // Usar CircleDot para dental
    estetica_dental: Sparkle,
  };

  return category ? iconMap[category] : Scissors;
}

/**
 * Formatea la fecha para mostrar "Hoy" si es hoy, o la fecha corta
 */
function formatAppointmentDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isToday(date)) {
    return 'Hoy';
  }
  return formatDateShortEn(isoDate);
}

/**
 * Lista compacta de citas próximas para el dashboard
 * Diseño tipo card oscura con icono dorado según el tipo de servicio
 */
export function UpcomingAppointmentsList(): ReactNode {
  const { data, isLoading } = useQuery({
    queryKey: ['appointments', 'upcoming'],
    queryFn: async () => {
      const now = new Date();
      const result = await getAppointments({
        limit: 5,
        start_date: now.toISOString(),
        include: 'service,provider',
      });

      if (!result.success) {
        return { appointments: [] };
      }

      // Filtrar solo citas confirmadas o pendientes y ordenar por fecha
      const appointments = (result.data?.data?.appointments || [])
        .filter(
          (apt: Appointment) =>
            (apt.status === 'confirmed' || apt.status === 'pending') &&
            new Date(apt.start_date_local) >= now
        )
        .sort(
          (a: Appointment, b: Appointment) =>
            new Date(a.start_date_local).getTime() -
            new Date(b.start_date_local).getTime()
        )
        .slice(0, 3); // Máximo 3 citas próximas

      return { appointments };
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  const appointments = data?.appointments || [];

  if (isLoading) {
    return (
      <div className="space-y-3 px-4 md:px-0">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-white/5 px-4 py-4 animate-pulse rounded-xl"
          >
            <div className="h-14 w-14 shrink-0 rounded-lg bg-white/10"></div>
            <div className="flex flex-col justify-center flex-1 gap-2">
              <div className="h-5 w-40 bg-white/10 rounded"></div>
              <div className="h-4 w-32 bg-white/10 rounded"></div>
              <div className="h-3 w-48 bg-white/10 rounded"></div>
            </div>
            <div className="h-6 w-6 shrink-0 rounded bg-white/10"></div>
          </div>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-neutral-300 font-poppins text-sm">
          No tienes citas próximas
        </p>
        <Link
          href="/client/services"
          className="mt-4 inline-block text-accent-400 hover:text-accent-300 font-poppins font-medium text-sm"
        >
          Explorar servicios →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 px-4 md:px-0">
      {appointments.map((appointment: Appointment) => {
        const serviceName =
          appointment.service?.name || `Servicio #${appointment.service_id}`;
        const providerName =
          appointment.provider?.business_name ||
          appointment.service?.provider?.business_name ||
          'Proveedor';
        const serviceCategory = appointment.service?.category;
        // Mostrar "Premium" como ejemplo, pero esto debería venir del servicio si existe
        const serviceTier = 'Premium';

        const displayDate = formatAppointmentDate(appointment.start_date_local);
        const dateObj = new Date(appointment.start_date_local);
        const time24h = dateObj.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

        const ServiceIcon = getServiceIcon(serviceCategory);

        return (
          <div
            key={appointment.id}
            className="relative flex items-start gap-3 bg-white/5 hover:bg-white/10 transition-colors rounded-xl px-4 py-4 cursor-pointer group w-full sm:w-[calc(50%-0.375rem)] md:w-[calc(33.333%-0.5rem)] lg:w-[calc(25%-0.75rem)] min-w-[280px] max-w-sm"
            tabIndex={0}
            role="button"
            aria-label={`Cita: ${serviceName} el ${displayDate} a las ${time24h}`}
            onClick={() => {
              window.location.href = `/client/appointments/${appointment.id}`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = `/client/appointments/${appointment.id}`;
              }
            }}
          >
            {/* Icono del servicio - Dorado */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-500/20 mt-0.5">
              <ServiceIcon 
                className="w-6 h-6" 
                strokeWidth={2}
                style={{ color: '#D4AF37' }}
              />
            </div>

            {/* Contenido de texto */}
            <div className="flex flex-col justify-start flex-1 min-w-0">
              {/* Título del servicio */}
              <p className="text-sm font-bold leading-tight text-white font-poppins mb-0.5">
                {serviceName}
              </p>

              {/* Tier/Nivel del servicio */}
              <p className="text-base font-bold leading-tight text-accent-500 font-poppins mb-1.5">
                {serviceTier}
              </p>

              {/* Fecha y hora */}
              <p className="text-xs font-normal leading-normal text-neutral-300 font-poppins mb-1">
                {displayDate}, {time24h}
              </p>

              {/* Estilista y Salón */}
              <p className="text-xs font-normal leading-normal text-neutral-300 font-poppins">
                con Estilista de Élite en '{providerName}'
              </p>
            </div>

            {/* Menú de opciones (tres puntos verticales) */}
            <button
              className="flex h-5 w-5 shrink-0 items-center justify-center text-neutral-400 hover:text-white transition-colors mt-0.5"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Abrir menú de opciones (cancelar, editar, etc.)
              }}
              aria-label="Opciones de la cita"
              type="button"
            >
              <MoreVertical className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

