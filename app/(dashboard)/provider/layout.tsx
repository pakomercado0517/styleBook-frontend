'use client';

import type { ReactNode } from 'react';
import { BottomTabBar } from '@/components/navigation/BottomTabBar';
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar';

interface ProviderLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal para dashboard de proveedor
 * - Móvil: Contenido + Bottom Tab Bar (sin MobileHeader)
 * - Desktop: Sidebar + contenido
 */
export default function ProviderLayout({
  children,
}: ProviderLayoutProps): ReactNode {
  return (
    <div className="min-h-screen bg-[#121212]">

      {/* Desktop: Sidebar + Content Area */}
      <div className="hidden md:flex h-screen">
        <DesktopSidebar role="provider" />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Content - Scrollable */}
          <main className="flex-1 overflow-y-auto bg-[#121212]">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile: Main Content con padding bottom para el tab bar */}
      <main className="md:hidden pb-20 min-h-[calc(100vh-3.5rem)] bg-[#121212]">
        {children}
      </main>

      {/* Mobile: Bottom Tab Bar */}
      <BottomTabBar role="provider" />
    </div>
  );
}
