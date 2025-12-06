'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { Camera, Pencil } from 'lucide-react';

interface PersonalInfoSectionProps {
  photoUrl?: string;
  userName: string;
  email: string;
  phone: string;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onChangePhoto: () => void;
}

/**
 * Sección de información personal
 * Desktop: Card con avatar a la izquierda y campos a la derecha
 */
export function PersonalInfoSection({
  photoUrl,
  userName,
  email,
  phone,
  onEmailChange,
  onPhoneChange,
  onChangePhoto,
}: PersonalInfoSectionProps): ReactNode {
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white font-poppins mb-6">
        Información Personal
      </h2>
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 border-4 border-white/20 flex items-center justify-center">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={userName}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-white font-poppins">
                {userInitial}
              </span>
            )}
          </div>
          {/* Icono de cámara dorado superpuesto */}
          <button
            onClick={onChangePhoto}
            className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/30 hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: '#D4AF37',
            }}
            aria-label="Cambiar foto"
            type="button"
          >
            <Camera className="w-5 h-5 text-primary-900" strokeWidth={2} />
          </button>
        </div>

        {/* Campos */}
        <div className="flex-1 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-white font-poppins mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
                placeholder="tu@email.com"
                aria-label="Email"
              />
              <Pencil className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" strokeWidth={2} />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-semibold text-white font-poppins mb-2">
              Número de teléfono
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
                placeholder="+1 (555) 123-4567"
                aria-label="Número de teléfono"
              />
              <Pencil className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

