import type { ReactNode } from 'react';
import Link from 'next/link';

interface QuickActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

/**
 * Card de acción rápida para dashboards
 * Diseño moderno con efectos hover elegantes
 */
export function QuickActionCard({
  icon,
  title,
  description,
  href,
}: QuickActionCardProps): ReactNode {
  return (
    <Link
      href={href}
      className="
        group block relative overflow-hidden
        bg-white rounded-3xl p-6 md:p-7
        border border-neutral-100
        hover:border-accent-200/50
        hover:shadow-2xl hover:shadow-accent-500/5
        hover:-translate-y-1
        transition-all duration-300
      "
    >
      {/* Gradient overlay on hover */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-br from-accent-500/5 via-accent-400/3 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        "
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-5">
          <div
            className="
              w-16 h-16 md:w-18 md:h-18
              rounded-2xl
              bg-gradient-to-br from-accent-100 to-accent-50
              flex items-center justify-center
              text-3xl md:text-4xl
              shadow-sm
              group-hover:scale-110 group-hover:rotate-3
              transition-all duration-300
            "
          >
            {icon}
          </div>
        </div>

        {/* Title */}
        <h3
          className="
            font-playfair text-xl md:text-2xl
            font-bold text-primary-800 mb-2
            group-hover:text-accent-600
            transition-colors duration-300
          "
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-neutral-500 font-poppins mb-4 leading-relaxed">
          {description}
        </p>

        {/* Arrow indicator */}
        <div
          className="
            flex items-center gap-2
            text-accent-600 font-poppins font-semibold text-sm
            group-hover:gap-3
            transition-all duration-300
          "
        >
          <span>Explorar</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Decorative corner */}
      <div
        className="
          absolute top-0 right-0
          w-24 h-24
          bg-gradient-to-br from-accent-500/5 to-transparent
          rounded-bl-full
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        "
      />
    </Link>
  );
}
