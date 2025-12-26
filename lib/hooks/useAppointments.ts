import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAppointment,
  getAppointments,
  getProviderAppointments,
  getProviderPendingAppointments,
  updateAppointment,
  cancelAppointment,
  confirmAppointment,
  markAppointmentAsNoShow,
} from '@/lib/api/appointments';
import type { GetAppointmentsParams } from '@/lib/api/appointments';
import type { UpdateAppointmentData } from '@/lib/types/appointments';
import { toast } from 'sonner';

/**
 * Hook para obtener una cita por ID
 */
export function useAppointment(id: number) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      const result = await getAppointment(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: id > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obtener lista de citas del usuario
 */
export function useAppointments(params?: GetAppointmentsParams) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: async () => {
      const result = await getAppointments(params);
      if (!result.success) {
        throw new Error(result.error);
      }
      console.log('result', result);
      return result.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para obtener todas las citas del proveedor autenticado
 * Endpoint: GET /appointments/provider/all
 */
export function useProviderAppointments(params?: {
  status?: string;
  start_date?: string;
  end_date?: string;
  employee_id?: number;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ['provider-appointments', params],
    queryFn: async () => {
      const result = await getProviderAppointments(params);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: params !== undefined, // Solo ejecutar si hay parámetros
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para obtener las citas pendientes del proveedor autenticado
 * Endpoint: GET /appointments/provider/pending
 */
export function useProviderPendingAppointments(params?: {
  employee_id?: number;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ['provider-pending-appointments', params],
    queryFn: async () => {
      const result = await getProviderPendingAppointments(params);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: params !== undefined, // Solo ejecutar si hay parámetros
    staleTime: 1 * 60 * 1000, // 1 minuto (más frecuente porque cambian rápido)
  });
}

/**
 * Hook para actualizar el estado de una cita
 * Permite cambiar status y notas
 */
export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      data,
    }: {
      appointmentId: number;
      data: UpdateAppointmentData;
    }) => {
      const result = await updateAppointment(appointmentId, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['provider-appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['provider-pending-appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointment'],
      });
      toast.success('Cita actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar la cita');
    },
  });
}

/**
 * Hook para cancelar una cita
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: number) => {
      const result = await cancelAppointment(appointmentId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['provider-appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['provider-pending-appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointment'],
      });
      toast.success('Cita cancelada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al cancelar la cita');
    },
  });
}

/**
 * Hook para confirmar una cita (solo proveedor)
 */
export function useConfirmAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: number) => {
      const result = await confirmAppointment(appointmentId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['provider-appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['provider-pending-appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointment'],
      });
      toast.success('Cita confirmada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al confirmar la cita');
    },
  });
}

/**
 * Hook para marcar una cita como "no asistió" (solo proveedor)
 */
export function useMarkAppointmentAsNoShow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: number) => {
      const result = await markAppointmentAsNoShow(appointmentId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['provider-appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['provider-pending-appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointment'],
      });
      toast.success('Cita marcada como "no asistió"');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al marcar la cita como no asistió');
    },
  });
}
