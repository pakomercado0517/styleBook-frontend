import { cn } from '@/lib/utils/cn';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary-800 text-accent-500 border-accent-500/30',
  secondary: 'bg-neutral-100 text-neutral-800 border-neutral-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
};

export function Badge({
  children,
  variant = 'primary',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
