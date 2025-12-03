import { useQuery } from '@tanstack/react-query';
import { getEmployeesByProvider, getEmployeeById } from '@/lib/api/employees';

/**
 * Hook para obtener lista de empleados de un proveedor
 * El backend siempre retorna respuesta paginada
 */
export function useEmployeesByProvider(
  providerId: number,
  params?: {
    limit?: number;
    offset?: number;
  }
) {
  return useQuery({
    queryKey: ['employees', 'provider', providerId, params],
    queryFn: async () => {
      const result = await getEmployeesByProvider(providerId, params);
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // El backend siempre retorna estructura paginada: { data: { total, count, data: Employee[] } }
      return result.data;
    },
    enabled: providerId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obtener un empleado por ID
 */
export function useEmployee(id: number) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const result = await getEmployeeById(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: id > 0,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

