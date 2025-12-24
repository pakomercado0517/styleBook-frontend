'use client';

import type { ReactNode } from 'react';
import { Mail, Phone, ChevronDown, Users } from 'lucide-react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { CreateEmployeeInput } from '@/lib/schemas/employees.schema';
import { useState } from 'react';

interface PersonalInfoFieldsProps {
  register: UseFormRegister<CreateEmployeeInput>;
  errors: FieldErrors<CreateEmployeeInput>;
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

/**
 * Campos de información personal
 * Mobile: lista vertical simple
 * Desktop: card con icono de dos personas y título "Información Personal"
 */
export function PersonalInfoFields({
  register,
  errors,
  selectedRole,
  onRoleChange,
}: PersonalInfoFieldsProps): ReactNode {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roleOptions = [
    'Estilista Senior',
    'Estilista',
    'Colorista',
    'Barbero',
    'Manicurista',
    'Esteticista',
    'Masajista',
    'Recepcionista',
    'Otro',
  ];

  const fieldsContent = (
    <div className="space-y-4">
      {/* Nombre Completo */}
      <div>
        <label className="block text-sm font-medium text-white font-poppins mb-2">
          Nombre Completo
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
          placeholder="Ej. Ana García"
          aria-label="Nombre completo"
          {...register('name')}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400 font-poppins">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-white font-poppins mb-2">
          Email
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Mail className="w-5 h-5 text-neutral-400" strokeWidth={2} />
          </div>
          <input
            type="email"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
            placeholder="ana@salon.com"
            aria-label="Email"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-400 font-poppins">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-medium text-white font-poppins mb-2">
          Teléfono
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Phone className="w-5 h-5 text-neutral-400" strokeWidth={2} />
          </div>
          <input
            type="tel"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
            placeholder="+34 600 000 000"
            aria-label="Teléfono"
            {...register('phone')}
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-red-400 font-poppins">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Puesto / Rol */}
      <div>
        <label className="block text-sm font-medium text-white font-poppins mb-2">
          Puesto / Rol
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-poppins focus:outline-none focus:border-accent-500 transition-colors flex items-center justify-between"
          >
            <span className={selectedRole ? 'text-white' : 'text-neutral-400'}>
              {selectedRole || 'Selecciona un puesto'}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-white transition-transform ${
                isRoleDropdownOpen ? 'rotate-180' : ''
              }`}
              strokeWidth={2}
            />
          </button>
          {isRoleDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsRoleDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-full bg-[#201d12] border border-white/10 rounded-xl shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto">
                {roleOptions.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      onRoleChange(role);
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left font-poppins transition-colors text-white hover:bg-white/5"
                    style={
                      selectedRole === role
                        ? {
                            backgroundColor: 'rgba(212, 175, 55, 0.2)',
                            color: '#D4AF37',
                          }
                        : { color: '#FFFFFF' }
                    }
                  >
                    {role}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {errors.specialty && (
          <p className="mt-1 text-sm text-red-400 font-poppins">
            {errors.specialty.message}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">{fieldsContent}</div>

      {/* Desktop - Card */}
      <div className="hidden md:block bg-white/5 rounded-xl p-6 border border-white/10">
        {/* Título con icono */}
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-[#D4AF37]" strokeWidth={2} />
          <h2 className="text-xl font-bold text-white font-playfair">
            Información Personal
          </h2>
        </div>
        {fieldsContent}
      </div>
    </>
  );
}

