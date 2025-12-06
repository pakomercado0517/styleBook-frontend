'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  Heart,
  CreditCard,
  MapPin,
  Bell,
  LogOut,
  Edit,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { DesktopContentHeader } from '@/components/navigation/DesktopContentHeader';

interface MenuItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'history',
    label: 'Historial de Servicios',
    description: 'Consulta tus citas pasadas y futuras',
    icon: Clock,
    href: '/client/appointments?tab=past',
  },
  {
    id: 'favorites',
    label: 'Favoritos',
    description: 'Accede a tus profesionales y servicios guardados',
    icon: Heart,
    href: '/client/favorites',
  },
  {
    id: 'payment',
    label: 'Métodos de Pago',
    description: 'Gestiona tus tarjetas y métodos de pago',
    icon: CreditCard,
    href: '/client/profile/payment-methods',
  },
  {
    id: 'addresses',
    label: 'Direcciones Guardadas',
    description: 'Administra tus direcciones para servicios a domicilio',
    icon: MapPin,
    href: '/client/profile/addresses',
  },
  {
    id: 'notifications',
    label: 'Configuración de Notificaciones',
    description: 'Elige cómo y cuándo quieres recibir alertas',
    icon: Bell,
    href: '/client/profile/notifications',
  },
];

/**
 * Página de Mi Perfil - Cliente
 * Rediseño mobile-first con estilo Luxe Noir y versión desktop
 */
export default function ClientProfilePage(): ReactNode {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const handleEditProfile = (): void => {
    // TODO: Implementar modal o navegación para editar perfil
    router.push('/client/profile/edit');
  };

  const handleMenuItemClick = (href: string): void => {
    router.push(href);
  };

  const handleLogout = (): void => {
    logout();
  };

  // Obtener iniciales para el avatar
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#201d12] flex flex-col">
      {/* Header - Mobile */}
      <div className="px-4 py-4 border-b border-white/10 md:hidden">
        <h1 className="text-xl font-bold text-white font-playfair">Mi Perfil</h1>
      </div>

      {/* Header - Desktop */}
      <div className="hidden md:block px-8 py-6">
        <DesktopContentHeader title="Mi Perfil" />
      </div>

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Card de información del perfil */}
          <div className="bg-white/5 rounded-xl p-6 md:p-8 mb-6 border border-white/10">
            {/* Avatar con botón de editar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center overflow-hidden border-2 border-white/20">
                  {user.phone ? (
                    // Si hay foto de perfil, mostrarla aquí
                    <span className="text-3xl md:text-4xl text-white font-bold font-poppins">
                      {initials}
                    </span>
                  ) : (
                    <span className="text-3xl md:text-4xl text-white font-bold font-poppins">
                      {initials}
                    </span>
                  )}
                </div>
                {/* Botón de editar superpuesto */}
                <button
                  onClick={handleEditProfile}
                  className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 border-[#201d12] transition-colors hover:scale-110"
                  style={{
                    backgroundColor: '#D4AF37',
                  }}
                  aria-label="Editar perfil"
                  type="button"
                >
                  <Edit className="w-4 h-4 md:w-5 md:h-5 text-primary-900" strokeWidth={2} />
                </button>
              </div>

              {/* Nombre */}
              <h2 className="text-2xl md:text-3xl font-bold text-white font-playfair mt-4 mb-2">
                {user.name}
              </h2>

              {/* Email */}
              <p className="text-sm md:text-base text-neutral-300 font-poppins mb-1">
                {user.email}
              </p>

              {/* Teléfono */}
              {user.phone && (
                <p className="text-sm md:text-base text-neutral-300 font-poppins mb-6">
                  {user.phone}
                </p>
              )}

              {/* Botón Editar Perfil - Desktop */}
              <button
                onClick={handleEditProfile}
                className="hidden md:flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold font-poppins transition-colors"
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#1A1A1A',
                }}
                type="button"
              >
                <Edit className="w-5 h-5" strokeWidth={2} />
                <span>Editar Perfil</span>
              </button>
            </div>
          </div>

          {/* Lista de opciones de menú */}
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden mb-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === menuItems.length - 1;

              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.href)}
                  className={`
                    w-full flex items-center justify-between px-4 md:px-6 py-4 md:py-5 transition-colors
                    ${!isLast ? 'border-b border-white/10' : ''}
                    hover:bg-white/5
                  `}
                  type="button"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Icono con fondo dorado */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#D4AF37' }}
                    >
                      <Icon className="w-6 h-6 text-primary-900" strokeWidth={2} />
                    </div>
                    {/* Texto - Mobile solo muestra título, Desktop muestra título y descripción */}
                    <div className="flex-1 min-w-0">
                      <p className="text-base md:text-lg font-semibold text-white font-poppins mb-0 md:mb-1">
                        {item.label}
                      </p>
                      <p className="hidden md:block text-sm text-neutral-300 font-poppins">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400 flex-shrink-0" strokeWidth={2} />
                </button>
              );
            })}
          </div>

          {/* Botón Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold font-poppins hover:bg-white/10 transition-colors"
            type="button"
          >
            <LogOut className="w-5 h-5" strokeWidth={2} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}
