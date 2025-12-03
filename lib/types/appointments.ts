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
 * Fechas formateadas por el backend
 */
export interface FormattedDates {
  start: string; // Ej: "29/11/2025 10:00"
  end: string; // Ej: "29/11/2025 10:30"
}

/**
 * Cita entre cliente y proveedor
 * - Todas las fechas en formato ISO 8601
 * - start/end_date_local: Hora en timezone del usuario
 * - start/end_date_utc: Hora en UTC (solo backend)
 * - formatted_dates: Fechas ya formateadas por el backend (opcional)
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
  // Fechas formateadas (opcional, viene del backend)
  formatted_dates?: FormattedDates;
  // Metadata
  timezone: string;
  final_price: number | string; // Puede venir como string desde el backend
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  // Relaciones expandidas (opcional, solo si el backend las incluye)
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
 * Datos para reagendar una cita
 * - Permite cambiar fecha/hora y opcionalmente el empleado
 * - Si la cita estaba "confirmed", vuelve a "pending"
 */
export interface RescheduleAppointmentData {
  start_date: string; // ISO Local
  end_date: string; // ISO Local
  employee_id?: number; // Opcional, debe pertenecer al mismo proveedor
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
export type CreateAppointmentResponse =
  | { success: true; data: Appointment }
  | { success: false; error: string; errorCode?: number };
export type UpdateAppointmentResponse = Result<Appointment>;
export type RescheduleAppointmentResponse =
  | { success: true; data: Appointment }
  | { success: false; error: string; errorCode?: number };
export type DeleteAppointmentResponse = Result<{ message: string }>;
