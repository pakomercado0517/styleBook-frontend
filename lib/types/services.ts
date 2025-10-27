import type { Result } from './common';

/**
 * Categoría de servicio
 */
export type ServiceCategory =
  | 'hair' // Cabello
  | 'facial' // Facial
  | 'nails' // Uñas
  | 'makeup' // Maquillaje
  | 'massage' // Masajes
  | 'spa' // Tratamientos spa
  | 'barber' // Barbería
  | 'other'; // Otros

/**
 * Información básica del proveedor en servicio
 */
export interface ServiceProvider {
  id: number;
  business_name: string;
  business_type: string;
  city: string;
  address: string;
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
 */
export interface ServicesPaginatedResponse {
  success: true;
  message: string;
  data: {
    services: Service[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  timestamp: string;
}

// Tipos de respuestas API
export type GetServicesResponse = Result<ServicesPaginatedResponse>;
export type GetServiceResponse = Result<Service>;
export type CreateServiceResponse = Result<Service>;
export type UpdateServiceResponse = Result<Service>;
export type DeleteServiceResponse = Result<{ message: string }>;
