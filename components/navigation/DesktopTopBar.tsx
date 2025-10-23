'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';

/**
 * Top bar para desktop
 * Muestra rol, nombre de usuario y botón de logout
 * Solo visible en md+ (768px+)
 */
export function DesktopTopBar(): ReactNode {
  const { user, logout } = useAuth();

  if (!user) return null;

  const roleLabel = user.role === 'client' ? '👤 Cliente' : '🏢 Proveedor';
  const roleBadge = user.role === 'client' ? 'primary' : 'primary';

  return (
    <header className="hidden md:block bg-white border-b border-neutral-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <Badge variant={roleBadge}>{roleLabel}</Badge>
          <div>
            <h2 className="font-poppins text-sm font-semibold text-primary-800">
              {user.name}
            </h2>
            <p className="text-xs text-neutral-600">{user.email}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={logout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
}
