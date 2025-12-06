'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';

interface ProfilePictureSectionProps {
  photoUrl?: string;
  userName: string;
  onChangePhoto: () => void;
}

/**
 * Sección de foto de perfil
 * Muestra foto circular con botón para cambiar
 */
export function ProfilePictureSection({
  photoUrl,
  userName,
  onChangePhoto,
}: ProfilePictureSectionProps): ReactNode {
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center py-6">
      {/* Foto de perfil */}
      <div className="relative mb-4">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10 border-4 border-white/20 flex items-center justify-center">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={userName}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-5xl font-bold text-white font-poppins">
              {userInitial}
            </span>
          )}
        </div>
        {/* Icono de cámara superpuesto */}
        <button
          onClick={onChangePhoto}
          className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary-800 border-2 border-white/30 hover:bg-primary-900 transition-colors"
          aria-label="Cambiar foto"
          type="button"
        >
          <Camera className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
      </div>
      {/* Botón Cambiar Foto */}
      <button
        onClick={onChangePhoto}
        className="px-6 py-3 rounded-xl font-semibold font-poppins transition-colors bg-white/5 border border-white/10 text-white hover:bg-white/10"
        type="button"
      >
        Cambiar Foto
      </button>
    </div>
  );
}

