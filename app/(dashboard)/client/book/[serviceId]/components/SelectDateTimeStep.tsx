'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, startOfMonth, endOfMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { useService } from '@/lib/hooks/useServices';
import { useAvailabilityByEmployee } from '@/lib/hooks/useAvailability';
import { useEmployee } from '@/lib/hooks/useEmployees';
import { getUserTimezone, datePickerToISO } from '@/lib/utils/dateUtils';
import 'react-day-picker/dist/style.css';

interface SelectDateTimeStepProps {
  serviceId: number;
  employeeId: number | null;
}

/**
 * Paso 2: Selección de fecha y hora
 * Pantalla mobile-first para elegir fecha y hora de la reservación
 */
export function SelectDateTimeStep({
  serviceId,
  employeeId,
}: SelectDateTimeStepProps): ReactNode {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const { data: service, isLoading: isLoadingService } = useService(serviceId);
  const timezone = getUserTimezone();
  const dateString = selectedDate ? datePickerToISO(selectedDate) : '';

  // Obtener disponibilidad cuando hay fecha y empleado seleccionados
  const { data: availability, isLoading: isLoadingAvailability } = useAvailabilityByEmployee(
    employeeId,
    {
      service_id: serviceId,
      date: dateString,
      timezone,
    }
  );

  const handleBack = (): void => {
    router.back();
  };

  const handleDateSelect = (date: Date | undefined): void => {
    setSelectedDate(date);
    setSelectedTime(null); // Limpiar selección de tiempo al cambiar fecha
  };

  const handleTimeSelect = (time: string): void => {
    setSelectedTime(time);
  };

  const handleContinue = (): void => {
    if (selectedDate && selectedTime && employeeId) {
      // Encontrar el slot completo que corresponde al tiempo seleccionado
      const selectedSlot = availability?.available_slots.find((slot) => {
        const slotTime = slot.formatted.split(' - ')[0]; // "HH:mm - HH:mm" -> "HH:mm"
        return slotTime === selectedTime;
      });

      if (selectedSlot) {
        // Navegar al siguiente paso con los datos seleccionados
        router.push(
          `/client/book/${serviceId}?step=confirm&employee=${employeeId}&date=${dateString}&start=${selectedSlot.start_local}&end=${selectedSlot.end_local}`
        );
      }
    }
  };

  const handlePreviousMonth = (): void => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = (): void => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Formatear fecha seleccionada
  const formattedSelectedDate = selectedDate
    ? format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })
    : '';

  // Dividir horarios en Mañana y Tarde
  const morningSlots: Array<{ time: string; slot: { start_local: string; end_local: string; formatted: string } }> =
    [];
  const afternoonSlots: Array<{ time: string; slot: { start_local: string; end_local: string; formatted: string } }> =
    [];

  if (availability?.available_slots) {
    availability.available_slots.forEach((slot) => {
      const time = slot.formatted.split(' - ')[0]; // "HH:mm - HH:mm" -> "HH:mm"
      const hour = parseInt(time.split(':')[0] || '0', 10);

      const slotData = { time, slot };

      if (hour < 12) {
        morningSlots.push(slotData);
      } else {
        afternoonSlots.push(slotData);
      }
    });

    // Ordenar por hora
    morningSlots.sort((a, b) => a.time.localeCompare(b.time));
    afternoonSlots.sort((a, b) => a.time.localeCompare(b.time));
  }

  if (isLoadingService) {
    return (
      <div className="min-h-screen bg-[#201d12] flex flex-col">
        <div className="flex items-center gap-4 px-4 py-4 border-b border-white/10">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Volver"
            type="button"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
          <h1 className="text-xl font-bold text-white font-playfair">Reservar: Fecha y Hora</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white font-poppins">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#201d12] flex flex-col items-center justify-center px-4">
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

  // Formatear fecha para el resumen
  const formattedDateForSummary = selectedDate
    ? format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })
    : '';
  const formattedTimeForSummary = selectedTime || '';

  // Formatear precio
  const formattedPrice = service
    ? new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
      }).format(service.price)
    : '';

  // Formatear duración
  const hours = Math.floor((service?.duration_minutes || 0) / 60);
  const minutes = (service?.duration_minutes || 0) % 60;
  const formattedDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <div className="min-h-screen bg-[#201d12] flex flex-col">
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
        <h1 className="text-xl font-bold text-white font-playfair">Reservar: Fecha y Hora</h1>
      </div>

      {/* Layout Desktop: Dos columnas */}
      <div className="hidden md:flex md:min-h-screen">
        {/* Columna izquierda - Calendario y horarios */}
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
              <span className="text-sm text-neutral-400 font-poppins">Paso 2 de 3</span>
            </div>
          </div>

          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white font-playfair mb-2">
              Selección Fecha y Hora
            </h1>
          </div>

          {/* Contenido scrollable */}
          <div className="space-y-6">
            {/* Calendario */}
            <div className="bg-white/5 rounded-xl p-4">
          {/* Navegación del mes */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePreviousMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              type="button"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2} />
            </button>
            <h2 className="text-lg font-bold text-white font-playfair">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </h2>
            <button
              onClick={handleNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              type="button"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="w-5 h-5 text-white" strokeWidth={2} />
            </button>
          </div>

              {/* Calendario */}
              <div className="[&_.rdp]:m-0 [&_.rdp-button]:text-accent-500 [&_.rdp-day_selected]:!bg-accent-500 [&_.rdp-day_selected]:!text-primary-900 [&_.rdp-day_selected]:font-bold [&_.rdp-day]:rounded-full [&_.rdp-day]:h-10 [&_.rdp-day]:w-10 [&_.rdp-day]:hover:bg-white/10 [&_.rdp-day_disabled]:text-neutral-500 [&_.rdp-day_outside]:text-neutral-500">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  locale={es}
                  disabled={(date) => {
                    // Deshabilitar fechas pasadas
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  classNames={{
                    months: 'flex flex-col',
                    month: 'space-y-4',
                    caption: 'hidden',
                    caption_label: 'hidden',
                    nav: 'hidden',
                    nav_button: 'hidden',
                    nav_button_previous: 'hidden',
                    nav_button_next: 'hidden',
                    table: 'w-full border-collapse space-y-1',
                    head_row: 'flex',
                    head_cell: 'text-white text-sm font-medium w-10 flex items-center justify-center font-poppins',
                    row: 'flex w-full mt-2',
                    cell: 'h-10 w-10 text-center text-sm p-0 relative flex items-center justify-center',
                    day: 'h-10 w-10 rounded-full font-poppins hover:bg-white/10 transition-colors',
                    day_selected: '!bg-accent-500 !text-primary-900 font-bold',
                    day_disabled: 'text-neutral-500 cursor-not-allowed',
                    day_outside: 'text-neutral-500',
                    day_hidden: 'invisible',
                  }}
                  styles={{
                    day: {
                      color: '#D4AF37', // Dorado para los días
                    },
                  }}
                />
              </div>
            </div>

            {/* Fecha seleccionada - Desktop */}
            {selectedDate && (
              <div>
                <h3 className="text-lg font-bold text-white font-poppins mb-4">
                  Horas Disponibles para el {format(selectedDate, 'd', { locale: es })} de{' '}
                  {format(selectedDate, 'MMMM', { locale: es })}
                </h3>
              </div>
            )}

            {/* Horarios disponibles */}
            {isLoadingAvailability ? (
              <div className="text-center py-8">
                <p className="text-neutral-300 font-poppins">Cargando horarios disponibles...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Todos los horarios juntos en desktop */}
                {(morningSlots.length > 0 || afternoonSlots.length > 0) && (
                  <div className="flex flex-wrap gap-3">
                    {[...morningSlots, ...afternoonSlots].map(({ time, slot }) => {
                      const isSelected = selectedTime === time;
                      const isDisabled = false; // TODO: Verificar si el slot está disponible

                      return (
                        <button
                          key={`${slot.start_local}-${slot.end_local}`}
                          onClick={() => handleTimeSelect(time)}
                          disabled={isDisabled}
                          className={`
                            h-10 px-4 rounded-lg text-sm font-medium transition-colors font-poppins
                            ${
                              isSelected
                                ? ''
                                : isDisabled
                                  ? 'bg-white/5 text-neutral-500 cursor-not-allowed'
                                  : 'bg-white/5 text-white hover:bg-white/10'
                            }
                          `}
                          style={
                            isSelected
                              ? {
                                  backgroundColor: '#D4AF37',
                                  color: '#1A1A1A',
                                }
                              : {}
                          }
                          type="button"
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}

                {morningSlots.length === 0 && afternoonSlots.length === 0 && selectedDate && (
                  <div className="text-center py-8">
                    <p className="text-neutral-300 font-poppins">
                      No hay horarios disponibles para esta fecha.
                    </p>
                  </div>
                )}
              </div>
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
              {employeeId && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-sm font-semibold text-neutral-400 font-poppins mb-3">
                    Profesional
                  </h3>
                  <SelectedEmployeeSummary employeeId={employeeId} />
                </div>
              )}

              {/* Fecha y Hora */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm font-semibold text-neutral-400 font-poppins mb-3">
                  Fecha y Hora
                </h3>
                {selectedDate ? (
                  <div className="space-y-2">
                    <p className="text-base font-semibold text-white font-poppins">
                      {formattedDateForSummary}
                    </p>
                    {formattedTimeForSummary && (
                      <p className="text-sm text-neutral-300 font-poppins">
                        {formattedTimeForSummary}
                      </p>
                    )}
                    {!formattedTimeForSummary && (
                      <p className="text-sm text-neutral-400 font-poppins">
                        Selecciona una hora
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400 font-poppins">Aún por seleccionar</p>
                )}
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
                onClick={handleContinue}
                disabled={!selectedDate || !selectedTime}
                className={`
                  w-full h-14 rounded-xl text-lg font-bold transition-colors font-poppins
                  ${
                    selectedDate && selectedTime
                      ? ''
                      : 'opacity-50 cursor-not-allowed'
                  }
                `}
                style={
                  selectedDate && selectedTime
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
        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {/* Calendario */}
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            {/* Navegación del mes */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePreviousMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                type="button"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2} />
              </button>
              <h2 className="text-lg font-bold text-white font-playfair">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
              </h2>
              <button
                onClick={handleNextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                type="button"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="w-5 h-5 text-white" strokeWidth={2} />
              </button>
            </div>

            {/* Calendario */}
            <div className="[&_.rdp]:m-0 [&_.rdp-button]:text-accent-500 [&_.rdp-day_selected]:!bg-accent-500 [&_.rdp-day_selected]:!text-primary-900 [&_.rdp-day_selected]:font-bold [&_.rdp-day]:rounded-full [&_.rdp-day]:h-10 [&_.rdp-day]:w-10 [&_.rdp-day]:hover:bg-white/10 [&_.rdp-day_disabled]:text-neutral-500 [&_.rdp-day_outside]:text-neutral-500">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                locale={es}
                disabled={(date) => {
                  // Deshabilitar fechas pasadas
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
                classNames={{
                  months: 'flex flex-col',
                  month: 'space-y-4',
                  caption: 'hidden',
                  caption_label: 'hidden',
                  nav: 'hidden',
                  nav_button: 'hidden',
                  nav_button_previous: 'hidden',
                  nav_button_next: 'hidden',
                  table: 'w-full border-collapse space-y-1',
                  head_row: 'flex',
                  head_cell: 'text-white text-sm font-medium w-10 flex items-center justify-center font-poppins',
                  row: 'flex w-full mt-2',
                  cell: 'h-10 w-10 text-center text-sm p-0 relative flex items-center justify-center',
                  day: 'h-10 w-10 rounded-full font-poppins hover:bg-white/10 transition-colors',
                  day_selected: '!bg-accent-500 !text-primary-900 font-bold',
                  day_disabled: 'text-neutral-500 cursor-not-allowed',
                  day_outside: 'text-neutral-500',
                  day_hidden: 'invisible',
                }}
                styles={{
                  day: {
                    color: '#D4AF37', // Dorado para los días
                  },
                }}
              />
            </div>
          </div>

          {/* Fecha seleccionada */}
          {selectedDate && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white font-playfair capitalize">
                {formattedSelectedDate}
              </h3>
            </div>
          )}

          {/* Horarios disponibles */}
          {isLoadingAvailability ? (
            <div className="text-center py-8">
              <p className="text-neutral-300 font-poppins">Cargando horarios disponibles...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Mañana */}
              {morningSlots.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-white font-poppins mb-3">Mañana</h3>
                  <div className="flex flex-wrap gap-3">
                    {morningSlots.map(({ time, slot }) => {
                      const isSelected = selectedTime === time;
                      const isDisabled = false; // TODO: Verificar si el slot está disponible

                      return (
                        <button
                          key={`${slot.start_local}-${slot.end_local}`}
                          onClick={() => handleTimeSelect(time)}
                          disabled={isDisabled}
                          className={`
                            h-10 px-4 rounded-lg text-sm font-medium transition-colors font-poppins
                            ${
                              isSelected
                                ? ''
                                : isDisabled
                                  ? 'bg-white/5 text-neutral-500 cursor-not-allowed'
                                  : 'bg-white/5 text-white hover:bg-white/10'
                            }
                          `}
                          style={
                            isSelected
                              ? {
                                  backgroundColor: '#D4AF37',
                                  color: '#1A1A1A',
                                }
                              : {}
                          }
                          type="button"
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tarde */}
              {afternoonSlots.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-white font-poppins mb-3">Tarde</h3>
                  <div className="flex flex-wrap gap-3">
                    {afternoonSlots.map(({ time, slot }) => {
                      const isSelected = selectedTime === time;
                      const isDisabled = false; // TODO: Verificar si el slot está disponible

                      return (
                        <button
                          key={`${slot.start_local}-${slot.end_local}`}
                          onClick={() => handleTimeSelect(time)}
                          disabled={isDisabled}
                          className={`
                            h-10 px-4 rounded-lg text-sm font-medium transition-colors font-poppins
                            ${
                              isSelected
                                ? ''
                                : isDisabled
                                  ? 'bg-white/5 text-neutral-500 cursor-not-allowed'
                                  : 'bg-white/5 text-white hover:bg-white/10'
                            }
                          `}
                          style={
                            isSelected
                              ? {
                                  backgroundColor: '#D4AF37',
                                  color: '#1A1A1A',
                                }
                              : {}
                          }
                          type="button"
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {morningSlots.length === 0 && afternoonSlots.length === 0 && selectedDate && (
                <div className="text-center py-8">
                  <p className="text-neutral-300 font-poppins">
                    No hay horarios disponibles para esta fecha.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botón Continuar */}
        <div className="px-4 py-4 border-t border-white/10 pb-20">
          <button
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime}
            className={`
              w-full h-14 rounded-xl text-lg font-bold transition-colors font-poppins
              ${
                selectedDate && selectedTime
                  ? ''
                  : 'opacity-50 cursor-not-allowed'
              }
            `}
            style={
              selectedDate && selectedTime
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
 * Componente para mostrar el resumen del empleado seleccionado
 */
function SelectedEmployeeSummary({ employeeId }: { employeeId: number }): ReactNode {
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

