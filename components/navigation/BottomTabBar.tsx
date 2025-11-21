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
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-neutral-200 shadow-lg"
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="flex items-center justify-around h-16 max-w-xl mx-auto">
        {tabs.map((tab) => {
          const active = isActive(tab.activePatterns);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                flex flex-col items-center justify-center 
                min-w-[64px] h-full px-2
                transition-colors duration-200
                ${active ? 'text-accent-600' : 'text-neutral-500'}
                hover:text-accent-500
                active:scale-95
              `}
              aria-current={active ? 'page' : undefined}
            >
              {/* Icon con indicador superior si está activo */}
              <div className="relative">
                {active && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent-600 rounded-full" />
                )}
                <span className="text-2xl" role="img" aria-hidden="true">
                  {tab.icon}
                </span>
              </div>

              {/* Label */}
              <span
                className={`
                  mt-1 text-xs font-poppins font-medium
                  ${active ? 'text-accent-600' : 'text-neutral-600'}
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
