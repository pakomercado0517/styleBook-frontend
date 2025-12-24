'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';

interface EmployeeProfilePictureProps {
  photoUrl?: string;
  employeeName: string;
  onChangePhoto: () => void;
}

/**
 * Sección de foto de perfil del empleado
 * Muestra foto circular con botón de cámara superpuesto
 */
export function EmployeeProfilePicture({
  photoUrl,
  employeeName,
  onChangePhoto,
}: EmployeeProfilePictureProps): ReactNode {
  // Obtener iniciales para el avatar
  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(employeeName);

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Foto de perfil */}
      <div className="relative">
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
            <span className="text-4xl font-bold text-white font-poppins">
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

      {/* Texto "Cambiar Foto de Perfil" */}
      <button
        onClick={onChangePhoto}
        className="text-sm font-medium font-poppins transition-opacity hover:opacity-80"
        style={{ color: '#D4AF37' }}
        type="button"
      >
        Cambiar Foto de Perfil
      </button>
    </div>
  );
}

