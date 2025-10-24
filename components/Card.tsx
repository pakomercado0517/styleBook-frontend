import { cn } from '@/lib/utils/cn';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-neutral-200 shadow-md',
        'hover:shadow-2xl hover:shadow-accent-500/10 hover:border-accent-500/30',
        'transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}
