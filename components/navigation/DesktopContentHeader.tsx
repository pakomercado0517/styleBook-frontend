'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Bell, User } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

interface DesktopContentHeaderProps {
  title: string;
}

/**
 * Header del contenido principal en desktop
 * Muestra título a la izquierda y acciones (notificaciones, perfil) a la derecha
 */
export function DesktopContentHeader({
  title,
}: DesktopContentHeaderProps): ReactNode {
  const { user } = useAuth();
  const userName = user?.name?.split(' ')[0] || 'Usuario';

  return (
    <header className="hidden md:flex items-center justify-between pb-6 mb-6 border-b border-white/10">
      {/* Título */}
      <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-[-0.015em] text-white font-playfair">
        {title}
      </h1>

      {/* Acciones: Notificaciones y Perfil */}
      <div className="flex items-center gap-4">
        {/* Botón de notificaciones */}
        <button
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-transparent text-white hover:bg-white/10 transition-colors"
          aria-label="Notificaciones"
          tabIndex={0}
          type="button"
        >
          <Bell className="w-5 h-5 text-white" strokeWidth={2} />
        </button>

        {/* Avatar del usuario */}
        {user && (
          <Link
            href={
              user.role === 'client' ? '/client/profile' : '/provider/profile'
            }
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/30">
              {user.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photo_url}
                  alt={`${userName}'s profile picture`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}

