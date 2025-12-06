'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Calendar, Plus } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

/**
 * Header del dashboard del proveedor
 * Muestra hamburger menu, título, botones de acción, notificaciones y avatar
 */
export function DashboardHeader(): ReactNode {
  const { user } = useAuth();
  const router = useRouter();
  const userName = user?.name || 'Usuario';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleViewCalendar = (): void => {
    router.push('/provider/appointments');
  };

  const handleAddService = (): void => {
    router.push('/provider/services/new');
  };

  return (
    <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 md:px-8">
      {/* Título centrado - Mobile */}
      <div className="flex-1 flex flex-col items-center text-center md:hidden">
        <h1 className="text-xl font-bold text-white font-poppins">Dashboard</h1>
      </div>

      {/* Título - Desktop */}
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold text-white font-poppins">Dashboard</h1>
      </div>

      {/* Botones de acción y Notificaciones/Avatar */}
      <div className="flex items-center gap-3">
        {/* Botones Ver Calendario y Agregar Servicio - Solo visible en desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handleViewCalendar}
            className="px-4 py-2 rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors font-poppins text-sm font-medium flex items-center gap-2"
            type="button"
          >
            <Calendar className="w-4 h-4" strokeWidth={2} />
            Ver Calendario
          </button>
          <button
            onClick={handleAddService}
            className="px-4 py-2 rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors font-poppins text-sm font-medium flex items-center gap-2"
            type="button"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Agregar Servicio
          </button>
        </div>

        {/* Notificaciones */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Notificaciones"
          type="button"
        >
          <Bell className="w-5 h-5 text-white" strokeWidth={2} />
        </button>

        {/* Avatar */}
        <Link
          href="/provider/profile"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border-2 border-white/30 hover:bg-white/20 transition-colors flex-shrink-0"
          aria-label="Perfil"
        >
          <span className="text-white font-semibold text-sm">{userInitial}</span>
        </Link>
      </div>
    </div>
  );
}

