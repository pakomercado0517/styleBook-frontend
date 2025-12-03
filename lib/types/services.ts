import type { Result } from './common';

/**
 * Categoría de servicio
 * Enum que coincide con el modelo del backend
 */
export type ServiceCategory =
  | 'corte' // Corte de cabello
  | 'tinte' // Tinte de cabello
  | 'peinado' // Peinado
  | 'manicure' // Manicure
  | 'pedicure' // Pedicure
  | 'tratamiento_capilar' // Tratamiento capilar
  | 'barba' // Barba
  | 'afeitado' // Afeitado
  | 'masaje' // Masaje
  | 'facial' // Facial
  | 'corporal' // Corporal
  | 'aromaterapia' // Aromaterapia
  | 'limpieza_dental' // Limpieza dental
  | 'estetica_dental'; // Estética dental

/**
 * Información básica del proveedor en servicio
 * Según la documentación del backend, incluye estos campos cuando viene en appointments
 */
export interface ServiceProvider {
  id: number;
  business_name: string;
  business_type: string;
  description?: string; // Descripción del negocio
  city: string;
  address: string;
  country?: string; // País del proveedor
  average_rating: number;
}

/**
 * Servicio ofrecido por un proveedor
 */
export interface Service {
  id: number;
  provider_id: number;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  // Metadata
  image_url?: string;
  average_rating?: number;
  total_reviews?: number;
  createdAt: string;
  updatedAt: string;
  // Relaciones expandidas
  provider?: ServiceProvider;
}

/**
 * Datos para crear un servicio
 */
export interface CreateServiceData {
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration_minutes: number;
  is_active?: boolean;
  image_url?: string;
}

/**
 * Datos para actualizar un servicio
 */
export interface UpdateServiceData {
  name?: string;
  description?: string;
  category?: ServiceCategory;
  price?: number;
  duration_minutes?: number;
  is_active?: boolean;
  image_url?: string;
}

/**
 * Respuesta paginada de servicios
 * Estructura real del backend
 */
export interface ServicesPaginatedResponse {
  success: true;
  message: string;
  data: {
    total: number;
    count: number;
    data: Service[];
  };
  timestamp: string;
}

// Tipos de respuestas API
export type GetServicesResponse = Result<ServicesPaginatedResponse>;
export type GetServiceResponse = Result<Service>;
export type CreateServiceResponse = Result<Service>;
export type UpdateServiceResponse = Result<Service>;
export type DeleteServiceResponse = Result<{ message: string }>;
