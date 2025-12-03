import { useQuery } from '@tanstack/react-query';
import {
  getAvailabilityByEmployee,
  getAvailabilityByProvider,
} from '@/lib/api/availability';

/**
 * Hook para obtener disponibilidad de un empleado específico
 */
export function useAvailabilityByEmployee(
  employeeId: number | null,
  params: {
    service_id: number;
    date: string; // YYYY-MM-DD
    timezone: string;
  }
) {
  return useQuery({
    queryKey: ['availability', 'employee', employeeId, params],
    queryFn: async () => {
      if (!employeeId) {
        throw new Error('Employee ID is required');
      }

      const result = await getAvailabilityByEmployee(employeeId, params);
      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data.data;
    },
    enabled: employeeId !== null && employeeId > 0 && params.date !== '',
    staleTime: 2 * 60 * 1000, // 2 minutos (disponibilidad cambia frecuentemente)
  });
}

/**
 * Hook para obtener disponibilidad de todos los empleados de un proveedor
 */
export function useAvailabilityByProvider(
  providerId: number,
  params: {
    service_id: number;
    date: string; // YYYY-MM-DD
    timezone: string;
  }
) {
  return useQuery({
    queryKey: ['availability', 'provider', providerId, params],
    queryFn: async () => {
      const result = await getAvailabilityByProvider(providerId, params);
      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data.data;
    },
    enabled: providerId > 0 && params.date !== '',
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

