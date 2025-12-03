/**
 * Estadísticas del proveedor para el dashboard
 */
export interface ProviderStats {
  appointmentsToday: number;
  monthlyRevenue: number;
  averageRating: number;
  activeClients: number;
  // Opcional: tendencias
  appointmentsTodayTrend?: {
    value: number;
    isPositive: boolean;
  };
  monthlyRevenueTrend?: {
    value: number;
    isPositive: boolean;
  };
}

/**
 * Respuesta de estadísticas de rating del proveedor
 */
export interface ProviderRatingStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export type GetProviderRatingStatsResponse =
  | { success: true; data: ProviderRatingStats }
  | { success: false; error: string };

