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
          'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white hover:shadow-lg hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 active:scale-95',
        outline:
          'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100',
        ghost: 'text-purple-600 hover:bg-purple-50 active:bg-purple-100',
        secondary:
          'bg-white border-2 border-gray-200 text-slate-900 hover:border-purple-600 hover:text-purple-600 active:bg-gray-50',
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
