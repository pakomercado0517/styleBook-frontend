import { SelectProfessionalStep } from './components/SelectProfessionalStep';
import { SelectDateTimeStep } from './components/SelectDateTimeStep';
import { ConfirmBookingStep } from './components/ConfirmBookingStep';

interface BookingPageProps {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<{
    reschedule?: string;
    employee?: string;
    step?: string;
    date?: string;
    start?: string;
    end?: string;
  }>;
}

/**
 * Página de reservación de servicio
 * Flujo completo para realizar una reservación
 */
export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { serviceId } = await params;
  const { step, employee, date, start, end } = await searchParams;

  const employeeId = employee ? parseInt(employee, 10) : null;

  // Renderizar el paso correspondiente según el parámetro 'step'
  if (step === 'confirm' && employeeId && date && start && end) {
    return (
      <ConfirmBookingStep
        serviceId={parseInt(serviceId)}
        employeeId={employeeId}
        date={date}
        startTime={start}
        endTime={end}
      />
    );
  }

  if (step === 'datetime' && employeeId) {
    return <SelectDateTimeStep serviceId={parseInt(serviceId)} employeeId={employeeId} />;
  }

  // Por defecto, mostrar selección de profesional
  return <SelectProfessionalStep serviceId={parseInt(serviceId)} />;
}
