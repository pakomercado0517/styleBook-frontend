'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useService } from '@/lib/hooks/useServices';
import { useAppointment } from '@/lib/hooks/useAppointments';
import { Button } from '@/components/Button';
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
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-neutral-500 mb-2">
                    <span className={step === 'details' ? 'text-accent-500' : ''}>Servicio</span>
                    <span className={step === 'professional' ? 'text-accent-500' : ''}>Profesional</span>
                    <span className={step === 'datetime' ? 'text-accent-500' : ''}>Fecha</span>
                    <span className={step === 'confirm' ? 'text-accent-500' : ''}>Confirmar</span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-accent-500 transition-all duration-300 ease-in-out"
                        style={{
                            width: step === 'details' ? '25%' :
                                step === 'professional' ? '50%' :
                                    step === 'datetime' ? '75%' : '100%'
                        }}
                    />
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
                        onSelect={(id) => setSelectedEmployeeId(id)}
                        onContinue={() => setStep('datetime')}
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
