import type { Service } from './services';
import type { User } from './auth';
import type { Result } from './common';

/**
 * Estado de una cita
 * @see api-docs/api_routes/05_APPOINTMENTS.md
 */
export type AppointmentStatus =
  | 'pending' // Esperando confirmación del proveedor
  | 'confirmed' // Confirmada por el proveedor
  | 'completed' // Servicio realizado
  | 'cancelled' // Cancelada por cliente o proveedor
  | 'no_show'; // Cliente no se presentó

/**
 * Cita entre cliente y proveedor
 * - Todas las fechas en formato ISO 8601
 * - start/end_date_local: Hora en timezone del usuario
 * - start/end_date_utc: Hora en UTC (solo backend)
 */
export interface Appointment {
  id: number;
  client_id: number;
  employee_id: number;
  service_id: number;
  provider_id: number;
  status: AppointmentStatus;
  // Fechas en timezone local del usuario
  start_date_local: string;
  end_date_local: string;
  // Fechas en UTC (solo backend)
  start_date_utc: string;
  end_date_utc: string;
  // Metadata
  timezone: string;
  final_price: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Relaciones expandidas
  service?: Service;
  employee?: User;
}

/**
 * Datos para crear una cita
 * - start_date y end_date deben estar en timezone local del usuario
 * - El backend se encarga de convertir a UTC
 */
export interface CreateAppointmentData {
  service_id: number;
  employee_id: number;
  start_date: string; // ISO Local
  end_date: string; // ISO Local
  notes?: string;
}

/**
 * Datos para actualizar una cita
 * - Solo se puede actualizar status y notas
 */
export interface UpdateAppointmentData {
  status?: AppointmentStatus;
  notes?: string;
}

/**
 * Información de paginación
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Respuesta paginada de citas
 * @see api-docs/api_routes/05_APPOINTMENTS.md
 */
export interface AppointmentsPaginatedResponse {
  success: true;
  message: string;
  data: {
    appointments: Appointment[];
    pagination: PaginationInfo;
  };
  timestamp: string;
}

// Tipos de respuestas API
export type GetAppointmentsResponse = Result<AppointmentsPaginatedResponse>;
export type GetAppointmentResponse = Result<Appointment>;
export type CreateAppointmentResponse = Result<Appointment>;
export type UpdateAppointmentResponse = Result<Appointment>;
export type DeleteAppointmentResponse = Result<{ message: string }>;
