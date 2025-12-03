import { useQuery } from '@tanstack/react-query';
import {
  getAppointment,
  getAppointments,
  getProviderAppointments,
  getProviderPendingAppointments,
} from '@/lib/api/appointments';
import type { GetAppointmentsParams } from '@/lib/api/appointments';

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
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para obtener las citas pendientes del proveedor autenticado
 * Endpoint: GET /appointments/provider/pending
 */
export function useProviderPendingAppointments(params?: {
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
    staleTime: 1 * 60 * 1000, // 1 minuto (más frecuente porque cambian rápido)
  });
}

