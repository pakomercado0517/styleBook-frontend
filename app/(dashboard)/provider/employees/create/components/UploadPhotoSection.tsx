'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';

interface UploadPhotoSectionProps {
  photoUrl?: string;
  onChangePhoto: () => void;
}

/**
 * Sección de subir foto de perfil
 * Mobile: foto centrada con texto descriptivo
 * Desktop: card con foto y texto "Recomendado 400x400px"
 */
export function UploadPhotoSection({
  photoUrl,
  onChangePhoto,
}: UploadPhotoSectionProps): ReactNode {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden flex flex-col items-center space-y-3">
        {/* Foto de perfil */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10 border-2 border-white/20 flex items-center justify-center">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt="Foto de perfil"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
                <span className="text-5xl">👤</span>
              </div>
            )}
          </div>
          {/* Botón de cámara superpuesto */}
          <button
            onClick={onChangePhoto}
            className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/30 hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: '#D4AF37',
            }}
            aria-label="Subir foto"
            type="button"
          >
            <Camera className="w-5 h-5 text-primary-900" strokeWidth={2} />
          </button>
        </div>

        {/* Texto "Subir Foto" */}
        <button
          onClick={onChangePhoto}
          className="text-base font-medium font-poppins transition-opacity hover:opacity-80"
          style={{ color: '#D4AF37' }}
          type="button"
        >
          Subir Foto
        </button>

        {/* Texto descriptivo */}
        <p className="text-sm text-neutral-400 font-poppins text-center">
          Toca para editar o tomar foto
        </p>
      </div>

      {/* Desktop - Card */}
      <div className="hidden md:block bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="flex flex-col items-center space-y-4">
          {/* Foto de perfil */}
          <div className="relative">
            <div className="w-40 h-40 rounded-full overflow-hidden bg-white/10 border-2 border-white/20 flex items-center justify-center">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt="Foto de perfil"
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
                  <span className="text-6xl">👤</span>
                </div>
              )}
            </div>
            {/* Botón de cámara superpuesto */}
            <button
              onClick={onChangePhoto}
              className="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: '#D4AF37',
              }}
              aria-label="Subir foto"
              type="button"
            >
              <Camera className="w-6 h-6 text-primary-900" strokeWidth={2} />
            </button>
          </div>

          {/* Texto "Subir Foto" */}
          <button
            onClick={onChangePhoto}
            className="text-base font-medium font-poppins transition-opacity hover:opacity-80"
            style={{ color: '#D4AF37' }}
            type="button"
          >
            Subir Foto
          </button>

          {/* Texto "Recomendado 400x400px" */}
          <p className="text-sm text-neutral-400 font-poppins text-center">
            Recomendado 400x400px
          </p>
        </div>
      </div>
    </>
  );
}

