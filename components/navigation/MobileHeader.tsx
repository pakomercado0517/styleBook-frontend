'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

/**
 * Header móvil compacto
 * Muestra logo, saludo del usuario y avatar
 * Se oculta en desktop donde se usa top bar diferente
 */
export function MobileHeader(): ReactNode {
  const { user } = useAuth();
  const userName = user?.name?.split(' ')[0] || 'Usuario';

  return (
    <header className="sticky top-0 z-40 bg-[#121212] border-b border-white/10 md:hidden">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Avatar y Saludo */}
        <div className="flex items-center gap-2">
          {/* Avatar del usuario */}
          {user && (
            <Link
              href={
                user.role === 'client' ? '/client/profile' : '/provider/profile'
              }
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/30">
                <span className="text-white font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </Link>
          )}
          <h2 className="font-playfair text-lg font-bold text-white">
            Hola, {userName}
          </h2>
        </div>

        {/* Botón de notificaciones */}
        <button
          className="flex h-10 w-10 min-w-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-transparent p-0 text-base font-bold leading-normal tracking-[0.015em] text-white hover:bg-white/10 transition-colors"
          aria-label="Notificaciones"
          tabIndex={0}
          type="button"
        >
          <Bell className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
