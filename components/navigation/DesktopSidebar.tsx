'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Home,
  ShoppingBag,
  Briefcase,
  Calendar,
  Heart,
  User,
  Users,
  Clock,
  BarChart3,
  Star,
  LogOut,
  Bell,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  icon: LucideIcon;
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
      icon: Home,
      label: 'Dashboard',
      href: '/client',
      activePatterns: ['/client$'],
    },
    {
      icon: Calendar,
      label: 'Citas',
      href: '/client/appointments',
      activePatterns: ['/client/appointments'],
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
      icon: Heart,
      label: 'Favoritos',
      href: '/client/favorites',
      activePatterns: ['/client/favorites'],
    },
    {
      icon: User,
      label: 'Mi Perfil',
      href: '/client/profile',
      activePatterns: ['/client/profile'],
    },
  ];

  const providerItems: NavItem[] = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/provider',
      activePatterns: ['/provider$'],
    },
    {
      icon: Briefcase,
      label: 'Mis Servicios',
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
      label: 'Mi Negocio',
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

  const { logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#201d12] border-r border-white/10 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center justify-center px-6 py-6 border-b border-white/10">
        <Image
          src="/logo.png"
          alt="StyleBook Logo"
          width={240}
          height={120}
          className="h-32 w-auto object-contain"
          priority
        />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {items.map((item) => {
            const active = isActive(item.activePatterns);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    font-poppins font-medium transition-all
                    no-underline
                    ${
                      active
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                        : 'text-white hover:bg-white/5'
                    }
                  `}
                  style={
                    active
                      ? {
                          backgroundColor: 'rgba(212, 175, 55, 0.2)',
                          color: '#D4AF37',
                          borderColor: 'rgba(212, 175, 55, 0.3)',
                        }
                      : { color: '#FFFFFF' }
                  }
                  aria-current={active ? 'page' : undefined}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      active ? 'text-[#D4AF37]' : 'text-white'
                    }`}
                    style={active ? { color: '#D4AF37' } : { color: '#FFFFFF' }}
                    strokeWidth={active ? 2.5 : 2}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Cerrar Sesión */}
      <div className="px-4 py-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-white hover:bg-white/5 transition-all font-poppins font-medium"
          type="button"
        >
          <LogOut className="w-5 h-5 text-white" strokeWidth={2} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
