'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useService } from '@/lib/hooks/useServices';
import { Button } from '@/components/Button';
import { StepServiceDetails } from './StepServiceDetails';
import { StepSelectProfessional } from './StepSelectProfessional';
import { StepSelectDateTime } from './StepSelectDateTime';
import { StepConfirm } from './StepConfirm';

type BookingStep = 'details' | 'professional' | 'datetime' | 'confirm';

interface BookingWizardProps {
    serviceId: number;
}

export function BookingWizard({ serviceId }: BookingWizardProps) {
    const router = useRouter();
    const { data: service, isLoading, error } = useService(serviceId);

    const [step, setStep] = useState<BookingStep>('details');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    if (isLoading) {
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
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        onSelectDate={setSelectedDate}
                        onSelectTime={setSelectedTime}
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
                        onBack={handleBack}
                    />
                )}
            </div>
        </div>
    );
}
