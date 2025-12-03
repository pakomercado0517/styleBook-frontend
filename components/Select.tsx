import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

/**
 * Componente Select para formularios
 * Estilo consistente con Input y diseño Luxe Noir
 */
export function Select({
  label,
  error,
  helperText,
  options,
  className,
  disabled,
  ...props
}: SelectProps): ReactNode {
  return (
    <div className="space-y-2">
      {label && (
        <label
          className={cn(
            'block text-sm font-medium font-poppins',
            error ? 'text-red-600' : 'text-primary-800'
          )}
        >
          {label}
        </label>
      )}

      <select
        className={cn(
          'w-full px-4 py-3 rounded-xl border-2 font-poppins',
          'bg-white text-primary-800',
          'focus:outline-none focus:ring-2 focus:ring-accent-500/20',
          'transition-all duration-200',
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-neutral-200 hover:border-neutral-300 focus:border-accent-500',
          disabled && 'opacity-50 cursor-not-allowed bg-neutral-50',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-red-600 font-poppins">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-sm text-neutral-500 font-poppins">{helperText}</p>
      )}
    </div>
  );
}

