import type { ReactNode } from 'react';
import { BottomTabBar } from '@/components/navigation/BottomTabBar';
import { MobileHeader } from '@/components/navigation/MobileHeader';
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar';
import { DesktopTopBar } from '@/components/navigation/DesktopTopBar';

interface ClientLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal para dashboard de cliente
 * - Móvil: Header sticky + contenido + Bottom Tab Bar
 * - Desktop: Sidebar + Top Bar + contenido
 */
export default function ClientLayout({
  children,
}: ClientLayoutProps): ReactNode {
  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100">
      {/* Mobile: Header */}
      <MobileHeader />

      {/* Desktop: Sidebar + Content Area */}
      <div className="hidden md:flex h-screen">
        <DesktopSidebar role="client" />

        <div className="flex-1 flex flex-col overflow-hidden">
          <DesktopTopBar />

          {/* Main Content - Scrollable */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile: Main Content con padding bottom para el tab bar */}
      <main className="md:hidden pb-20 min-h-[calc(100vh-3.5rem)]">
        {children}
      </main>

      {/* Mobile: Bottom Tab Bar */}
      <BottomTabBar role="client" />
    </div>
  );
}
