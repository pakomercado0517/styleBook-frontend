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
  gradient?: 'purple' | 'gold' | 'pink' | 'blue';
}

/**
 * Card de estadística para dashboards
 * Diseño moderno y minimalista con gradientes sutiles
 */
export function StatCard({
  icon,
  label,
  value,
  trend,
  className = '',
  gradient = 'purple',
}: StatCardProps): ReactNode {
  const gradientClasses = {
    purple: 'from-purple-500/10 via-purple-400/5 to-transparent',
    gold: 'from-accent-500/10 via-accent-400/5 to-transparent',
    pink: 'from-pink-500/10 via-pink-400/5 to-transparent',
    blue: 'from-blue-500/10 via-blue-400/5 to-transparent',
  };

  const iconBgClasses = {
    purple: 'bg-gradient-to-br from-purple-100 to-purple-50',
    gold: 'bg-gradient-to-br from-accent-100 to-accent-50',
    pink: 'bg-gradient-to-br from-pink-100 to-pink-50',
    blue: 'bg-gradient-to-br from-blue-100 to-blue-50',
  };

  return (
    <div
      className={`
        relative overflow-hidden
        bg-white rounded-3xl p-5 md:p-6
        border border-neutral-100
        hover:border-accent-200/50
        hover:shadow-2xl hover:shadow-accent-500/5
        transition-all duration-300
        group
        ${className}
      `}
    >
      {/* Gradient Background */}
      <div
        className={`
          absolute inset-0
          bg-gradient-to-br ${gradientClasses[gradient]}
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        `}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`
              w-14 h-14 md:w-16 md:h-16
              rounded-2xl
              ${iconBgClasses[gradient]}
              flex items-center justify-center
              text-2xl md:text-3xl
              shadow-sm
              group-hover:scale-110
              transition-transform duration-300
            `}
          >
            {icon}
          </div>
          {trend && (
            <span
              className={`
                text-xs md:text-sm font-semibold
                px-2 py-1 rounded-lg
                ${
                  trend.isPositive
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }
              `}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <p className="text-4xl md:text-5xl font-playfair font-bold text-primary-800 tracking-tight">
            {value}
          </p>
        </div>

        {/* Label */}
        <p className="text-xs md:text-sm text-neutral-500 font-poppins font-medium">
          {label}
        </p>
      </div>

      {/* Decorative corner */}
      <div
        className={`
          absolute top-0 right-0
          w-20 h-20
          bg-gradient-to-br ${gradientClasses[gradient]}
          rounded-bl-full
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        `}
      />
    </div>
  );
}
