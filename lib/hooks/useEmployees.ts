import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEmployeesByProvider,
  getEmployeeById,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '@/lib/api/employees';
import type {
  CreateEmployeeData,
  UpdateEmployeeData,
} from '@/lib/types/employees';
import { toast } from 'sonner';

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
      // Retornamos el array de empleados directamente para facilitar el uso
      return result.data.data.data;
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

/**
 * Hook para obtener todos los empleados con filtros opcionales
 */
export function useAllEmployees(params?: {
  limit?: number;
  offset?: number;
  provider_id?: number;
}) {
  return useQuery({
    queryKey: ['employees', 'all', params],
    queryFn: async () => {
      const result = await getAllEmployees(params);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para crear un empleado
 */
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEmployeeData) => {
      const result = await createEmployee(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['employees', 'provider', variables.provider_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['employees', 'all'],
      });
      toast.success('Empleado creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear el empleado');
    },
  });
}

/**
 * Hook para actualizar un empleado
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateEmployeeData;
    }) => {
      const result = await updateEmployee(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (updatedEmployee, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['employee', variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['employees', 'provider', updatedEmployee.provider_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['employees', 'all'],
      });
      toast.success('Empleado actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar el empleado');
    },
  });
}

/**
 * Hook para eliminar un empleado
 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteEmployee(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidar todas las queries de empleados
      queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
      toast.success('Empleado eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar el empleado');
    },
  });
}

