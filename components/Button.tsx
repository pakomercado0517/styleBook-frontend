import { type ReactNode } from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-poppins font-semibold transition-all duration-300 ease-out focus-ring rounded-full',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-800 text-white hover:bg-primary-900 hover:shadow-xl hover:shadow-primary-800/20 active:scale-95',
        secondary:
          'bg-white text-primary-800 border-2 border-white hover:bg-neutral-50 hover:shadow-2xl hover:shadow-white/30 active:bg-neutral-100 shadow-xl',
        gold: 'bg-accent-500 text-primary-900 hover:bg-accent-400 hover:shadow-2xl hover:shadow-accent-500/60 active:scale-95 shadow-xl shadow-accent-500/50 font-bold',
        outline:
          'border-2 border-accent-400 text-accent-400 bg-transparent hover:bg-accent-500/10 active:bg-accent-500/20 shadow-lg shadow-accent-400/30',
        ghost: 'text-primary-800 hover:bg-neutral-100 active:bg-neutral-200',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        xl: 'px-10 py-5 text-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: ReactNode;
  asLink?: boolean;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  aria?: {
    label?: string;
    describedBy?: string;
  };
}

export function Button({
  children,
  variant,
  size,
  asLink = false,
  href = '#',
  onClick,
  disabled = false,
  className,
  type = 'button',
  aria,
}: ButtonProps): React.ReactNode {
  const baseClasses = cn(buttonVariants({ variant, size }), className);

  if (asLink && href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, disabled && 'opacity-50 cursor-not-allowed')}
      aria-label={aria?.label}
      aria-describedby={aria?.describedBy}
    >
      {children}
    </button>
  );
}
