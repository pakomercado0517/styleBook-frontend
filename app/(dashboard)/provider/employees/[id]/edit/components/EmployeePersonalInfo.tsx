'use client';

import type { ReactNode } from 'react';
import { User, Mail, Phone, Briefcase } from 'lucide-react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { UpdateEmployeeInput } from '@/lib/schemas/employees.schema';

interface EmployeePersonalInfoProps {
  register: UseFormRegister<UpdateEmployeeInput>;
  errors: FieldErrors<UpdateEmployeeInput>;
}

/**
 * Sección de información personal del empleado
 * Campos con iconos según el diseño de la imagen
 */
export function EmployeePersonalInfo({
  register,
  errors,
}: EmployeePersonalInfoProps): ReactNode {
  return (
    <div className="space-y-4">
      {/* Título de sección */}
      <h2 className="text-xl font-bold text-white font-playfair">
        Información Personal
      </h2>

      {/* Campos */}
      <div className="space-y-4">
        {/* Nombre Completo */}
        <div>
          <label className="block text-sm font-medium text-white font-poppins mb-2">
            Nombre Completo
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <User className="w-5 h-5 text-neutral-400" strokeWidth={2} />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
              placeholder="Ej: Ana García"
              aria-label="Nombre completo"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400 font-poppins">
                {errors.name.message}
              </p>
            )}
          </div>
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
              placeholder="Ej: ana@salon.com"
              aria-label="Email"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400 font-poppins">
                {errors.email.message}
              </p>
            )}
          </div>
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
              placeholder="Ej: +34 600 123 456"
              aria-label="Teléfono"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-400 font-poppins">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Rol / Especialidad */}
        <div>
          <label className="block text-sm font-medium text-white font-poppins mb-2">
            Rol / Especialidad
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Briefcase className="w-5 h-5 text-neutral-400" strokeWidth={2} />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
              placeholder="Ej: Estilista Senior"
              aria-label="Rol / Especialidad"
              {...register('specialty')}
            />
            {errors.specialty && (
              <p className="mt-1 text-sm text-red-400 font-poppins">
                {errors.specialty.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

