/**
 * Servicio ofrecido por un proveedor
 */
export interface Service {
  id: number;
  provider_id: number;
  name: string;
  description: string;
  price: number;
  duration: number; // en minutos
  category: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  // Metadata
  image_url?: string;
  average_rating?: number;
  total_reviews?: number;
}
