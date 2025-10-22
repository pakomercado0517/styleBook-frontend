import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: ReactNode;
  className?: string;
}

export function Badge({
  children,
  variant = 'primary',
  icon,
  className = '',
}: BadgeProps): React.ReactNode {
  const baseClasses =
    'inline-flex items-center gap-2 font-poppins font-semibold rounded-full px-4 py-2 text-sm transition-colors duration-300';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700',
    secondary: 'bg-orange-100 text-orange-700',
    outline:
      'border-2 border-purple-600 text-purple-600 bg-transparent hover:bg-purple-50',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </span>
  );
}
