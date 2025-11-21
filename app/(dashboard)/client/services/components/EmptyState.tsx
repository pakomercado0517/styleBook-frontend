import type { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * EmptyState - Estado vacío para cuando no hay servicios
 * Muestra un mensaje amigable y acciones sugeridas
 */
export const EmptyState = ({
  title = 'No hay servicios disponibles',
  description = 'Por el momento no tenemos servicios para mostrar. Intenta ajustar tus filtros o vuelve más tarde.',
  icon = '🔍',
  action,
}: EmptyStateProps): ReactNode => {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-20 px-4">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Icon */}
        <div className="text-6xl md:text-7xl mb-6 animate-float">{icon}</div>

        {/* Title */}
        <h3 className="font-playfair text-2xl md:text-3xl font-bold text-primary-800 mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-neutral-600 font-poppins text-base md:text-lg mb-6">
          {description}
        </p>

        {/* Optional Action */}
        {action && (
          <button
            onClick={action.onClick}
            className="
              bg-accent-500 text-primary-900 
              px-6 py-3 rounded-lg
              font-poppins font-semibold
              border-2 border-accent-600
              hover:border-accent-700
              hover:bg-accent-400
              transition-all duration-200
              shadow-md hover:shadow-lg
              min-h-[44px]
            "
            type="button"
            aria-label={action.label}
          >
            {action.label}
          </button>
        )}

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center gap-2 opacity-30">
          <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
          <div
            className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"
            style={{ animationDelay: '0.2s' }}
          />
          <div
            className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"
            style={{ animationDelay: '0.4s' }}
          />
        </div>
      </div>
    </div>
  );
};
