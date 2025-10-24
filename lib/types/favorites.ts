import type { Service } from './services';
import type { Result } from './common';

/**
 * Favorito de un cliente
 * - Puede ser un proveedor o un servicio
 * - provider_id y service_id son mutuamente excluyentes
 */
export interface Favorite {
  id: number;
  client_id: number;
  provider_id?: number;
  service_id?: number;
  createdAt: string;
  // Relaciones expandidas
  provider?: {
    id: number;
    business_name: string;
    business_type: string;
    city: string;
    average_rating: number;
  };
  service?: Service;
}

/**
 * Respuesta paginada de favoritos
 */
export interface FavoritesPaginatedResponse {
  favorites: Favorite[];
  total: number;
  provider_favorites: number;
  service_favorites: number;
}

/**
 * Respuesta de verificación de favorito
 */
export interface IsFavoriteResponse {
  is_favorite: boolean;
}

// Tipos de respuestas API
export type GetFavoritesResponse = Result<FavoritesPaginatedResponse>;
export type GetProviderFavoritesResponse = Result<{
  providers: Favorite[];
  total: number;
}>;
export type GetServiceFavoritesResponse = Result<{
  services: Favorite[];
  total: number;
}>;
export type AddFavoriteResponse = Result<Favorite>;
export type DeleteFavoriteResponse = Result<{ message: string }>;
export type IsFavoriteCheckResponse = Result<IsFavoriteResponse>;
