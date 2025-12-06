'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Search, Bell, Filter } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

/**
 * Header de la página de appointments del proveedor
 * Mobile: título y búsqueda
 * Desktop: título, filtros, búsqueda, notificaciones y avatar
 */
export function AppointmentsHeader(): ReactNode {
  const { user } = useAuth();
  const userName = user?.name || 'Usuario';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-white/10">
        <h1 className="text-xl font-bold text-white font-poppins">
          Gestionar Citas
        </h1>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Buscar"
          type="button"
        >
          <Search className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-8 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white font-poppins">
          Gestionar Citas
        </h1>
        <div className="flex items-center gap-4">
          {/* Botón Filtros */}
          <button
            className="px-4 py-2 rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors font-poppins text-sm font-medium flex items-center gap-2"
            type="button"
          >
            <Filter className="w-4 h-4" strokeWidth={2} />
            Filtros
          </button>

          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={2} />
            <input
              type="text"
              placeholder="Buscar citas..."
              className="pl-10 pr-4 py-2 rounded-lg bg-white/5 text-white border border-white/10 placeholder:text-neutral-400 focus:outline-none focus:border-accent-500/50 font-poppins text-sm w-64"
            />
          </div>

          {/* Notificaciones */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Notificaciones"
            type="button"
          >
            <Bell className="w-5 h-5 text-white" strokeWidth={2} />
          </button>

          {/* Avatar */}
          <Link
            href="/provider/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border-2 border-white/30 hover:bg-white/20 transition-colors"
            aria-label="Perfil"
          >
            <span className="text-white font-semibold text-sm">{userInitial}</span>
          </Link>
        </div>
      </div>
    </>
  );
}
