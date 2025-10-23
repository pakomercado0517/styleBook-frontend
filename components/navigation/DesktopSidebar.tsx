'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  icon: string;
  label: string;
  href: string;
  activePatterns: string[];
}

interface DesktopSidebarProps {
  role: 'client' | 'provider';
}

/**
 * Sidebar para desktop/tablet
 * Navegación lateral con items expandidos
 * Solo visible en md+ (768px+)
 */
export function DesktopSidebar({ role }: DesktopSidebarProps): ReactNode {
  const pathname = usePathname();

  const clientItems: NavItem[] = [
    {
      icon: '🏠',
      label: 'Inicio',
      href: '/client',
      activePatterns: ['/client$'],
    },
    {
      icon: '🔍',
      label: 'Buscar Servicios',
      href: '/client/search',
      activePatterns: ['/client/search'],
    },
    {
      icon: '📅',
      label: 'Mis Citas',
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
      label: 'Mi Perfil',
      href: '/client/profile',
      activePatterns: ['/client/profile'],
    },
  ];

  const providerItems: NavItem[] = [
    {
      icon: '🏠',
      label: 'Dashboard',
      href: '/provider',
      activePatterns: ['/provider$'],
    },
    {
      icon: '💼',
      label: 'Mis Servicios',
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
      label: 'Empleados',
      href: '/provider/employees',
      activePatterns: ['/provider/employees'],
    },
    {
      icon: '⏰',
      label: 'Horarios',
      href: '/provider/schedule',
      activePatterns: ['/provider/schedule'],
    },
    {
      icon: '📊',
      label: 'Analíticas',
      href: '/provider/analytics',
      activePatterns: ['/provider/analytics'],
    },
    {
      icon: '⭐',
      label: 'Reseñas',
      href: '/provider/reviews',
      activePatterns: ['/provider/reviews'],
    },
    {
      icon: '👤',
      label: 'Mi Perfil',
      href: '/provider/profile',
      activePatterns: ['/provider/profile'],
    },
  ];

  const items = role === 'client' ? clientItems : providerItems;

  const isActive = (patterns: string[]): boolean => {
    return patterns.some((pattern) => {
      const regex = new RegExp(pattern);
      return regex.test(pathname);
    });
  };

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-neutral-200 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-200">
        <div className="w-10 h-10 rounded-xl bg-gradient-luxe flex items-center justify-center">
          <span className="text-accent-400 text-2xl font-bold">S</span>
        </div>
        <span className="font-playfair text-xl font-bold text-primary-800">
          StyleBook
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = isActive(item.activePatterns);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    font-poppins font-medium transition-all
                    ${
                      active
                        ? 'bg-accent-50 text-accent-700 border-l-4 border-accent-600'
                        : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary-800'
                    }
                  `}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
