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
          'bg-primary-800 text-white border-2 border-accent-500/30 hover:bg-primary-900 hover:border-accent-500/50 hover:shadow-xl hover:shadow-primary-800/20 active:scale-95',
        secondary:
          'bg-white text-primary-800 border-2 border-primary-800/20 hover:bg-neutral-50 hover:border-primary-800/30 hover:shadow-2xl hover:shadow-neutral-900/10 active:bg-neutral-100 shadow-lg',
        gold: 'bg-accent-500 text-primary-900 border-2 border-accent-600 hover:bg-accent-400 hover:border-accent-700 hover:shadow-2xl hover:shadow-accent-500/60 active:scale-95 shadow-xl shadow-accent-500/50 font-bold',
        outline:
          'border-2 border-accent-500 text-accent-600 bg-transparent hover:bg-accent-500/10 hover:border-accent-600 active:bg-accent-500/20 shadow-md shadow-accent-400/20',
        ghost:
          'text-primary-800 border-2 border-transparent hover:bg-neutral-100 hover:border-neutral-200 active:bg-neutral-200',
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
