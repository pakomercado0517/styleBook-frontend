'use client';

import { Button } from '@/components/Button';
import type { Service } from '@/lib/types/services';
import { cn } from '@/lib/utils/cn';
import { useEmployeesByProvider } from '@/lib/hooks/useEmployees';

interface StepSelectProfessionalProps {
    service: Service;
    selectedEmployeeId: number | null;
    onSelect: (id: number) => void;
    onContinue: () => void;
    onBack: () => void;
}

export function StepSelectProfessional({
    service,
    selectedEmployeeId,
    onSelect,
    onContinue,
    onBack,
}: StepSelectProfessionalProps) {
    const { data: employees, isLoading, error } = useEmployeesByProvider(service.provider_id);

    const handleCardClick = (employeeId: number): void => {
        onSelect(employeeId);
    };

    const handleKeyDown = (e: React.KeyboardEvent, employeeId: number): void => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(employeeId);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-playfair font-bold text-primary-800 mb-2">
                    Elige un profesional
                </h2>
                <p className="text-neutral-600">
                    Selecciona quién te atenderá para {service.name}
                </p>
            </div>

            {/* Estado de carga */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-neutral-600">Cargando profesionales...</div>
                </div>
            )}

            {/* Estado de error */}
            {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <p className="text-red-600">
                        Error al cargar profesionales: {error instanceof Error ? error.message : 'Error desconocido'}
                    </p>
                </div>
            )}

            {/* Lista de empleados */}
            {!isLoading && !error && employees && employees.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {employees.map((employee) => (
                        <div
                            key={employee.id}
                            onClick={() => handleCardClick(employee.id)}
                            className={cn(
                                "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4",
                                selectedEmployeeId === employee.id
                                    ? "border-accent-500 bg-accent-50"
                                    : "border-neutral-200 hover:border-accent-200 bg-white"
                            )}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e, employee.id)}
                            aria-label={`Seleccionar ${employee.name}`}
                        >
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                                {employee.photo_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img 
                                        src={employee.photo_url} 
                                        alt={employee.name} 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-accent-100 text-accent-700 font-bold text-lg">
                                        {employee.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-primary-800 truncate">{employee.name}</h3>
                                {employee.specialty && (
                                    <p className="text-sm text-neutral-500 truncate">{employee.specialty}</p>
                                )}
                                {employee.rating && employee.rating > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-accent-600 mt-1">
                                        <span>⭐</span>
                                        <span>{employee.rating.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="ml-auto flex-shrink-0">
                                <div className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                    selectedEmployeeId === employee.id
                                        ? "border-accent-500"
                                        : "border-neutral-300"
                                )}>
                                    {selectedEmployeeId === employee.id && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-accent-500" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sin empleados disponibles */}
            {!isLoading && !error && employees && employees.length === 0 && (
                <div className="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-6 text-center">
                    <p className="text-neutral-600">
                        No hay profesionales disponibles para este servicio.
                    </p>
                </div>
            )}

            <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={onBack} className="flex-1">
                    Atrás
                </Button>
                <Button
                    onClick={onContinue}
                    className="flex-1"
                    disabled={selectedEmployeeId === null}
                >
                    Continuar
                </Button>
            </div>
        </div>
    );
}
