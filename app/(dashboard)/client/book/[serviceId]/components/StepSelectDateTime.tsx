import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils/cn';
import 'react-day-picker/dist/style.css';

interface StepSelectDateTimeProps {
    selectedDate: Date | undefined;
    selectedTime: string | null;
    onSelectDate: (date: Date | undefined) => void;
    onSelectTime: (time: string | null) => void;
    onContinue: () => void;
    onBack: () => void;
}

const TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
];

export function StepSelectDateTime({
    selectedDate,
    selectedTime,
    onSelectDate,
    onSelectTime,
    onContinue,
    onBack,
}: StepSelectDateTimeProps) {
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
                        onSelect={onSelectDate}
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
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {TIME_SLOTS.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => onSelectTime(time)}
                                    className={cn(
                                        "py-2 px-1 rounded-lg text-sm font-medium transition-all duration-200 border",
                                        selectedTime === time
                                            ? "bg-primary-800 text-white border-primary-800 shadow-lg"
                                            : "bg-white text-primary-800 border-neutral-200 hover:border-accent-500 hover:text-accent-600"
                                    )}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={onBack} className="flex-1">
                    Atrás
                </Button>
                <Button
                    onClick={onContinue}
                    className="flex-1"
                    disabled={!selectedDate || !selectedTime}
                >
                    Continuar
                </Button>
            </div>
        </div>
    );
}
