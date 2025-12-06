'use client';

import type { ReactNode } from 'react';
import { Bell, Search, Plus } from 'lucide-react';

interface ServicesHeaderProps {
  onCreateService: () => void;
}

/**
 * Header de la página de servicios del proveedor
 * Mobile: título y notificaciones
 * Desktop: título, búsqueda, botón añadir y notificaciones
 */
export function ServicesHeader({ onCreateService }: ServicesHeaderProps): ReactNode {
  return (
    <>
      {/* Mobile Header */}
      <div className="px-4 py-4 border-b border-white/10 md:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white font-poppins">Gestionar Servicios</h1>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Notificaciones"
            type="button"
          >
            <Bell className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-8 py-6 border-b border-white/10 gap-4">
        <h1 className="text-3xl font-bold text-white font-poppins">Gestionar Servicios</h1>
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          {/* Barra de búsqueda */}
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="w-5 h-5 text-neutral-400" strokeWidth={2} />
            </div>
            <input
              type="text"
              placeholder="Buscar servicio..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
              aria-label="Buscar servicio"
            />
          </div>
          {/* Botón Añadir Nuevo Servicio */}
          <button
            onClick={onCreateService}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold font-poppins transition-colors whitespace-nowrap"
            style={{
              backgroundColor: '#D4AF37',
              color: '#1A1A1A',
            }}
            type="button"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            <span>Añadir Nuevo Servicio</span>
          </button>
          {/* Notificaciones */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Notificaciones"
            type="button"
          >
            <Bell className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
        </div>
      </div>
    </>
  );
}

