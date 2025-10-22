import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium font-poppins text-primary-800 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl font-poppins text-base',
            'border-2 transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-neutral-200 focus:border-accent-500 focus:ring-accent-500/20',
            'bg-white text-primary-800',
            'placeholder:text-neutral-400',
            'hover:border-accent-400 hover:shadow-md hover:shadow-accent-500/5',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 font-poppins">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-neutral-500 font-poppins">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

