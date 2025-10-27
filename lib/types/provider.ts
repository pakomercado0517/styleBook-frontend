import type { Result } from './common';

/**
 * Tipo de negocio del proveedor
 */
export type BusinessType =
  | 'salon' // Salón de belleza
  | 'barbershop' // Barbería
  | 'spa' // Spa
  | 'nails' // Uñas
  | 'makeup' // Maquillaje
  | 'hair' // Peluquería
  | 'other'; // Otro

/**
 * Perfil completo del proveedor
 */
export interface ProviderProfile {
  id: number;
  user_id: number;
  business_name: string;
  business_type: BusinessType;
  description?: string;
  opening_time?: string; // HH:mm formato 24h
  closing_time?: string; // HH:mm formato 24h
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  average_rating?: number;
  // Metadata
  avatar_url?: string;
  cover_url?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Datos para actualizar el perfil
 */
export interface UpdateProviderProfileData {
  business_name?: string;
  business_type?: BusinessType;
  description?: string;
  opening_time?: string;
  closing_time?: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  is_active?: boolean;
  avatar_url?: string;
  cover_url?: string;
}

/**
 * Respuesta de actualización de perfil
 */
export interface ProviderProfileUpdateResponse {
  profile: ProviderProfile;
  message: string;
}

// Tipos de respuestas API
export type GetProviderProfileResponse = Result<ProviderProfile>;
export type UpdateProviderProfileResponse =
  Result<ProviderProfileUpdateResponse>;
