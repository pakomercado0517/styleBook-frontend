'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMyProviderProfile } from '@/lib/hooks/useMyProviderProfile';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { ProfileForm } from '../../client/profile/components/ProfileForm';
import { PasswordForm } from '../../client/profile/components/PasswordForm';
import { ProviderBusinessForm } from './components/ProviderBusinessForm';
import { formatLocalDate } from '@/lib/utils/dateUtils';
import { logout } from '@/lib/api/auth';

/**
 * Página de perfil - Proveedor
 * Permite editar información personal y cambiar contraseña
 */
export default function ProviderProfilePage(): ReactNode {
  const { user } = useAuth();
  const { data: providerProfile } = useMyProviderProfile();

  if (!user) {
    return null;
  }

  const memberSinceDate = user.memberSince
    ? formatLocalDate(user.memberSince)
    : 'Fecha no disponible';

  // Mapeo de tipos de negocio a español
  const businessTypeLabels: Record<string, string> = {
    salon: 'Salón de Belleza',
    barbershop: 'Barbería',
    spa: 'Spa',
    nails: 'Uñas',
    makeup: 'Maquillaje',
    hair: 'Peluquería',
    other: 'Otro',
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary-800 mb-2">
          Mi Perfil
        </h1>
        <p className="text-neutral-600 font-poppins">
          Gestiona tu información personal y de negocio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Info del usuario */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 sticky top-20">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-luxe flex items-center justify-center mb-4">
                <span className="text-accent-400 text-4xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="font-playfair text-xl font-bold text-primary-800 text-center">
                {user.name}
              </h2>
              <Badge variant="primary" className="mt-2">
                🏢 Proveedor
              </Badge>
            </div>

            {/* Info adicional */}
            <div className="space-y-3 pt-4 border-t border-neutral-200">
              {providerProfile && (
                <>
                  <div>
                    <p className="text-xs text-neutral-500 font-poppins mb-1">
                      Negocio
                    </p>
                    <p className="text-sm text-neutral-700 font-poppins font-semibold">
                      {providerProfile.business_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-poppins mb-1">
                      Tipo
                    </p>
                    <p className="text-sm text-neutral-700 font-poppins">
                      {businessTypeLabels[providerProfile.business_type] ||
                        providerProfile.business_type}
                    </p>
                  </div>
                  {providerProfile.city && (
                    <div>
                      <p className="text-xs text-neutral-500 font-poppins mb-1">
                        Ubicación
                      </p>
                      <p className="text-sm text-neutral-700 font-poppins">
                        {providerProfile.city}
                        {providerProfile.country && `, ${providerProfile.country}`}
                      </p>
                    </div>
                  )}
                  {providerProfile.average_rating && (
                    <div>
                      <p className="text-xs text-neutral-500 font-poppins mb-1">
                        Rating
                      </p>
                      <p className="text-sm text-neutral-700 font-poppins">
                        ⭐ {providerProfile.average_rating.toFixed(1)}
                      </p>
                    </div>
                  )}
                  <div className="pt-2 border-t border-neutral-200"></div>
                </>
              )}

              <div>
                <p className="text-xs text-neutral-500 font-poppins mb-1">
                  Email
                </p>
                <p className="text-sm text-neutral-700 font-poppins break-all">
                  {user.email}
                </p>
              </div>

              {user.phone && (
                <div>
                  <p className="text-xs text-neutral-500 font-poppins mb-1">
                    Teléfono
                  </p>
                  <p className="text-sm text-neutral-700 font-poppins">
                    {user.phone}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-neutral-500 font-poppins mb-1">
                  Miembro desde
                </p>
                <p className="text-sm text-neutral-700 font-poppins">
                  {memberSinceDate}
                </p>
              </div>
            </div>

            {/* Botón de cerrar sesión */}
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
              >
                🚪 Cerrar Sesión
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content - Formularios */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del Negocio */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-neutral-200">
            <h3 className="font-playfair text-2xl font-bold text-primary-800 mb-1">
              Información del Negocio
            </h3>
            <p className="text-sm text-neutral-600 font-poppins mb-6">
              Gestiona los datos de tu negocio (horarios, dirección, tipo)
            </p>
            <ProviderBusinessForm />
          </div>

          {/* Información Personal */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-neutral-200">
            <h3 className="font-playfair text-2xl font-bold text-primary-800 mb-1">
              Información Personal
            </h3>
            <p className="text-sm text-neutral-600 font-poppins mb-6">
              Actualiza tus datos personales
            </p>
            <ProfileForm />
          </div>

          {/* Cambiar Contraseña */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-neutral-200">
            <h3 className="font-playfair text-2xl font-bold text-primary-800 mb-1">
              Cambiar Contraseña
            </h3>
            <p className="text-sm text-neutral-600 font-poppins mb-6">
              Mantén tu cuenta segura
            </p>
            <PasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
