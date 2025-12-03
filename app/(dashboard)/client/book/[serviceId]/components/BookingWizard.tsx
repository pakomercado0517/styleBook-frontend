'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useService } from '@/lib/hooks/useServices';
import { useAppointment } from '@/lib/hooks/useAppointments';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils/cn';
import { StepServiceDetails } from './StepServiceDetails';
import { StepSelectProfessional } from './StepSelectProfessional';
import { StepSelectDateTime } from './StepSelectDateTime';
import { StepConfirm } from './StepConfirm';

type BookingStep = 'details' | 'professional' | 'datetime' | 'confirm';

interface BookingWizardProps {
    serviceId: number;
    rescheduleAppointmentId?: number | null;
}

export function BookingWizard({ serviceId, rescheduleAppointmentId }: BookingWizardProps) {
    const router = useRouter();
    const { data: service, isLoading, error } = useService(serviceId);
    
    // Cargar cita existente si estamos reagendando
    const { data: existingAppointment, isLoading: isLoadingAppointment } = useAppointment(
        rescheduleAppointmentId || 0
    );

    const [step, setStep] = useState<BookingStep>('details');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<{ start_local: string; end_local: string } | null>(null);

    // Pre-llenar datos cuando se carga la cita existente para reagendar
    useEffect(() => {
        if (existingAppointment && rescheduleAppointmentId) {
            // Pre-seleccionar empleado
            if (existingAppointment.employee_id) {
                setSelectedEmployeeId(existingAppointment.employee_id);
            }

            // Pre-seleccionar fecha y hora
            if (existingAppointment.start_date_local) {
                const appointmentDate = new Date(existingAppointment.start_date_local);
                setSelectedDate(appointmentDate);
                
                // Extraer hora del formato ISO
                const timeString = appointmentDate.toTimeString().slice(0, 5); // "HH:mm"
                setSelectedTime(timeString);

                // Pre-llenar slot si tenemos las fechas
                if (existingAppointment.end_date_local) {
                    setSelectedSlot({
                        start_local: existingAppointment.start_date_local,
                        end_local: existingAppointment.end_date_local,
                    });
                }
            }

            // Saltar al paso de fecha/hora si ya tenemos servicio y empleado
            if (existingAppointment.service_id && existingAppointment.employee_id) {
                setStep('datetime');
            } else if (existingAppointment.service_id) {
                setStep('professional');
            }
        }
    }, [existingAppointment, rescheduleAppointmentId]);

    if (isLoading || (rescheduleAppointmentId && isLoadingAppointment)) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-primary-800 mb-4">Error</h2>
                <p className="text-neutral-600 mb-6">No se pudo cargar el servicio.</p>
                <Button onClick={() => router.back()}>Volver</Button>
            </div>
        );
    }

    // Validar que el servicio de la cita coincida con el serviceId si estamos reagendando
    if (rescheduleAppointmentId && existingAppointment && existingAppointment.service_id !== serviceId) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-primary-800 mb-4">Error</h2>
                <p className="text-neutral-600 mb-6">
                    El servicio de la cita no coincide. Por favor, reagenda desde la página de citas.
                </p>
                <Button onClick={() => router.push('/client/appointments')}>Volver a Mis Citas</Button>
            </div>
        );
    }

    const handleBack = () => {
        if (step === 'details') {
            router.back();
        } else if (step === 'professional') {
            setStep('details');
        } else if (step === 'datetime') {
            setStep('professional');
        } else if (step === 'confirm') {
            setStep('datetime');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8">
            {/* Progress Bar Mejorado */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium mb-3">
                    <div className="flex flex-col items-center flex-1">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all",
                            step === 'details' 
                                ? 'bg-accent-500 text-primary-900 border-2 border-accent-600' 
                                : step === 'professional' || step === 'datetime' || step === 'confirm'
                                ? 'bg-accent-200 text-accent-700 border-2 border-accent-300'
                                : 'bg-neutral-200 text-neutral-500 border-2 border-neutral-300'
                        )}>
                            {step === 'details' || step === 'professional' || step === 'datetime' || step === 'confirm' ? '✓' : '1'}
                        </div>
                        <span className={cn(
                            "text-xs",
                            step === 'details' ? 'text-accent-600 font-semibold' : 'text-neutral-500'
                        )}>Servicio</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-2">
                        <div className={cn(
                            "h-0.5 w-full transition-all",
                            step === 'professional' || step === 'datetime' || step === 'confirm'
                                ? 'bg-accent-500' : 'bg-neutral-200'
                        )} />
                    </div>
                    <div className="flex flex-col items-center flex-1">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all",
                            step === 'professional'
                                ? 'bg-accent-500 text-primary-900 border-2 border-accent-600' 
                                : step === 'datetime' || step === 'confirm'
                                ? 'bg-accent-200 text-accent-700 border-2 border-accent-300'
                                : selectedEmployeeId !== null
                                ? 'bg-accent-100 text-accent-600 border-2 border-accent-200'
                                : 'bg-neutral-200 text-neutral-500 border-2 border-neutral-300'
                        )}>
                            {step === 'professional' || step === 'datetime' || step === 'confirm' ? '✓' : selectedEmployeeId !== null ? '✓' : '2'}
                        </div>
                        <span className={cn(
                            "text-xs",
                            step === 'professional' ? 'text-accent-600 font-semibold' : 
                            selectedEmployeeId !== null ? 'text-accent-500' : 'text-neutral-500'
                        )}>Profesional</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-2">
                        <div className={cn(
                            "h-0.5 w-full transition-all",
                            step === 'datetime' || step === 'confirm'
                                ? 'bg-accent-500' : 
                            selectedEmployeeId !== null && selectedSlot !== null
                                ? 'bg-accent-300' : 'bg-neutral-200'
                        )} />
                    </div>
                    <div className="flex flex-col items-center flex-1">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all",
                            step === 'datetime'
                                ? 'bg-accent-500 text-primary-900 border-2 border-accent-600' 
                                : step === 'confirm'
                                ? 'bg-accent-200 text-accent-700 border-2 border-accent-300'
                                : selectedSlot !== null
                                ? 'bg-accent-100 text-accent-600 border-2 border-accent-200'
                                : 'bg-neutral-200 text-neutral-500 border-2 border-neutral-300'
                        )}>
                            {step === 'datetime' || step === 'confirm' ? '✓' : selectedSlot !== null ? '✓' : '3'}
                        </div>
                        <span className={cn(
                            "text-xs",
                            step === 'datetime' ? 'text-accent-600 font-semibold' : 
                            selectedSlot !== null ? 'text-accent-500' : 'text-neutral-500'
                        )}>Fecha</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-2">
                        <div className={cn(
                            "h-0.5 w-full transition-all",
                            step === 'confirm'
                                ? 'bg-accent-500' : 'bg-neutral-200'
                        )} />
                    </div>
                    <div className="flex flex-col items-center flex-1">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all",
                            step === 'confirm'
                                ? 'bg-accent-500 text-primary-900 border-2 border-accent-600' 
                                : 'bg-neutral-200 text-neutral-500 border-2 border-neutral-300'
                        )}>
                            {step === 'confirm' ? '✓' : '4'}
                        </div>
                        <span className={cn(
                            "text-xs",
                            step === 'confirm' ? 'text-accent-600 font-semibold' : 'text-neutral-500'
                        )}>Confirmar</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-neutral-100 min-h-[400px]">
                {step === 'details' && (
                    <StepServiceDetails
                        service={service}
                        onContinue={() => setStep('professional')}
                        onBack={handleBack}
                    />
                )}

                {step === 'professional' && (
                    <StepSelectProfessional
                        service={service}
                        selectedEmployeeId={selectedEmployeeId}
                        onSelect={(id) => {
                            console.log('BookingWizard: Seleccionando empleado', id);
                            setSelectedEmployeeId(id);
                        }}
                        onContinue={() => {
                            if (selectedEmployeeId) {
                                setStep('datetime');
                            }
                        }}
                        onBack={handleBack}
                    />
                )}

                {step === 'datetime' && (
                    <StepSelectDateTime
                        service={service}
                        employeeId={selectedEmployeeId}
                        selectedDate={selectedDate}
                        selectedSlot={selectedSlot}
                        onSelectDate={setSelectedDate}
                        onSelectTime={setSelectedTime}
                        onSelectSlot={setSelectedSlot}
                        onContinue={() => setStep('confirm')}
                        onBack={handleBack}
                    />
                )}

                {step === 'confirm' && (
                    <StepConfirm
                        service={service}
                        employeeId={selectedEmployeeId}
                        date={selectedDate}
                        time={selectedTime}
                        slot={selectedSlot}
                        rescheduleAppointmentId={rescheduleAppointmentId || null}
                        onBack={handleBack}
                    />
                )}
            </div>
        </div>
    );
}
