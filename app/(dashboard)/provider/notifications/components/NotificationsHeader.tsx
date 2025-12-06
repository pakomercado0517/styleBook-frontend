'use client';

import type { ReactNode } from 'react';
import { Check, Search, ChevronDown, Calendar } from 'lucide-react';
import { useState } from 'react';

interface NotificationsHeaderProps {
  onMarkAllAsRead?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
}

/**
 * Header de la página de notificaciones
 * Mobile: título y botón "Marcar leídas"
 * Desktop: título, búsqueda, dropdown filtro, fecha y botón "Marcar todas como leídas"
 */
export function NotificationsHeader({
  onMarkAllAsRead,
  searchQuery = '',
  onSearchChange,
  selectedFilter = 'all',
  onFilterChange,
  selectedDate = '',
  onDateChange,
}: NotificationsHeaderProps): ReactNode {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'reservations', label: 'Reservas' },
    { value: 'messages', label: 'Mensajes' },
    { value: 'reviews', label: 'Reseñas' },
  ];

  const currentFilterLabel =
    filterOptions.find((opt) => opt.value === selectedFilter)?.label || 'Todas';

  return (
    <>
      {/* Mobile Header */}
      <div className="px-4 py-6 border-b border-white/10 md:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white font-poppins">Notificaciones</h1>
          {onMarkAllAsRead && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold font-poppins transition-colors shrink-0"
              style={{
                color: '#D4AF37',
              }}
              type="button"
            >
              <Check className="w-5 h-5" strokeWidth={2} />
              <span>Marcar leídas</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block px-8 py-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white font-poppins">Notificaciones</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Barra de búsqueda */}
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="w-5 h-5 text-neutral-400" strokeWidth={2} />
            </div>
            <input
              type="text"
              placeholder="Buscar notificaciones..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
              aria-label="Buscar notificaciones"
            />
          </div>

          {/* Dropdown Filtro */}
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-poppins hover:bg-white/10 transition-colors min-w-[140px] justify-between"
              type="button"
            >
              <span>{currentFilterLabel}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isFilterDropdownOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={2}
              />
            </button>
            {isFilterDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsFilterDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-full bg-[#201d12] border border-white/10 rounded-xl shadow-lg z-20 overflow-hidden">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onFilterChange?.(option.value);
                        setIsFilterDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left font-poppins transition-colors text-white hover:bg-white/5"
                      style={
                        selectedFilter === option.value
                          ? {
                              backgroundColor: 'rgba(212, 175, 55, 0.2)',
                              color: '#D4AF37',
                            }
                          : { color: '#FFFFFF' }
                      }
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Campo de fecha */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Calendar className="w-5 h-5 text-neutral-400" strokeWidth={2} />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange?.(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-poppins focus:outline-none focus:border-accent-500 transition-colors min-w-[160px]"
              aria-label="Filtrar por fecha"
            />
          </div>

          {/* Botón Marcar todas como leídas */}
          {onMarkAllAsRead && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold font-poppins transition-colors whitespace-nowrap"
              style={{
                backgroundColor: '#D4AF37',
                color: '#1A1A1A',
              }}
              type="button"
            >
              <Check className="w-5 h-5" strokeWidth={2} />
              <span>Marcar todas como leídas</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

