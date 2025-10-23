import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

/**
 * Card de estadística para dashboards
 * Muestra un valor con icono y opcionalmente una tendencia
 */
export function StatCard({
  icon,
  label,
  value,
  trend,
  className = '',
}: StatCardProps): ReactNode {
  return (
    <div
      className={`bg-white rounded-2xl p-6 border border-neutral-200 hover:border-accent-500/30 hover:shadow-xl transition-all ${className}`}
    >
      {/* Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center text-2xl">
          {icon}
        </div>
        {trend && (
          <span
            className={`text-sm font-semibold ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <p className="text-3xl md:text-4xl font-playfair font-bold text-primary-800">
          {value}
        </p>
      </div>

      {/* Label */}
      <p className="text-sm text-neutral-600 font-poppins">{label}</p>
    </div>
  );
}
