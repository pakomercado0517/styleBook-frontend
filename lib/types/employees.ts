import type { Result } from './common';

/**
 * Empleado de un proveedor
 * Estructura que coincide con el backend según 10_EMPLOYEES.md
 */
export interface Employee {
  id: number;
  provider_id: number;
  name: string;
  email: string;
  phone: string | null;
  specialty: string | null; // Especialidad del empleado (ej: "Colorista", "Estilista Senior")
  photo_url: string | null; // URL de la foto del empleado
  rating: number | null; // Calificación promedio (Decimal 3,2)
  createdAt: string;
  updatedAt: string;
  // Relaciones expandidas (opcional, viene del backend)
  provider?: {
    id: number;
    business_name: string;
    business_type: string;
    address?: string;
  };
}

/**
 * Respuesta paginada de empleados
 * El backend siempre retorna esta estructura paginada
 */
export interface EmployeesPaginatedResponse {
  success: true;
  message: string;
  data: {
    total: number;
    count: number;
    data: Employee[];
  };
}

/**
 * Datos para crear un empleado
 */
export interface CreateEmployeeData {
  provider_id: number;
  name: string;
  email: string;
  phone?: string;
  specialty?: string;
  photo_url?: string;
}

/**
 * Datos para actualizar un empleado
 */
export interface UpdateEmployeeData {
  name?: string;
  email?: string;
  phone?: string;
  specialty?: string;
  photo_url?: string;
}

// Tipos de respuestas API
export type GetEmployeesResponse = Result<EmployeesPaginatedResponse>;
export type GetEmployeeResponse = Result<Employee>;
export type CreateEmployeeResponse = Result<Employee>;
export type UpdateEmployeeResponse = Result<Employee>;
export type DeleteEmployeeResponse = Result<{ message: string }>;

