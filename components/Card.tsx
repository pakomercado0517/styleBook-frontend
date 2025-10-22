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
      className={`group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:border-transparent border border-gray-100 ${className}`}
    >
      {icon && (
        <div className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      )}
      <h3 className="font-playfair text-2xl font-bold text-slate-900 mb-3">
        {title}
      </h3>
      <p className="font-poppins text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
