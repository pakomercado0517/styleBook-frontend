'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';

interface EmployeeProfileCardProps {
  photoUrl?: string;
  employeeName: string;
  specialty?: string | null;
  employeeId: number;
  onChangePhoto: () => void;
}

/**
 * Card de perfil del empleado (Desktop)
 * Muestra foto grande, nombre, especialidad, ID y botón para cambiar foto
 */
export function EmployeeProfileCard({
  photoUrl,
  employeeName,
  specialty,
  employeeId,
  onChangePhoto,
}: EmployeeProfileCardProps): ReactNode {
  // Obtener iniciales para el avatar
  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(employeeName);
  const formattedId = `#EMP-${String(employeeId).padStart(3, '0')}`;

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      {/* Foto de perfil */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10 border-2 border-white/20 flex items-center justify-center">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={employeeName}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-5xl font-bold text-white font-poppins">
                {initials}
              </span>
            )}
          </div>
          {/* Botón de cámara superpuesto */}
          <button
            onClick={onChangePhoto}
            className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/30 hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: '#D4AF37',
            }}
            aria-label="Cambiar foto de perfil"
            type="button"
          >
            <Camera className="w-5 h-5 text-primary-900" strokeWidth={2} />
          </button>
        </div>

        {/* Nombre */}
        <h2 className="text-2xl font-bold text-white font-poppins mb-2 text-center">
          {employeeName}
        </h2>

        {/* Especialidad e ID */}
        <div className="text-center mb-4">
          <p className="text-base text-neutral-300 font-poppins">
            {specialty || 'Sin especialidad'} • ID: {formattedId}
          </p>
        </div>

        {/* Botón Cambiar Foto */}
        <button
          onClick={onChangePhoto}
          className="text-sm font-medium font-poppins transition-opacity hover:opacity-80"
          style={{ color: '#D4AF37' }}
          type="button"
        >
          Cambiar Foto de Perfil
        </button>
      </div>
    </div>
  );
}

