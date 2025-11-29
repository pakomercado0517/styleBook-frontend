import { Button } from '@/components/Button';
import type { Service } from '@/lib/types/services';
import { cn } from '@/lib/utils/cn';
import { MOCK_EMPLOYEES } from './mockData';

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_EMPLOYEES.map((employee) => (
                    <div
                        key={employee.id}
                        onClick={() => onSelect(employee.id)}
                        className={cn(
                            "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4",
                            selectedEmployeeId === employee.id
                                ? "border-accent-500 bg-accent-50"
                                : "border-neutral-200 hover:border-accent-200 bg-white"
                        )}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                onSelect(employee.id);
                            }
                        }}
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                            {employee.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={employee.image} alt={employee.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-accent-100 text-accent-700 font-bold">
                                    ?
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-primary-800">{employee.name}</h3>
                            <p className="text-sm text-neutral-500">{employee.role}</p>
                            {employee.rating > 0 && (
                                <div className="flex items-center gap-1 text-xs text-accent-600 mt-1">
                                    <span>⭐</span>
                                    <span>{employee.rating}</span>
                                </div>
                            )}
                        </div>
                        <div className="ml-auto">
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
