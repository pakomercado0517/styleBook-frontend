'use client';

import type { ReactNode } from 'react';
import { Search, Plus } from 'lucide-react';

interface EmployeesHeaderProps {
  onCreateEmployee: () => void;
}

/**
 * Header de la página de empleados del proveedor
 * Mobile: título centrado
 * Desktop: título, subtítulo, búsqueda y botón añadir
 */
export function EmployeesHeader({
  onCreateEmployee,
}: EmployeesHeaderProps): ReactNode {
  return (
    <>
      {/* Mobile Header */}
      <div className="px-4 py-6 border-b border-white/10 md:hidden">
        <h1 className="text-2xl font-bold text-white font-poppins text-center">
          Mi Equipo
        </h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block px-8 py-8 border-b border-white/10">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white font-poppins mb-2">
              Mi Equipo
            </h1>
            <p className="text-base text-neutral-300 font-poppins">
              Gestiona los miembros de tu equipo y sus roles.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Barra de búsqueda */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="w-5 h-5 text-neutral-400" strokeWidth={2} />
              </div>
              <input
                type="text"
                placeholder="Buscar empleado..."
                className="w-64 pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
                aria-label="Buscar empleado"
              />
            </div>
            {/* Botón Añadir Nuevo Empleado */}
            <button
              onClick={onCreateEmployee}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold font-poppins transition-colors whitespace-nowrap"
              style={{
                backgroundColor: '#D4AF37',
                color: '#1A1A1A',
              }}
              type="button"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              <span>Añadir Nuevo Empleado</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

