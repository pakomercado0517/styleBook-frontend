'use client';

import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils/cn';
import type { Service } from '@/lib/types/services';
import { useAvailabilityByEmployee } from '@/lib/hooks/useAvailability';
import { getUserTimezone, datePickerToISO } from '@/lib/utils/dateUtils';
import 'react-day-picker/dist/style.css';

interface StepSelectDateTimeProps {
    service: Service;
    employeeId: number | null;
    selectedDate: Date | undefined;
    selectedSlot: { start_local: string; end_local: string } | null;
    onSelectDate: (date: Date | undefined) => void;
    onSelectTime: (time: string | null) => void;
    onSelectSlot: (slot: { start_local: string; end_local: string } | null) => void;
    onContinue: () => void;
    onBack: () => void;
}

export function StepSelectDateTime({
    service,
    employeeId,
    selectedDate,
    selectedSlot,
    onSelectDate,
    onSelectTime,
    onSelectSlot,
    onContinue,
    onBack,
}: StepSelectDateTimeProps) {
    const timezone = getUserTimezone();
    const dateString = selectedDate ? datePickerToISO(selectedDate) : '';

    // Obtener disponibilidad cuando hay fecha y empleado seleccionados
    const { data: availability, isLoading, error } = useAvailabilityByEmployee(
        employeeId,
        {
            service_id: service.id,
            date: dateString,
            timezone,
        }
    );

    const handleDateSelect = (date: Date | undefined): void => {
        onSelectDate(date);
        // Limpiar selección de tiempo al cambiar fecha
        onSelectTime(null);
        onSelectSlot(null);
    };

    const handleSlotSelect = (slot: { start_local: string; end_local: string; formatted: string }): void => {
        // Extraer solo la hora del formato "HH:mm - HH:mm"
        const timeMatch = slot.formatted.match(/^(\d{2}:\d{2})/);
        const time = timeMatch ? timeMatch[1] : null;
        
        onSelectTime(time);
        onSelectSlot({ start_local: slot.start_local, end_local: slot.end_local });
    };
    // Estilos personalizados para el calendario para que coincida con Luxe Noir
    const css = `
    .rdp {
      --rdp-cell-size: 40px;
      --rdp-accent-color: #D4AF37;
      --rdp-background-color: #F5F5F0;
      margin: 0;
    }
    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
      background-color: #F5F5F0;
      color: #D4AF37;
    }
    .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
      background-color: #D4AF37;
      color: #1A1A1A;
    }
    .rdp-caption_label {
      font-family: 'Playfair Display', serif;
      color: #2C2C2C;
      font-size: 1.2rem;
    }
  `;

    return (
        <div className="space-y-6 animate-fade-in">
            <style>{css}</style>
            <div>
                <h2 className="text-2xl font-playfair font-bold text-primary-800 mb-2">
                    Fecha y Hora
                </h2>
                <p className="text-neutral-600">
                    Selecciona cuándo quieres tu cita
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Calendario */}
                <div className="w-full md:w-auto flex justify-center bg-white p-4 rounded-xl border border-neutral-200">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        locale={es}
                        disabled={{ before: new Date() }}
                        modifiersClassNames={{
                            selected: 'rdp-day_selected'
                        }}
                    />
                </div>

                {/* Slots de tiempo */}
                <div className="flex-1 w-full">
                    <h3 className="font-semibold text-primary-800 mb-4">
                        Horarios disponibles
                        {selectedDate && (
                            <span className="font-normal text-neutral-500 ml-2">
                                para el {selectedDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}
                            </span>
                        )}
                    </h3>

                    {!selectedDate ? (
                        <div className="text-center p-8 bg-neutral-50 rounded-xl border border-dashed border-neutral-300 text-neutral-500">
                            Selecciona una fecha primero
                        </div>
                    ) : !employeeId ? (
                        <div className="text-center p-8 bg-yellow-50 rounded-xl border border-yellow-200 text-yellow-700">
                            Por favor selecciona un profesional primero
                        </div>
                    ) : isLoading ? (
                        <div className="text-center p-8 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-500">
                            Cargando horarios disponibles...
                        </div>
                    ) : error ? (
                        <div className="text-center p-8 bg-red-50 rounded-xl border border-red-200 text-red-600">
                            Error al cargar horarios: {error instanceof Error ? error.message : 'Error desconocido'}
                        </div>
                    ) : availability && availability.available_slots.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {availability.available_slots.map((slot, index) => {
                                // Extraer hora del formato "HH:mm - HH:mm"
                                const timeMatch = slot.formatted.match(/^(\d{2}:\d{2})/);
                                const time = timeMatch ? timeMatch[1] : '';
                                const isSelected = selectedSlot?.start_local === slot.start_local;

                                return (
                                    <button
                                        key={`${slot.start_local}-${index}`}
                                        onClick={() => handleSlotSelect(slot)}
                                        className={cn(
                                            "py-2 px-1 rounded-lg text-sm font-medium transition-all duration-200 border",
                                            isSelected
                                                ? "bg-primary-800 text-white border-primary-800 shadow-lg"
                                                : "bg-white text-primary-800 border-neutral-200 hover:border-accent-500 hover:text-accent-600"
                                        )}
                                        aria-label={`Seleccionar horario ${slot.formatted}`}
                                    >
                                        {time}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-neutral-50 rounded-xl border border-dashed border-neutral-300 text-neutral-500">
                            No hay horarios disponibles para esta fecha
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4 pt-4">
                {/* Mensajes de ayuda según lo que falte */}
                {(!selectedDate || !selectedSlot) && !isLoading && !error && (
                    <div className="bg-accent-50 border-2 border-accent-200 rounded-xl p-4 flex items-start gap-3">
                        <span className="text-xl flex-shrink-0">💡</span>
                        <div>
                            <p className="text-sm font-semibold text-accent-800 mb-1">
                                {!selectedDate ? 'Selecciona una fecha' : 'Selecciona un horario'}
                            </p>
                            <p className="text-sm text-accent-700">
                                {!selectedDate 
                                    ? 'Elige una fecha en el calendario para ver los horarios disponibles.'
                                    : 'Elige uno de los horarios disponibles para continuar.'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Mensaje cuando no hay slots disponibles */}
                {selectedDate && employeeId && !isLoading && !error && availability && availability.available_slots.length === 0 && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                        <span className="text-xl flex-shrink-0">⚠️</span>
                        <div>
                            <p className="text-sm font-semibold text-yellow-800 mb-1">
                                No hay horarios disponibles
                            </p>
                            <p className="text-sm text-yellow-700">
                                Por favor selecciona otra fecha para ver más opciones.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex gap-4">
                    <Button variant="outline" onClick={onBack} className="flex-1">
                        Atrás
                    </Button>
                    <Button
                        onClick={onContinue}
                        className="flex-1"
                        disabled={!selectedDate || !selectedSlot || isLoading}
                    >
                        {isLoading ? 'Cargando...' : 'Continuar'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
