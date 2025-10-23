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
 * Link clickeable a diferentes secciones con hover animado
 */
export function QuickActionCard({
  icon,
  title,
  description,
  href,
  variant = 'primary',
}: QuickActionCardProps): ReactNode {
  const baseClasses =
    'group block bg-white rounded-2xl p-6 border transition-all hover:shadow-2xl hover:-translate-y-1';

  const variantClasses =
    variant === 'primary'
      ? 'border-neutral-200 hover:border-accent-500'
      : 'border-neutral-200 hover:border-primary-800';

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses}`}>
      {/* Icon */}
      <div className="mb-4">
        <div className="w-14 h-14 rounded-xl bg-accent-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className="font-playfair text-xl font-bold text-primary-800 mb-2 group-hover:text-accent-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-neutral-600 font-poppins">{description}</p>

      {/* Arrow indicator */}
      <div className="mt-4 flex items-center text-accent-600 font-poppins font-medium text-sm group-hover:translate-x-2 transition-transform">
        Ver más →
      </div>
    </Link>
  );
}
