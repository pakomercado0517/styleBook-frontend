import { type ReactNode } from 'react';

interface CardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function Card({
  icon,
  title,
  description,
  className = '',
}: CardProps): React.ReactNode {
  return (
    <div
      className={`group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl hover:shadow-accent-500/10 transition-all duration-300 ease-out border border-neutral-200 hover:border-accent-500/30 ${className}`}
    >
      {icon && (
        <div className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>
      )}
      <h3 className="font-playfair text-2xl font-bold text-primary-800 mb-3 group-hover:text-accent-600 transition-colors">
        {title}
      </h3>
      <p className="font-poppins text-neutral-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
