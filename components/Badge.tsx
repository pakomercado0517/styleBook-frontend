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
    'inline-flex items-center gap-2 font-poppins font-semibold rounded-full px-4 py-2 text-sm transition-all duration-300';

  const variantClasses = {
    primary:
      'bg-primary-900 text-accent-400 border-2 border-accent-500/50 shadow-lg shadow-accent-500/30 backdrop-blur-sm',
    secondary: 'bg-accent-100 text-accent-700 shadow-md',
    outline:
      'border-2 border-accent-400 text-accent-400 bg-transparent hover:bg-accent-50 shadow-md shadow-accent-400/20',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </span>
  );
}
