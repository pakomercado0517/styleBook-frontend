'use client';

import type { ReactNode } from 'react';

interface PersonalInfoFieldsProps {
  email: string;
  phone: string;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

/**
 * Campos de información personal
 * Email y teléfono
 */
export function PersonalInfoFields({
  email,
  phone,
  onEmailChange,
  onPhoneChange,
}: PersonalInfoFieldsProps): ReactNode {
  return (
    <div className="space-y-6">
      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-white font-poppins mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
          placeholder="tu@email.com"
          aria-label="Email"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-semibold text-white font-poppins mb-2">
          Número de teléfono
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
          placeholder="+1 (555) 123-4567"
          aria-label="Número de teléfono"
        />
      </div>
    </div>
  );
}

