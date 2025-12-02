'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TabItem {
  icon: string;
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
      icon: '🏠',
      label: 'Inicio',
      href: '/client',
      activePatterns: ['/client$'],
    },
    {
      icon: '🛍️',
      label: 'Servicios',
      href: '/client/services',
      activePatterns: ['/client/services'],
    },
    {
      icon: '💼',
      label: 'Proveedores',
      href: '/client/providers',
      activePatterns: ['/client/providers'],
    },
    {
      icon: '📅',
      label: 'Citas',
      href: '/client/appointments',
      activePatterns: ['/client/appointments'],
    },
    {
      icon: '❤️',
      label: 'Favoritos',
      href: '/client/favorites',
      activePatterns: ['/client/favorites'],
    },
    {
      icon: '👤',
      label: 'Perfil',
      href: '/client/profile',
      activePatterns: ['/client/profile'],
    },
  ];

  const providerTabs: TabItem[] = [
    {
      icon: '🏠',
      label: 'Inicio',
      href: '/provider',
      activePatterns: ['/provider$'],
    },
    {
      icon: '💼',
      label: 'Servicios',
      href: '/provider/services',
      activePatterns: ['/provider/services'],
    },
    {
      icon: '📅',
      label: 'Citas',
      href: '/provider/appointments',
      activePatterns: ['/provider/appointments'],
    },
    {
      icon: '👥',
      label: 'Equipo',
      href: '/provider/employees',
      activePatterns: ['/provider/employees'],
    },
    {
      icon: '👤',
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

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50 md:hidden
        bg-white/95 backdrop-blur-sm
        border-t border-neutral-200/80
        shadow-[0_-4px_20px_rgba(0,0,0,0.05)]
      "
      role="navigation"
      aria-label="Navegación principal"
    >
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
                ${active ? 'text-accent-600' : 'text-neutral-500'}
                hover:text-accent-500
                active:scale-95
              `}
              aria-current={active ? 'page' : undefined}
            >
              {/* Indicador superior si está activo */}
              {active && (
                <div
                  className="
                    absolute top-0 left-1/2 -translate-x-1/2
                    w-10 h-1
                    bg-accent-600 rounded-b-full
                    shadow-sm
                  "
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
                <span
                  className="text-xl md:text-2xl"
                  role="img"
                  aria-hidden="true"
                >
                  {tab.icon}
                </span>
                {/* Badge de notificación (opcional, para futuras features) */}
                {active && (
                  <div
                    className="
                      absolute -top-1 -right-1
                      w-2 h-2
                      bg-accent-600 rounded-full
                      animate-pulse
                    "
                  />
                )}
              </div>

              {/* Label - Optimizado para 6 items */}
              <span
                className={`
                  text-[10px] md:text-xs
                  font-poppins font-medium
                  leading-tight
                  text-center
                  transition-colors duration-200
                  ${active ? 'text-accent-600' : 'text-neutral-600'}
                  ${active ? 'font-semibold' : 'font-medium'}
                `}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
