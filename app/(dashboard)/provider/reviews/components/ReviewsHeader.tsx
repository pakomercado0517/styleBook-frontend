'use client';

import type { ReactNode } from 'react';
import { Search, Filter } from 'lucide-react';

/**
 * Header de la página de reseñas
 * Mobile: solo título
 * Desktop: título, subtítulo, búsqueda y botón filtros
 */
export function ReviewsHeader(): ReactNode {
  return (
    <>
      {/* Mobile Header */}
      <div className="px-4 py-6 border-b border-white/10 md:hidden">
        <h1 className="text-2xl font-bold text-white font-playfair">Reseñas</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block px-8 py-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white font-playfair mb-1">Reseñas</h1>
            <p className="text-sm text-neutral-300 font-poppins">
              Gestiona y responde a los comentarios de tus clientes
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Barra de búsqueda */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="w-5 h-5 text-neutral-400" strokeWidth={2} />
              </div>
              <input
                type="text"
                placeholder="Buscar por cliente o servicio..."
                className="w-64 pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
                aria-label="Buscar reseñas"
              />
            </div>
            {/* Botón Filtros */}
            <button
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-poppins hover:bg-white/10 transition-colors"
              type="button"
            >
              <Filter className="w-5 h-5" strokeWidth={2} />
              <span>Filtros</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

