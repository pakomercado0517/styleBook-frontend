'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

/**
 * Header móvil compacto
 * Muestra logo, título opcional y avatar del usuario
 * Se oculta en desktop donde se usa top bar diferente
 */
export function MobileHeader(): ReactNode {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 md:hidden">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-luxe flex items-center justify-center">
            <span className="text-accent-400 text-xl font-bold">S</span>
          </div>
          <span className="font-playfair text-lg font-bold text-primary-800">
            StyleBook
          </span>
        </Link>

        {/* User Avatar */}
        {user && (
          <Link
            href={
              user.role === 'client' ? '/client/profile' : '/provider/profile'
            }
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center border-2 border-accent-500">
              <span className="text-accent-700 font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
