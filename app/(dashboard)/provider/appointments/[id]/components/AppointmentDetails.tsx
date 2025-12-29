'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Clock,
  Leaf,
  Briefcase,
  Wallet,
  History,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';
import { getServiceById } from '@/lib/api/services';
import { useAppointment } from '@/lib/hooks/useAppointments';
import {
  useUpdateAppointment,
  useCancelAppointment,
  useConfirmAppointment,
  useMarkAppointmentAsNoShow,
} from '@/lib/hooks/useAppointments';
import type { Appointment } from '@/lib/types/appointments';
import type { Service } from '@/lib/types/services';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/AlertDialog';

interface AppointmentDetailsProps {
  appointmentId: number;
}

const statusMap = {
  pending: { text: 'PENDIENTE', color: 'bg-yellow-500' },
  confirmed: { text: 'CONFIRMADA', color: 'bg-green-500' },
  completed: { text: 'COMPLETADA', color: 'bg-blue-500' },
  cancelled: { text: 'CANCELADA', color: 'bg-red-500' },
  no_show: { text: 'NO ASISTIÓ', color: 'bg-red-500' },
} as const;

/**
 * AppointmentDetails - Vista detallada de una cita para proveedor
 * Muestra toda la información de la cita con acciones disponibles del proveedor
 */
export const AppointmentDetails = ({
  appointmentId,
}: AppointmentDetailsProps): ReactNode => {
  const router = useRouter();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const { data, isLoading, isError, error } = useAppointment(appointmentId);

  // Obtener información del servicio
  const { data: serviceData } = useQuery({
    queryKey: ['service', data?.service_id],
    queryFn: async () => {
      if (!data?.service_id) {
        return null;
      }

      const result = await getServiceById(data.service_id);

      if (!result.success) {
        return null;
      }

      return result.data;
    },
    enabled: !!data?.service_id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  const updateAppointment = useUpdateAppointment();
  const cancelAppointment = useCancelAppointment();
  const confirmAppointment = useConfirmAppointment();
  const markNoShow = useMarkAppointmentAsNoShow();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] px-4 py-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !data) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error al cargar la cita';

    return (
      <div className="min-h-screen bg-[#121212] px-4 py-6">
        <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6 text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h3 className="font-playfair text-xl font-bold text-red-400 mb-2">
            Error al cargar la cita
          </h3>
          <p className="text-red-300 font-poppins mb-6">{errorMessage}</p>
          <button
            onClick={() => router.push('/provider/appointments')}
            className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-poppins hover:bg-white/10 transition-colors"
            type="button"
          >
            Volver a Gestión de Citas
          </button>
        </div>
      </div>
    );
  }

  const appointment: Appointment = data;
  const service: Service | null = serviceData || appointment.service || null;
  const status = statusMap[appointment.status] || {
    text: appointment.status.toUpperCase(),
    color: 'bg-neutral-500',
  };

  // Formatear fecha
  const appointmentDate = new Date(appointment.start_date_local);
  const formattedDate = format(appointmentDate, 'd MMM, yyyy', { locale: es });
  const formattedTime = format(appointmentDate, 'h:mm a', { locale: es });

  // Calcular duración
  const serviceDuration = service?.duration_minutes || 0;
  const startDate = new Date(appointment.start_date_local);
  const endDate = new Date(appointment.end_date_local);
  const calculatedDuration = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60)
  );
  const durationMinutes =
    serviceDuration > 0 ? serviceDuration : calculatedDuration;

  // Convertir final_price a number si viene como string
  const priceNumber =
    typeof appointment.final_price === 'string'
      ? parseFloat(appointment.final_price)
      : appointment.final_price;

  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(priceNumber);

  // Información del servicio
  const serviceName = service?.name || `Servicio #${appointment.service_id}`;

  // Información del cliente
  const clientFullName = appointment.client
    ? `${appointment.client.name}${appointment.client.apellido ? ` ${appointment.client.apellido}` : ''}`
    : `Cliente #${appointment.client_id}`;
  const clientEmail = appointment.client?.email;
  const clientPhone = appointment.client?.phone;
  const clientAvatar = appointment.client?.avatar_url;
  // TODO: Determinar si es cliente VIP (necesitarías agregar este campo al tipo)
  const isVipClient = false; // Por ahora siempre false, ajustar según lógica de negocio

  // Debug: Verificar datos del cliente
  if (!appointment.client) {
    console.warn('⚠️ Cliente no disponible en appointment details:', {
      appointmentId: appointment.id,
      clientId: appointment.client_id,
      appointment: appointment,
    });
  } else {
    console.log('✅ Cliente disponible:', {
      appointmentId: appointment.id,
      clientName: appointment.client.name,
      clientApellido: appointment.client.apellido,
      clientFullName: clientFullName,
    });
  }

  // Información del empleado
  const employeeName =
    appointment.employee?.name || `Empleado #${appointment.employee_id}`;

  // Acciones disponibles según el estado
  const canConfirm = appointment.status === 'pending';
  const canComplete = appointment.status === 'confirmed';
  const canCancel = ['pending', 'confirmed'].includes(appointment.status);
  const canMarkNoShow = ['pending', 'confirmed'].includes(appointment.status);

  const handleBack = (): void => {
    router.push('/provider/appointments');
  };

  const handleConfirm = (): void => {
    confirmAppointment.mutate(appointment.id);
  };

  const handleComplete = (): void => {
    updateAppointment.mutate({
      appointmentId: appointment.id,
      data: { status: 'completed' },
    });
  };

  const handleCancel = (): void => {
    cancelAppointment.mutate(appointment.id, {
      onSuccess: () => {
        setIsCancelDialogOpen(false);
      },
    });
  };

  const handleMarkNoShow = (): void => {
    markNoShow.mutate(appointment.id);
  };

  const handleCall = (): void => {
    if (clientPhone) {
      window.location.href = `tel:${clientPhone}`;
    }
  };

  const handleEmail = (): void => {
    if (clientEmail) {
      window.location.href = `mailto:${clientEmail}`;
    }
  };

  const handleCopyPhone = (): void => {
    if (clientPhone) {
      navigator.clipboard.writeText(clientPhone);
      toast.success('Teléfono copiado al portapapeles');
    }
  };

  const handleCopyEmail = (): void => {
    if (clientEmail) {
      navigator.clipboard.writeText(clientEmail);
      toast.success('Email copiado al portapapeles');
    }
  };

  const handleHistory = (): void => {
    // TODO: Navegar al historial del cliente
    toast.info('Historial del cliente próximamente');
  };

  // Método de pago (por ahora hardcodeado, ajustar según datos del backend)
  const paymentMethod = 'Tarjeta en sitio'; // TODO: Obtener del backend

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header - Mobile */}
      <div className="md:hidden sticky top-0 z-10 bg-[#121212] border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Volver"
            type="button"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-bold text-white font-playfair">
            Detalles de Cita
          </h1>
          <div
            className={`px-4 py-1.5 rounded-full ${status.color} text-white text-xs font-semibold font-poppins flex items-center gap-1.5`}
          >
            <span>✓</span>
            <span>{status.text}</span>
          </div>
        </div>
      </div>

      {/* Header - Desktop */}
      <div className="hidden md:block border-b border-white/10 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="Volver"
              type="button"
            >
              <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
            </button>
            <h1 className="text-2xl font-bold text-white font-playfair">
              Detalles de Cita
            </h1>
          </div>
          <div
            className={`px-4 py-1.5 rounded-full ${status.color} text-white text-xs font-semibold font-poppins flex items-center gap-1.5`}
          >
            <span>✓</span>
            <span>{status.text}</span>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden px-4 py-6 space-y-6 pb-20">
        {/* Información del Cliente */}
        <div className="text-center">
          {/* Avatar con glow dorado */}
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-500/50 to-accent-600/30 blur-xl"></div>
            {clientAvatar ? (
              <Image
                src={clientAvatar}
                alt={clientFullName}
                width={120}
                height={120}
                className="relative rounded-full object-cover border-4"
                style={{ borderColor: '#D4AF37' }}
              />
            ) : (
              <div
                className="relative w-[120px] h-[120px] rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center border-4"
                style={{ borderColor: '#D4AF37' }}
              >
                <span className="text-4xl text-white font-bold">
                  {clientFullName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Nombre del cliente */}
          <h2 className="text-2xl font-bold text-white font-playfair mb-2">
            {clientFullName}
          </h2>

          {/* Badge VIP si aplica */}
          {isVipClient && (
            <div className="inline-block px-3 py-1 rounded-full bg-accent-500/20 border border-accent-500/50 mb-4">
              <span className="text-xs font-semibold text-accent-500 font-poppins uppercase">
                Cliente VIP
              </span>
            </div>
          )}

          {/* Botones de contacto */}
          <div className="flex gap-3 justify-center mt-4">
            {clientPhone && (
              <button
                onClick={handleCall}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-500 font-poppins text-sm font-medium hover:bg-white/10 transition-colors"
                type="button"
              >
                <Phone className="w-4 h-4" strokeWidth={2} />
                <span>Llamar</span>
              </button>
            )}
            {clientEmail && (
              <button
                onClick={handleEmail}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-500 font-poppins text-sm font-medium hover:bg-white/10 transition-colors"
                type="button"
              >
                <Mail className="w-4 h-4" strokeWidth={2} />
                <span>Email</span>
              </button>
            )}
          </div>
        </div>

        {/* Card de Información del Servicio */}
        <div className="bg-[#F5F5DC] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-neutral-800 font-poppins uppercase mb-4">
            Información del Servicio
          </h3>
          <div className="space-y-4">
            {/* Servicio */}
            <div className="flex items-start gap-3">
              <Leaf
                className="w-5 h-5 text-accent-600 shrink-0 mt-0.5"
                strokeWidth={2}
              />
              <div>
                <p className="text-xs text-neutral-600 font-poppins mb-1">
                  Servicio
                </p>
                <p className="text-base font-semibold text-neutral-900 font-poppins">
                  {serviceName}
                </p>
              </div>
            </div>

            {/* Profesional */}
            <div className="flex items-start gap-3">
              <Briefcase
                className="w-5 h-5 text-accent-600 shrink-0 mt-0.5"
                strokeWidth={2}
              />
              <div>
                <p className="text-xs text-neutral-600 font-poppins mb-1">
                  Profesional
                </p>
                <p className="text-base font-semibold text-neutral-900 font-poppins">
                  {employeeName}
                </p>
              </div>
            </div>

            {/* Fecha */}
            <div className="flex items-start gap-3">
              <Calendar
                className="w-5 h-5 text-accent-600 shrink-0 mt-0.5"
                strokeWidth={2}
              />
              <div>
                <p className="text-xs text-neutral-600 font-poppins mb-1">
                  Fecha
                </p>
                <p className="text-base font-semibold text-neutral-900 font-poppins">
                  {formattedDate}
                </p>
                <p className="text-sm text-neutral-700 font-poppins">
                  {formattedTime}
                </p>
              </div>
            </div>

            {/* Duración */}
            <div className="flex items-start gap-3">
              <Clock
                className="w-5 h-5 text-accent-600 shrink-0 mt-0.5"
                strokeWidth={2}
              />
              <div>
                <p className="text-xs text-neutral-600 font-poppins mb-1">
                  Duración
                </p>
                <p className="text-base font-semibold text-neutral-900 font-poppins">
                  {durationMinutes} min
                </p>
              </div>
            </div>

            {/* Precio */}
            <div className="flex items-start gap-3">
              <Wallet
                className="w-5 h-5 text-accent-600 shrink-0 mt-0.5"
                strokeWidth={2}
              />
              <div>
                <p className="text-xs text-neutral-600 font-poppins mb-1">
                  Precio Total
                </p>
                <p className="text-xl font-bold text-accent-600 font-playfair">
                  {formattedPrice}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Datos de Contacto */}
        {(clientPhone || clientEmail) && (
          <div className="bg-[#F5F5DC] rounded-2xl p-6">
            <h3 className="text-sm font-bold text-neutral-800 font-poppins uppercase mb-4">
              Datos de Contacto
            </h3>
            <div className="space-y-4">
              {clientPhone && (
                <div className="flex items-center gap-3">
                  <Phone
                    className="w-5 h-5 text-accent-600 shrink-0"
                    strokeWidth={2}
                  />
                  <p className="text-base text-neutral-900 font-poppins">
                    {clientPhone}
                  </p>
                </div>
              )}
              {clientEmail && (
                <div className="flex items-center gap-3">
                  <Mail
                    className="w-5 h-5 text-accent-600 shrink-0"
                    strokeWidth={2}
                  />
                  <p className="text-base text-neutral-900 font-poppins">
                    {clientEmail}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botones de Acción - Mobile */}
        <div className="space-y-3 pt-4">
          {canConfirm && (
            <button
              onClick={handleConfirm}
              disabled={confirmAppointment.isPending}
              className="w-full h-14 rounded-lg font-semibold font-poppins transition-colors flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#D4AF37',
                color: '#1A1A1A',
              }}
              type="button"
            >
              <span>✓</span>
              <span>
                {confirmAppointment.isPending
                  ? 'Confirmando...'
                  : 'Confirmar Cita'}
              </span>
            </button>
          )}

          {canComplete && (
            <button
              onClick={handleComplete}
              disabled={updateAppointment.isPending}
              className="w-full h-14 rounded-lg font-semibold font-poppins transition-colors flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#D4AF37',
                color: '#1A1A1A',
              }}
              type="button"
            >
              <span>✓</span>
              <span>
                {updateAppointment.isPending
                  ? 'Completando...'
                  : 'Completar Cita'}
              </span>
            </button>
          )}

          {canMarkNoShow && (
            <button
              onClick={handleMarkNoShow}
              disabled={markNoShow.isPending}
              className="w-full h-14 rounded-lg bg-white/5 border border-white/10 text-white font-semibold font-poppins hover:bg-white/10 transition-colors disabled:opacity-50"
              type="button"
            >
              {markNoShow.isPending ? 'Marcando...' : '🚫 No Asistió'}
            </button>
          )}

          {canCancel && (
            <>
              <button
                onClick={() => setIsCancelDialogOpen(true)}
                className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white font-semibold font-poppins hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                type="button"
              >
                <Calendar className="w-4 h-4" strokeWidth={2} />
                <span>Reprogramar</span>
              </button>

              <AlertDialog
                open={isCancelDialogOpen}
                onOpenChange={setIsCancelDialogOpen}
              >
                <AlertDialogContent className="bg-[#1A1A1A] border-white/10">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white font-playfair">
                      ¿Cancelar cita?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-neutral-300 font-poppins">
                      Esta acción cancelará la cita &ldquo;{serviceName}&rdquo;
                      del cliente {clientFullName}. ¿Estás seguro?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setIsCancelDialogOpen(false)}
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                      No, mantener
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancel}
                      disabled={cancelAppointment.isPending}
                      className="bg-red-600 hover:bg-red-700 text-white border-red-700 disabled:opacity-50"
                    >
                      {cancelAppointment.isPending
                        ? 'Cancelando...'
                        : 'Sí, cancelar'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <button
                onClick={() => setIsCancelDialogOpen(true)}
                className="w-full text-center text-red-400 font-poppins font-medium hover:text-red-300 transition-colors py-2"
                type="button"
              >
                Cancelar Cita
              </button>
            </>
          )}
        </div>
      </div>

      {/* Desktop Layout - 3 Columnas */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Columna Central - Información del Cliente y Servicio */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Card de Información del Cliente */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-500/50 to-accent-600/30 blur-xl"></div>
                  {clientAvatar ? (
                    <Image
                      src={clientAvatar}
                      alt={clientFullName}
                      width={100}
                      height={100}
                      className="relative rounded-full object-cover border-4"
                      style={{ borderColor: '#D4AF37' }}
                    />
                  ) : (
                    <div
                      className="relative w-[100px] h-[100px] rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center border-4"
                      style={{ borderColor: '#D4AF37' }}
                    >
                      <span className="text-3xl text-white font-bold">
                        {clientFullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Información del Cliente */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-2xl font-bold text-white font-playfair mb-1">
                        {clientFullName}
                      </h2>
                      {/* TODO: Agregar ubicación cuando esté disponible en el backend */}
                      <p className="text-sm text-neutral-400 font-poppins">
                        Madrid, España
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {isVipClient && (
                        <div className="px-3 py-1 rounded-full bg-accent-500/20 border border-accent-500/50">
                          <span className="text-xs font-semibold text-accent-500 font-poppins uppercase">
                            Cliente VIP
                          </span>
                        </div>
                      )}
                      <div
                        className={`px-3 py-1 rounded-full ${status.color} text-white text-xs font-semibold font-poppins`}
                      >
                        {status.text}
                      </div>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex gap-3">
                    {clientPhone && (
                      <button
                        onClick={handleCall}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-500 font-poppins text-sm font-medium hover:bg-white/10 transition-colors"
                        type="button"
                      >
                        <Phone className="w-4 h-4" strokeWidth={2} />
                        <span>Llamar</span>
                      </button>
                    )}
                    {clientEmail && (
                      <button
                        onClick={handleEmail}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-500 font-poppins text-sm font-medium hover:bg-white/10 transition-colors"
                        type="button"
                      >
                        <Mail className="w-4 h-4" strokeWidth={2} />
                        <span>Email</span>
                      </button>
                    )}
                    <button
                      onClick={handleHistory}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border font-poppins text-sm font-medium hover:bg-white/10 transition-colors"
                      style={{ borderColor: '#D4AF37', color: '#D4AF37' }}
                      type="button"
                    >
                      <History
                        className="w-4 h-4"
                        strokeWidth={2}
                        style={{ color: '#D4AF37' }}
                      />
                      <span>Historial</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de Información del Servicio */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-800 font-poppins uppercase mb-6">
                Información del Servicio
              </h3>
              <div className="space-y-5">
                {/* Servicio Solicitado */}
                <div className="flex items-start gap-4">
                  <Leaf
                    className="w-6 h-6 text-accent-600 shrink-0 mt-1"
                    strokeWidth={2}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-neutral-600 font-poppins uppercase mb-1">
                      Servicio Solicitado
                    </p>
                    <p className="text-lg font-semibold text-neutral-900 font-poppins">
                      {serviceName}
                    </p>
                    {service?.description && (
                      <p className="text-sm text-neutral-600 font-poppins mt-1">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Precio Total */}
                <div className="flex items-start gap-4">
                  <Wallet
                    className="w-6 h-6 text-accent-600 shrink-0 mt-1"
                    strokeWidth={2}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-neutral-600 font-poppins uppercase mb-1">
                      Precio Total
                    </p>
                    <p className="text-2xl font-bold text-accent-600 font-playfair">
                      {formattedPrice}
                    </p>
                  </div>
                </div>

                {/* Profesional */}
                <div className="flex items-start gap-4">
                  <Briefcase
                    className="w-6 h-6 text-accent-600 shrink-0 mt-1"
                    strokeWidth={2}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-neutral-600 font-poppins uppercase mb-1">
                      Profesional
                    </p>
                    <p className="text-base font-semibold text-neutral-900 font-poppins">
                      {employeeName}
                    </p>
                  </div>
                </div>

                {/* Fecha y Hora */}
                <div className="flex items-start gap-4">
                  <Calendar
                    className="w-6 h-6 text-accent-600 shrink-0 mt-1"
                    strokeWidth={2}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-neutral-600 font-poppins uppercase mb-1">
                      Fecha y Hora
                    </p>
                    <p className="text-base font-semibold text-neutral-900 font-poppins">
                      {formattedDate}
                    </p>
                    <p className="text-sm text-neutral-600 font-poppins">
                      {formattedTime}
                    </p>
                  </div>
                </div>

                {/* Duración Estimada */}
                <div className="flex items-start gap-4">
                  <Clock
                    className="w-6 h-6 text-accent-600 shrink-0 mt-1"
                    strokeWidth={2}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-neutral-600 font-poppins uppercase mb-1">
                      Duración Estimada
                    </p>
                    <p className="text-base font-semibold text-neutral-900 font-poppins">
                      {durationMinutes} min
                    </p>
                  </div>
                </div>

                {/* Método de Pago */}
                <div className="flex items-start gap-4">
                  <CreditCard
                    className="w-6 h-6 text-accent-600 shrink-0 mt-1"
                    strokeWidth={2}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-neutral-600 font-poppins uppercase mb-1">
                      Método de Pago
                    </p>
                    <p className="text-base font-semibold text-neutral-900 font-poppins">
                      {paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Datos de Contacto y Acciones */}
        <div className="w-96 border-l border-white/10 bg-white/5 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Card de Datos de Contacto */}
            {(clientPhone || clientEmail) && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                <h3 className="text-sm font-bold text-neutral-800 font-poppins uppercase mb-4">
                  Datos de Contacto
                </h3>
                <div className="space-y-4">
                  {clientPhone && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Phone
                          className="w-4 h-4 text-accent-600"
                          strokeWidth={2}
                        />
                        <p className="text-xs font-bold text-neutral-600 font-poppins uppercase">
                          Teléfono Móvil
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-base text-neutral-900 font-poppins">
                          {clientPhone}
                        </p>
                        <button
                          onClick={handleCopyPhone}
                          className="px-3 py-1 rounded-lg bg-accent-500/10 text-accent-600 text-xs font-semibold font-poppins hover:bg-accent-500/20 transition-colors"
                          type="button"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                  )}
                  {clientEmail && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Mail
                          className="w-4 h-4 text-accent-600"
                          strokeWidth={2}
                        />
                        <p className="text-xs font-bold text-neutral-600 font-poppins uppercase">
                          Correo Electrónico
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-base text-neutral-900 font-poppins truncate flex-1 mr-2">
                          {clientEmail}
                        </p>
                        <button
                          onClick={handleCopyEmail}
                          className="px-3 py-1 rounded-lg bg-accent-500/10 text-accent-600 text-xs font-semibold font-poppins hover:bg-accent-500/20 transition-colors shrink-0"
                          type="button"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Card de Acciones de Cita */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-800 font-poppins uppercase mb-4">
                Acciones de Cita
              </h3>
              <div className="space-y-3">
                {canConfirm && (
                  <button
                    onClick={handleConfirm}
                    disabled={confirmAppointment.isPending}
                    className="w-full h-12 rounded-lg font-semibold font-poppins transition-colors flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: '#D4AF37',
                      color: '#1A1A1A',
                    }}
                    type="button"
                  >
                    <span>✓</span>
                    <span>
                      {confirmAppointment.isPending
                        ? 'Confirmando...'
                        : 'Confirmar Cita'}
                    </span>
                  </button>
                )}

                {canComplete && (
                  <button
                    onClick={handleComplete}
                    disabled={updateAppointment.isPending}
                    className="w-full h-12 rounded-lg font-semibold font-poppins transition-colors flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: '#D4AF37',
                      color: '#1A1A1A',
                    }}
                    type="button"
                  >
                    <span>✓</span>
                    <span>
                      {updateAppointment.isPending
                        ? 'Completando...'
                        : 'Completar Cita'}
                    </span>
                  </button>
                )}

                {canCancel && (
                  <>
                    <button
                      onClick={() => setIsCancelDialogOpen(true)}
                      className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white font-semibold font-poppins hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                      type="button"
                    >
                      <Calendar className="w-4 h-4" strokeWidth={2} />
                      <span>Reprogramar</span>
                    </button>

                    <AlertDialog
                      open={isCancelDialogOpen}
                      onOpenChange={setIsCancelDialogOpen}
                    >
                      <AlertDialogContent className="bg-[#1A1A1A] border-white/10">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white font-playfair">
                            ¿Cancelar cita?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-neutral-300 font-poppins">
                            Esta acción cancelará la cita &ldquo;{serviceName}
                            &rdquo; del cliente {clientFullName}. ¿Estás seguro?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setIsCancelDialogOpen(false)}
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                          >
                            No, mantener
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleCancel}
                            disabled={cancelAppointment.isPending}
                            className="bg-red-600 hover:bg-red-700 text-white border-red-700 disabled:opacity-50"
                          >
                            {cancelAppointment.isPending
                              ? 'Cancelando...'
                              : 'Sí, cancelar'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <button
                      onClick={() => setIsCancelDialogOpen(true)}
                      className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white font-semibold font-poppins hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                      type="button"
                    >
                      <span>✕</span>
                      <span>Cancelar</span>
                    </button>
                  </>
                )}

                {canMarkNoShow && (
                  <button
                    onClick={handleMarkNoShow}
                    disabled={markNoShow.isPending}
                    className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white font-semibold font-poppins hover:bg-white/10 transition-colors disabled:opacity-50"
                    type="button"
                  >
                    {markNoShow.isPending ? 'Marcando...' : '🚫 No Asistió'}
                  </button>
                )}

                {/* Última actualización */}
                <p className="text-xs text-neutral-500 font-poppins text-center pt-2">
                  Última actualización hace{' '}
                  {Math.round(
                    (Date.now() - new Date(appointment.updatedAt).getTime()) /
                      (1000 * 60)
                  )}{' '}
                  minutos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
