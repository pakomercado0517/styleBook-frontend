'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Clock } from 'lucide-react';
import { useService } from '@/lib/hooks/useServices';
import { useEmployeesByProvider } from '@/lib/hooks/useEmployees';
import { useEmployee } from '@/lib/hooks/useEmployees';
import { useState } from 'react';

interface SelectProfessionalStepProps {
  serviceId: number;
  onContinue?: (employeeId: number) => void;
}

/**
 * Paso 1: Selección de profesional
 * Pantalla mobile-first para elegir el profesional que realizará el servicio
 */
export function SelectProfessionalStep({
  serviceId,
  onContinue,
}: SelectProfessionalStepProps): ReactNode {
  const router = useRouter();
  const { data: service, isLoading: isLoadingService } = useService(serviceId);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  // Obtener empleados del proveedor
  const { data: employees = [], isLoading: isLoadingEmployees } = useEmployeesByProvider(
    service?.provider_id || 0,
    { limit: 20 }
  );

  const handleBack = (): void => {
    router.back();
  };

  const handleSelectEmployee = (employeeId: number): void => {
    setSelectedEmployeeId(employeeId);
  };

  const handleContinueClick = (): void => {
    if (selectedEmployeeId) {
      if (onContinue) {
        onContinue(selectedEmployeeId);
      } else {
        // Navegar al siguiente paso
        router.push(`/client/book/${serviceId}?step=datetime&employee=${selectedEmployeeId}`);
      }
    }
  };

  if (isLoadingService || isLoadingEmployees) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-4 border-b border-white/10">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Volver"
            type="button"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
          <h1 className="text-xl font-bold text-white font-playfair">Reservar: Profesional</h1>
        </div>

        {/* Loading state */}
        <div className="flex-1 px-4 py-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl bg-white/5 p-4 animate-pulse"
              >
                <div className="h-16 w-16 rounded-full bg-white/10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-white/10 rounded w-32"></div>
                  <div className="h-4 bg-white/10 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-4">
        <p className="text-white font-poppins mb-4">No se pudo cargar el servicio.</p>
        <button
          onClick={handleBack}
          className="px-6 py-3 rounded-lg bg-accent-500 text-primary-900 font-semibold font-poppins"
        >
          Volver
        </button>
      </div>
    );
  }

  // Formatear precio
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(service.price);

  // Formatear duración
  const hours = Math.floor(service.duration_minutes / 60);
  const minutes = service.duration_minutes % 60;
  const formattedDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* Header - Mobile */}
      <div className="flex items-center gap-4 px-4 py-4 border-b border-white/10 md:hidden">
        <button
          onClick={handleBack}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Volver"
          type="button"
        >
          <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
        <h1 className="text-xl font-bold text-white font-playfair">Reservar: Profesional</h1>
      </div>

      {/* Layout Desktop: Dos columnas */}
      <div className="hidden md:flex md:min-h-screen">
        {/* Columna izquierda - Selección de profesional */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          {/* Header Desktop */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="Volver"
              type="button"
            >
              <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400 font-poppins">Paso 1 de 3</span>
            </div>
          </div>

          {/* Título y subtítulo */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white font-playfair mb-2">
              Seleccionar Profesional
            </h1>
            <p className="text-base text-neutral-300 font-poppins">
              Elige con quién te gustaría tener tu cita.
            </p>
          </div>

          {/* Lista de profesionales - Desktop */}
          <div className="space-y-3">
            {employees.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-300 font-poppins">
                  No hay profesionales disponibles para este servicio.
                </p>
              </div>
            ) : (
              employees.map((employee) => {
                const isSelected = selectedEmployeeId === employee.id;

                return (
                  <button
                    key={employee.id}
                    onClick={() => handleSelectEmployee(employee.id)}
                    className={`
                      w-full flex items-center gap-4 rounded-xl p-4 transition-all relative
                      ${
                        isSelected
                          ? 'bg-white/10 border-2'
                          : 'bg-white/5 border-2 border-transparent'
                      }
                    `}
                    style={
                      isSelected
                        ? {
                            borderColor: '#D4AF37',
                          }
                        : {}
                    }
                    type="button"
                    aria-label={`Seleccionar ${employee.name}`}
                  >
                    {/* Avatar */}
                    <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {employee.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={employee.photo_url}
                          alt={`Foto de perfil de ${employee.name}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl text-white font-poppins">
                          {employee.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Información */}
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-lg font-bold text-white font-poppins truncate">
                        {employee.name}
                      </p>
                      <p className="text-sm text-white font-poppins truncate">
                        {employee.specialty || 'Profesional'}
                      </p>
                    </div>

                    {/* Checkmark si está seleccionado - Desktop */}
                    {isSelected && (
                      <div
                        className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#D4AF37' }}
                      >
                        <Check className="w-4 h-4 text-primary-900" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Columna derecha - Resumen de la reserva */}
        <div className="w-96 flex-shrink-0 border-l border-white/10 bg-white/5">
          <div className="sticky top-0 h-screen overflow-y-auto px-6 py-8">
            <h2 className="text-2xl font-bold text-white font-playfair mb-6">
              Resumen de la reserva
            </h2>

            <div className="space-y-6">
              {/* Servicio */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm font-semibold text-neutral-400 font-poppins mb-3">
                  Servicio
                </h3>
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    {service.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
                        <span className="text-2xl">💇</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-white font-playfair mb-1 truncate">
                      {service.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-neutral-300 font-poppins mb-2">
                      <Clock className="w-4 h-4" strokeWidth={2} />
                      <span>{formattedDuration}</span>
                    </div>
                    <p className="text-lg font-bold font-poppins" style={{ color: '#D4AF37' }}>
                      {formattedPrice}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profesional */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm font-semibold text-neutral-400 font-poppins mb-3">
                  Profesional
                </h3>
                {selectedEmployeeId ? (
                  <SelectedProfessionalSummary employeeId={selectedEmployeeId} />
                ) : (
                  <p className="text-sm text-neutral-400 font-poppins">Aún por seleccionar</p>
                )}
              </div>

              {/* Fecha y Hora */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm font-semibold text-neutral-400 font-poppins mb-3">
                  Fecha y Hora
                </h3>
                <p className="text-sm text-neutral-400 font-poppins">Aún por seleccionar</p>
              </div>
            </div>

            {/* Total y Botón Continuar */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-6">
                <p className="text-lg font-semibold text-white font-poppins">Total</p>
                <p className="text-2xl font-bold font-poppins" style={{ color: '#D4AF37' }}>
                  {formattedPrice}
                </p>
              </div>
              <button
                onClick={handleContinueClick}
                disabled={!selectedEmployeeId}
                className={`
                  w-full h-14 rounded-xl text-lg font-bold transition-colors font-poppins
                  ${
                    selectedEmployeeId
                      ? ''
                      : 'opacity-50 cursor-not-allowed'
                  }
                `}
                style={
                  selectedEmployeeId
                    ? {
                        backgroundColor: '#D4AF37',
                        color: '#1A1A1A',
                      }
                    : {
                        backgroundColor: '#D4AF37',
                        color: '#1A1A1A',
                      }
                }
                type="button"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Mobile */}
      <div className="md:hidden">
        {/* Lista de profesionales */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-3">
            {employees.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-300 font-poppins">
                  No hay profesionales disponibles para este servicio.
                </p>
              </div>
            ) : (
              employees.map((employee) => {
                const isSelected = selectedEmployeeId === employee.id;

                return (
                  <button
                    key={employee.id}
                    onClick={() => handleSelectEmployee(employee.id)}
                    className={`
                      w-full flex items-center gap-4 rounded-xl p-4 transition-all
                      ${
                        isSelected
                          ? 'bg-white/10 border-2'
                          : 'bg-white/5 border-2 border-transparent'
                      }
                    `}
                    style={
                      isSelected
                        ? {
                            borderColor: '#D4AF37',
                          }
                        : {}
                    }
                    type="button"
                    aria-label={`Seleccionar ${employee.name}`}
                  >
                    {/* Avatar */}
                    <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {employee.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={employee.photo_url}
                          alt={`Foto de perfil de ${employee.name}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl text-white font-poppins">
                          {employee.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Información */}
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-lg font-bold text-white font-poppins truncate">
                        {employee.name}
                      </p>
                      <p className="text-sm text-white font-poppins truncate">
                        {employee.specialty || 'Profesional'}
                      </p>
                    </div>

                    {/* Checkmark si está seleccionado */}
                    {isSelected && (
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#D4AF37' }}
                      >
                        <Check className="w-4 h-4 text-primary-900" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Botón Continuar */}
        <div className="px-4 py-4 border-t border-white/10 pb-20">
          <button
            onClick={handleContinueClick}
            disabled={!selectedEmployeeId}
            className={`
              w-full h-14 rounded-xl text-lg font-bold transition-colors font-poppins
              ${
                selectedEmployeeId
                  ? ''
                  : 'opacity-50 cursor-not-allowed'
              }
            `}
            style={
              selectedEmployeeId
                ? {
                    backgroundColor: '#D4AF37',
                    color: '#1A1A1A',
                  }
                : {
                    backgroundColor: '#D4AF37',
                    color: '#1A1A1A',
                  }
            }
            type="button"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente para mostrar el resumen del profesional seleccionado
 */
function SelectedProfessionalSummary({ employeeId }: { employeeId: number }): ReactNode {
  const { data: employee, isLoading } = useEmployee(employeeId);

  if (isLoading) {
    return (
      <div className="flex gap-3 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-white/10"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-24"></div>
          <div className="h-3 bg-white/10 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return <p className="text-sm text-neutral-400 font-poppins">Profesional no encontrado</p>;
  }

  return (
    <div className="flex gap-3">
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
        {employee.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={employee.photo_url}
            alt={`Foto de perfil de ${employee.name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-lg text-white font-poppins">
            {employee.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-white font-poppins truncate">
          {employee.name}
        </p>
        <p className="text-sm text-neutral-300 font-poppins truncate">
          {employee.specialty || 'Profesional'}
        </p>
      </div>
    </div>
  );
}
