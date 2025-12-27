'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Search, Plus } from 'lucide-react';
import type { AppointmentStatus } from '@/lib/types/appointments';
import { AppointmentsList } from './components/AppointmentsList';
import { AppointmentDetailsSidebar } from './components/AppointmentDetailsSidebar';

type TabFilter = 'upcoming' | 'past' | 'cancelled';

/**
 * Página de Mis Citas - Cliente
 * Rediseño mobile-first con tabs de navegación y versión desktop con sidebar
 */
export default function AppointmentsPage(): ReactNode {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabFilter>('upcoming');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleBack = (): void => {
    router.back();
  };

  const handleTabChange = (tab: TabFilter): void => {
    setActiveTab(tab);
    setSelectedAppointmentId(null); // Limpiar selección al cambiar de tab
  };

  const handleNewAppointment = (): void => {
    router.push('/client/services');
  };

  // Mapear tabs a estados de citas
  const getStatusFromTab = (tab: TabFilter): AppointmentStatus | undefined => {
    switch (tab) {
      case 'upcoming':
        return undefined; // Mostrar pending y confirmed
      case 'past':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      default:
        return undefined;
    }
  };

  // Para "Próximas", necesitamos filtrar por fechas futuras y estados pending/confirmed
  const status = getStatusFromTab(activeTab);
  const isUpcoming = activeTab === 'upcoming';

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* Header - Mobile */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 md:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Volver"
            type="button"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
          <h1 className="text-xl font-bold text-white font-playfair">
            Mis Citas
          </h1>
        </div>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Más opciones"
          type="button"
        >
          <MoreVertical className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
      </div>

      {/* Header - Desktop */}
      <div className="hidden md:flex items-center justify-between px-8 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white font-playfair">
          Mis Citas
        </h1>
        <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar citas..."
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500"
            />
          </div>
        </div>
        <button
          onClick={handleNewAppointment}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold font-poppins transition-colors"
          style={{
            backgroundColor: '#D4AF37',
            color: '#1A1A1A',
          }}
          type="button"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Cita</span>
        </button>
      </div>

      {/* Tabs de navegación */}
      <div className="px-4 md:px-8 pt-4 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => handleTabChange('upcoming')}
            className={`
              flex-1 md:flex-none md:px-6 px-4 py-3 rounded-xl text-sm font-semibold font-poppins transition-all
              ${activeTab === 'upcoming' ? '' : 'bg-white/5 text-white'}
            `}
            style={
              activeTab === 'upcoming'
                ? {
                    backgroundColor: '#D4AF37',
                    color: '#1A1A1A',
                  }
                : {}
            }
            type="button"
          >
            Próximas
          </button>
          <button
            onClick={() => handleTabChange('past')}
            className={`
              flex-1 md:flex-none md:px-6 px-4 py-3 rounded-xl text-sm font-semibold font-poppins transition-all
              ${activeTab === 'past' ? '' : 'bg-white/5 text-white'}
            `}
            style={
              activeTab === 'past'
                ? {
                    backgroundColor: '#D4AF37',
                    color: '#1A1A1A',
                  }
                : {}
            }
            type="button"
          >
            Pasadas
          </button>
          <button
            onClick={() => handleTabChange('cancelled')}
            className={`
              flex-1 md:flex-none md:px-6 px-4 py-3 rounded-xl text-sm font-semibold font-poppins transition-all
              ${activeTab === 'cancelled' ? '' : 'bg-white/5 text-white'}
            `}
            style={
              activeTab === 'cancelled'
                ? {
                    backgroundColor: '#D4AF37',
                    color: '#1A1A1A',
                  }
                : {}
            }
            type="button"
          >
            Canceladas
          </button>
        </div>
      </div>

      {/* Layout Desktop: Dos columnas */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Columna izquierda - Lista de citas */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <AppointmentsList
            status={status}
            isUpcoming={isUpcoming}
            searchQuery={searchQuery}
            onSelectAppointment={setSelectedAppointmentId}
            selectedAppointmentId={selectedAppointmentId}
          />
        </div>

        {/* Columna derecha - Sidebar de detalles */}
        <div className="w-96 flex-shrink-0 border-l border-white/10 bg-white/5 overflow-y-auto">
          {selectedAppointmentId ? (
            <div className="pt-6">
              <AppointmentDetailsSidebar
                appointmentId={selectedAppointmentId}
                onClose={() => setSelectedAppointmentId(null)}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center px-6 py-6">
              <p className="text-neutral-400 font-poppins text-center">
                Selecciona una cita para ver los detalles
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contenido Mobile */}
      <div className="md:hidden flex-1 overflow-y-auto px-4 py-6">
        <AppointmentsList
          status={status}
          isUpcoming={isUpcoming}
          searchQuery={searchQuery}
        />
      </div>

      {/* FAB - Floating Action Button (Mobile Only) */}
      <button
        onClick={handleNewAppointment}
        className="fixed bottom-24 right-6 h-16 w-16 rounded-full shadow-lg hover:shadow-xl transition-shadow md:hidden flex items-center justify-center"
        aria-label="Nueva cita"
        style={{
          backgroundColor: '#D4AF37',
          color: '#1A1A1A',
          boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
        }}
        type="button"
      >
        <Plus className="w-6 h-6" strokeWidth={3} />
      </button>
    </div>
  );
}
