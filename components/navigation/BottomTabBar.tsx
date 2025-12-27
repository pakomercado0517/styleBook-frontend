'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ShoppingBag,
  Briefcase,
  Calendar,
  Heart,
  User,
  Bell,
  Users,
  Clock,
  BarChart3,
  Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TabItem {
  icon: LucideIcon;
  label: string;
  href: string;
  activePatterns: string[]; // Patrones para detectar si está activo
}

interface BottomTabBarProps {
  role: 'client' | 'provider';
}

/**
 * Bottom Tab Bar para navegación móvil
 * Fixed bottom con 4-5 tabs principales según el rol
 * Se oculta en desktop (md+) donde se usa sidebar
 */
export function BottomTabBar({ role }: BottomTabBarProps): ReactNode {
  const pathname = usePathname();

  // Tabs específicos por rol
  // Labels optimizados para 6 items en mobile
  const clientTabs: TabItem[] = [
    {
      icon: Home,
      label: 'Inicio',
      href: '/client',
      activePatterns: ['/client$'],
    },
    {
      icon: ShoppingBag,
      label: 'Servicios',
      href: '/client/services',
      activePatterns: ['/client/services'],
    },
    {
      icon: Briefcase,
      label: 'Proveedores',
      href: '/client/providers',
      activePatterns: ['/client/providers'],
    },
    {
      icon: Calendar,
      label: 'Citas',
      href: '/client/appointments',
      activePatterns: ['/client/appointments'],
    },
    {
      icon: Heart,
      label: 'Favoritos',
      href: '/client/favorites',
      activePatterns: ['/client/favorites'],
    },
    {
      icon: User,
      label: 'Perfil',
      href: '/client/profile',
      activePatterns: ['/client/profile'],
    },
  ];

  const providerTabs: TabItem[] = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/provider',
      activePatterns: ['/provider$'],
    },
    {
      icon: Briefcase,
      label: 'Servicios',
      href: '/provider/services',
      activePatterns: ['/provider/services'],
    },
    {
      icon: Calendar,
      label: 'Citas',
      href: '/provider/appointments',
      activePatterns: ['/provider/appointments'],
    },
    {
      icon: ShoppingBag,
      label: 'Negocio',
      href: '/provider/business',
      activePatterns: ['/provider/business'],
    },
    {
      icon: Users,
      label: 'Empleados',
      href: '/provider/employees',
      activePatterns: ['/provider/employees'],
    },
    {
      icon: Clock,
      label: 'Horarios',
      href: '/provider/schedule',
      activePatterns: ['/provider/schedule'],
    },
    {
      icon: BarChart3,
      label: 'Analíticas',
      href: '/provider/analytics',
      activePatterns: ['/provider/analytics'],
    },
    {
      icon: Star,
      label: 'Reseñas',
      href: '/provider/reviews',
      activePatterns: ['/provider/reviews'],
    },
    {
      icon: Bell,
      label: 'Notificaciones',
      href: '/provider/notifications',
      activePatterns: ['/provider/notifications'],
    },
    {
      icon: User,
      label: 'Perfil',
      href: '/provider/profile',
      activePatterns: ['/provider/profile'],
    },
  ];

  const tabs = role === 'client' ? clientTabs : providerTabs;

  /**
   * Verifica si un tab está activo según el pathname actual
   */
  const isActive = (patterns: string[]): boolean => {
    return patterns.some((pattern) => {
      const regex = new RegExp(pattern);
      return regex.test(pathname);
    });
  };

  // Para provider, usar scroll horizontal si hay más de 5 tabs
  const useHorizontalScroll = role === 'provider' && tabs.length > 5;

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50 md:hidden
        bg-[#121212]/95 backdrop-blur-sm
        border-t border-white/10
        shadow-[0_-4px_20px_rgba(0,0,0,0.3)]
      "
      role="navigation"
      aria-label="Navegación principal"
    >
      {useHorizontalScroll ? (
        // Scroll horizontal para provider con muchas opciones
        <div className="relative h-20">
          {/* Gradiente izquierdo para indicar scroll */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-[#121212]/95 to-transparent z-10 pointer-events-none" />
          {/* Gradiente derecho para indicar scroll */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-[#121212]/95 to-transparent z-10 pointer-events-none" />
          <div className="h-full overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth">
            <div className="flex items-center h-full px-4 gap-1 min-w-max">
              {tabs.map((tab) => {
                const active = isActive(tab.activePatterns);

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`
                    group
                    flex flex-col items-center justify-center
                    min-w-[64px] h-full
                    px-3 py-2
                    transition-all duration-200
                    relative
                    active:scale-95
                    flex-0
                  `}
                    aria-current={active ? 'page' : undefined}
                  >
                    {/* Indicador superior si está activo */}
                    {active && (
                      <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 rounded-b-full shadow-sm"
                        style={{
                          backgroundColor: '#D4AF37',
                          boxShadow: '0 1px 3px rgba(212, 175, 55, 0.5)',
                        }}
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={`
                      relative mb-1
                      transition-all duration-200
                      ${active ? 'scale-110' : 'scale-100 group-hover:scale-105'}
                    `}
                    >
                      <tab.icon
                        className="w-5 h-5"
                        style={
                          active
                            ? {
                                color: '#D4AF37',
                              }
                            : {
                                color: '#FFFFFF',
                              }
                        }
                        strokeWidth={active ? 2.5 : 2}
                        aria-hidden="true"
                      />
                      {/* Badge de notificación (opcional, para futuras features) */}
                      {active && (
                        <div
                          className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
                          style={{ backgroundColor: '#D4AF37' }}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`
                      text-[10px]
                      font-poppins
                      leading-tight
                      text-center
                      transition-colors duration-200
                      whitespace-nowrap
                      ${active ? 'font-bold' : 'font-medium'}
                    `}
                      style={
                        active
                          ? {
                              color: '#D4AF37',
                            }
                          : {
                              color: '#FFFFFF',
                            }
                      }
                    >
                      {tab.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        // Layout estándar para client o provider con pocas opciones
        <div className="flex items-center justify-between h-20 px-2 max-w-xl mx-auto">
          {tabs.map((tab) => {
            const active = isActive(tab.activePatterns);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`
                  group
                  flex flex-col items-center justify-center
                  flex-1 h-full
                  px-1 py-2
                  transition-all duration-200
                  relative
                  active:scale-95
                `}
                aria-current={active ? 'page' : undefined}
              >
                {/* Indicador superior si está activo */}
                {active && (
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 rounded-b-full shadow-sm"
                    style={{
                      backgroundColor: '#D4AF37',
                      boxShadow: '0 1px 3px rgba(212, 175, 55, 0.5)',
                    }}
                  />
                )}

                {/* Icon */}
                <div
                  className={`
                    relative mb-1
                    transition-all duration-200
                    ${active ? 'scale-110' : 'scale-100 group-hover:scale-105'}
                  `}
                >
                  <tab.icon
                    className="w-5 h-5 md:w-6 md:h-6"
                    style={
                      active
                        ? {
                            color: '#D4AF37',
                          }
                        : {
                            color: '#FFFFFF',
                          }
                    }
                    strokeWidth={active ? 2.5 : 2}
                    aria-hidden="true"
                  />
                  {/* Badge de notificación (opcional, para futuras features) */}
                  {active && (
                    <div
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: '#D4AF37' }}
                    />
                  )}
                </div>

                {/* Label - Optimizado para 6 items */}
                <span
                  className={`
                    text-[10px] md:text-xs
                    font-poppins
                    leading-tight
                    text-center
                    transition-colors duration-200
                    ${active ? 'font-bold' : 'font-medium'}
                  `}
                  style={
                    active
                      ? {
                          color: '#D4AF37',
                        }
                      : {
                          color: '#FFFFFF',
                        }
                  }
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
