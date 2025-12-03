import type { Result } from './common';

/**
 * Slot disponible de tiempo
 * Estructura que coincide con el backend según 08_AVAILABILITY.md
 */
export interface AvailableSlot {
  start_utc: string; // ISO 8601 UTC
  start_local: string; // ISO 8601 Local
  end_utc: string; // ISO 8601 UTC
  end_local: string; // ISO 8601 Local
  formatted: string; // "HH:mm - HH:mm" (ej: "08:00 - 08:30")
}

/**
 * Disponibilidad de un empleado
 */
export interface EmployeeAvailability {
  employee_id: number;
  date: string; // YYYY-MM-DD
  timezone: string;
  available_slots: AvailableSlot[];
  total_available_slots: number;
}

/**
 * Disponibilidad de múltiples empleados (proveedor)
 */
export type ProviderAvailability = EmployeeAvailability[];

/**
 * Respuesta de disponibilidad de un empleado
 */
export interface EmployeeAvailabilityResponse {
  success: true;
  message: string;
  data: EmployeeAvailability;
}

/**
 * Respuesta de disponibilidad de un proveedor (múltiples empleados)
 */
export interface ProviderAvailabilityResponse {
  success: true;
  message: string;
  data: ProviderAvailability;
}

// Tipos de respuestas API
export type GetEmployeeAvailabilityResponse = Result<EmployeeAvailabilityResponse>;
export type GetProviderAvailabilityResponse = Result<ProviderAvailabilityResponse>;

