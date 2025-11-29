import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import type { Service } from '@/lib/types/services';
import { MOCK_EMPLOYEES } from './mockData';

interface StepConfirmProps {
  service: Service;
  employeeId: number | null;
  date: Date | undefined;
  time: string | null;
  onBack: () => void;
}

export function StepConfirm({
  service,
  employeeId,
  date,
  time,
  onBack,
}: StepConfirmProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const employee = MOCK_EMPLOYEES.find((e) => e.id === employeeId);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // Aquí iría la llamada a la API
      // const result = await createAppointment({...});

      // Simulación de llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('¡Cita reservada con éxito!', {
        description: 'Te hemos enviado un correo con los detalles.',
      });

      router.push('/client/appointments');
    } catch (error) {
      toast.error('Error al reservar', {
        description: 'Por favor intenta nuevamente.',
      });
      console.log('error', error);
      setIsSubmitting(false);
    }
  };

  // Formatear precio
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(service.price);

  // Formatear fecha
  const formattedDate = date
    ? date.toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-playfair font-bold text-primary-800 mb-2">
          Confirma tu reserva
        </h2>
        <p className="text-neutral-600">
          Revisa los detalles antes de confirmar
        </p>
      </div>

      <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 space-y-6">
        {/* Servicio */}
        <div className="flex justify-between items-start pb-4 border-b border-neutral-200">
          <div>
            <h3 className="font-semibold text-neutral-500 text-sm mb-1">
              Servicio
            </h3>
            <p className="font-playfair text-xl font-bold text-primary-800">
              {service.name}
            </p>
            <p className="text-sm text-neutral-600">
              {service.duration_minutes} min
            </p>
          </div>
          <p className="font-bold text-xl text-accent-500">{formattedPrice}</p>
        </div>

        {/* Profesional */}
        <div className="pb-4 border-b border-neutral-200">
          <h3 className="font-semibold text-neutral-500 text-sm mb-2">
            Profesional
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200">
              {employee?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={employee.image}
                  alt={employee.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-accent-100 text-accent-700 font-bold">
                  ?
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-primary-800">
                {employee?.name || 'Cualquiera'}
              </p>
              <p className="text-xs text-neutral-500">{employee?.role}</p>
            </div>
          </div>
        </div>

        {/* Fecha y Hora */}
        <div>
          <h3 className="font-semibold text-neutral-500 text-sm mb-2">
            Fecha y Hora
          </h3>
          <div className="flex items-center gap-2 text-primary-800">
            <span className="text-xl">📅</span>
            <p className="font-medium capitalize">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-2 text-primary-800 mt-2">
            <span className="text-xl">⏰</span>
            <p className="font-medium">{time} hrs</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isSubmitting}
        >
          Atrás
        </Button>
        <Button
          onClick={handleConfirm}
          className="flex-1 bg-accent-500 hover:bg-accent-600 text-primary-900 font-bold border-accent-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
        </Button>
      </div>
    </div>
  );
}
