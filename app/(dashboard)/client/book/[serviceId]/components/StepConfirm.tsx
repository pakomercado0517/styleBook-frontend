'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import type { Service } from '@/lib/types/services';
import { createAppointment, rescheduleAppointment } from '@/lib/api/appointments';
import { useEmployee } from '@/lib/hooks/useEmployees';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from '@/components/AlertDialog';

interface StepConfirmProps {
  service: Service;
  employeeId: number | null;
  date: Date | undefined;
  time: string | null;
  slot: { start_local: string; end_local: string } | null;
  rescheduleAppointmentId?: number | null;
  onBack: () => void;
}

export function StepConfirm({
  service,
  employeeId,
  date,
  time,
  slot,
  rescheduleAppointmentId,
  onBack,
}: StepConfirmProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // useQueryClient permite invalidar el cache después de crear la cita
  const queryClient = useQueryClient();
  
  const isRescheduling = rescheduleAppointmentId !== null && rescheduleAppointmentId !== undefined;
  
  // Obtener datos reales del empleado
  const { data: employee, isLoading: isLoadingEmployee } = useEmployee(employeeId || 0);

  const handleConfirm = async (): Promise<void> => {
    // Validaciones antes de crear la cita
    if (!employeeId) {
      toast.error('Error de validación', {
        description: 'Por favor selecciona un profesional.',
      });
      return;
    }

    if (!slot || !slot.start_local || !slot.end_local) {
      toast.error('Error de validación', {
        description: 'Por favor selecciona una fecha y hora válidas.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      if (isRescheduling && rescheduleAppointmentId) {
        // Reagendar cita existente usando el endpoint específico
        result = await rescheduleAppointment(rescheduleAppointmentId, {
          start_date: slot.start_local,
          end_date: slot.end_local,
          employee_id: employeeId, // Opcional, pero lo incluimos si el usuario cambió de empleado
        });
      } else {
        // Crear nueva cita
        result = await createAppointment({
          service_id: service.id,
          employee_id: employeeId,
          start_date: slot.start_local,
          end_date: slot.end_local,
        });
      }

      if (!result.success) {
        // Manejo de errores del backend basado en código HTTP y mensaje
        let errorMessage = 'Por favor intenta nuevamente.';
        const errorCode = result.errorCode;
        const errorText = result.error?.toLowerCase() || '';

        // Manejo por código HTTP
        if (errorCode === 409) {
          errorMessage = 'El horario seleccionado ya no está disponible. Por favor selecciona otro horario.';
        } else if (errorCode === 400) {
          if (errorText.includes('fecha') || errorText.includes('date') || errorText.includes('pasado') || errorText.includes('past') || errorText.includes('futuro') || errorText.includes('future')) {
            errorMessage = 'La fecha seleccionada no es válida. Por favor selecciona una fecha futura.';
          } else if (errorText.includes('duración') || errorText.includes('duration')) {
            errorMessage = 'La duración del servicio no es válida.';
          } else {
            errorMessage = 'Los datos proporcionados no son válidos. Por favor verifica la información.';
          }
        } else if (errorCode === 401) {
          errorMessage = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else if (errorCode === 404) {
          if (errorText.includes('empleado') || errorText.includes('employee')) {
            errorMessage = 'El profesional seleccionado no está disponible. Por favor selecciona otro profesional.';
          } else if (errorText.includes('servicio') || errorText.includes('service')) {
            errorMessage = 'El servicio seleccionado no está disponible. Por favor intenta con otro servicio.';
          } else {
            errorMessage = 'El recurso solicitado no fue encontrado.';
          }
        } else if (errorCode === 422) {
          errorMessage = 'Los datos proporcionados no son válidos. Por favor verifica la información.';
        } else if (result.error) {
          // Manejo por texto del error
          if (errorText.includes('conflicto') || errorText.includes('conflict')) {
            errorMessage = 'El horario seleccionado ya no está disponible. Por favor selecciona otro horario.';
          } else if (errorText.includes('disponible') || errorText.includes('available') || errorText.includes('ocupado') || errorText.includes('busy')) {
            errorMessage = 'El horario seleccionado no está disponible. Por favor selecciona otro horario.';
          } else if (errorText.includes('fecha') || errorText.includes('date')) {
            errorMessage = 'La fecha seleccionada no es válida. Por favor selecciona una fecha futura.';
          } else {
            errorMessage = result.error;
          }
        }

        const errorTitle = isRescheduling ? 'Error al reagendar la cita' : 'Error al crear la cita';
        
        // Mensajes específicos para errores de reagendamiento
        if (isRescheduling) {
          if (errorCode === 403) {
            errorMessage = 'No tienes permisos para reagendar esta cita.';
          } else if (errorCode === 409) {
            if (errorText.includes('completada') || errorText.includes('completed')) {
              errorMessage = 'No se puede reagendar una cita completada.';
            } else if (errorText.includes('cancelada') || errorText.includes('cancelled')) {
              errorMessage = 'No se puede reagendar una cita cancelada.';
            } else {
              errorMessage = 'El horario seleccionado no está disponible. Por favor selecciona otro horario.';
            }
          }
        }

        toast.error(errorTitle, {
          description: errorMessage,
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      }

      // Éxito: mostrar diálogo
      setShowSuccessDialog(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error creating appointment:', error);
      
      // Manejo de errores de red
      let errorMessage = 'Por favor intenta nuevamente.';
      
      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('network')) {
          errorMessage = 'Error de conexión. Por favor verifica tu conexión a internet e intenta nuevamente.';
        } else {
          errorMessage = error.message;
        }
      }

      toast.error('Error al reservar', {
        description: errorMessage,
        duration: 5000,
      });
      setIsSubmitting(false);
    }
  };

  /**
   * handleSuccessDialogClose
   * 
   * Se ejecuta cuando el usuario cierra el diálogo de éxito después de crear/reagendar una cita
   * 
   * Pasos:
   * 1. Cierra el diálogo de éxito
   * 2. OPCIÓN 2: Invalida el cache de appointments (fuerza refetch al montar)
   * 3. Redirige a la página de citas (/client/appointments)
   */
  const handleSuccessDialogClose = (): void => {
    setShowSuccessDialog(false);
    
    // OPCIÓN 2: Invalidar el cache de appointments
    // Clave maestra 'appointments' invalida TODOS los queries que empiezan con 'appointments'
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
    
    // Redirigir a la página de citas
    router.push('/client/appointments');
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
          {isRescheduling ? 'Reagenda tu cita' : 'Confirma tu reserva'}
        </h2>
        <p className="text-neutral-600">
          {isRescheduling 
            ? 'Revisa los nuevos detalles antes de confirmar el reagendamiento'
            : 'Revisa los detalles antes de confirmar'
          }
        </p>
        {isRescheduling && (
          <div className="mt-3 bg-accent-50 border-2 border-accent-200 rounded-xl p-3">
            <p className="text-sm text-accent-800 font-medium">
              📅 Tu cita será reagendada al nuevo horario. Si estaba confirmada, volverá a estado pendiente para que el proveedor confirme nuevamente.
            </p>
          </div>
        )}
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
          {isLoadingEmployee ? (
            <div className="text-neutral-500 text-sm">Cargando información del profesional...</div>
          ) : employee ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                {employee.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={employee.photo_url}
                    alt={employee.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-accent-100 text-accent-700 font-bold">
                    {employee.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-primary-800 truncate">
                  {employee.name}
                </p>
                {employee.specialty && (
                  <p className="text-xs text-neutral-500 truncate">{employee.specialty}</p>
                )}
                {employee.rating !== null && employee.rating !== undefined && employee.rating > 0 && (
                  <div className="flex items-center gap-1 text-xs text-accent-600 mt-1">
                    <span>⭐</span>
                    <span>{typeof employee.rating === 'number' ? employee.rating.toFixed(1) : employee.rating}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-neutral-500 text-sm">Profesional no disponible</div>
          )}
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
          disabled={isSubmitting || !slot || !employeeId}
        >
          {isSubmitting 
            ? (isRescheduling ? 'Reagendando...' : 'Confirmando...') 
            : (isRescheduling ? 'Reagendar Cita' : 'Confirmar Reserva')
          }
        </Button>
      </div>

      {/* Diálogo de confirmación exitosa */}
      <AlertDialog open={showSuccessDialog} onOpenChange={(open) => {
        if (!open) {
          // Si se cierra el diálogo, redirigir
          handleSuccessDialogClose();
        }
      }}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-accent-100 flex items-center justify-center shadow-lg shadow-accent-500/20">
                <span className="text-5xl text-accent-600">✓</span>
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              {isRescheduling ? '¡Cita Reagendada con Éxito!' : '¡Cita Reservada con Éxito!'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center pt-3 space-y-2">
              <p>
                {isRescheduling 
                  ? 'Tu cita ha sido reagendada exitosamente. La cita anterior ha sido cancelada.'
                  : 'Tu cita ha sido creada exitosamente con estado pendiente.'
                }
              </p>
              <p>
                {isRescheduling 
                  ? 'La nueva cita tiene estado pendiente y el proveedor recibirá una notificación para confirmarla.'
                  : 'El proveedor recibirá una notificación y confirmará tu cita pronto.'
                }
              </p>
              <p className="pt-2 font-semibold text-primary-800">
                📧 Te hemos enviado un correo con los detalles de {isRescheduling ? 'tu nueva cita' : 'tu reserva'}.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction
              onClick={handleSuccessDialogClose}
              variant="gold"
              className="w-full sm:w-auto min-w-[200px]"
            >
              Ver Mis Citas
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
