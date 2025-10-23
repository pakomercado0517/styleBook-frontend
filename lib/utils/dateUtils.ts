import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Obtiene el timezone del navegador del usuario
 * Ej: "America/Mexico_City"
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Convierte Date object a string ISO para enviar al backend
 * Ej: "2025-10-25T08:00:00"
 */
export function datetimePickerToISO(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}

/**
 * Convierte Date object a string ISO solo fecha
 * Ej: "2025-10-25"
 */
export function datePickerToISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Formatea una fecha ISO a formato legible en español
 * Ej: "25/10/2025 08:00"
 */
export function formatLocalDate(isoDate: string | undefined): string {
  if (!isoDate) {
    return 'Fecha no disponible';
  }

  const date = new Date(isoDate);

  // Validar si la fecha es válida
  if (isNaN(date.getTime())) {
    return 'Fecha no disponible';
  }

  return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
}

/**
 * Formatea fecha corta
 * Ej: "25 Oct"
 */
export function formatDateShort(isoDate: string | undefined): string {
  if (!isoDate) {
    return '-';
  }

  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    return '-';
  }

  return format(date, 'dd MMM', { locale: es });
}

/**
 * Formatea solo la hora
 * Ej: "08:00"
 */
export function formatTime(isoDate: string | undefined): string {
  if (!isoDate) {
    return '-';
  }

  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    return '-';
  }

  return format(date, 'HH:mm');
}

/**
 * Obtiene la fecha actual en formato ISO
 */
export function getDateISO(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Verifica si una fecha es hoy
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Verifica si una fecha ya pasó
 */
export function isPast(date: Date): boolean {
  return date < new Date();
}

/**
 * Formatea fecha UTC a formato local legible
 */
export function formatUTCToLocal(utcDate: string): string {
  const date = new Date(utcDate);
  return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
}
