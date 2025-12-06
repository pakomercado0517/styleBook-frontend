'use client';

import type { ReactNode } from 'react';

type TabType = 'today' | 'upcoming' | 'pending';

interface AppointmentsTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * Tabs de filtro para appointments
 * Hoy, Próximas, Pendientes
 */
export function AppointmentsTabs({
  activeTab,
  onTabChange,
}: AppointmentsTabsProps): ReactNode {
  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'today', label: 'Hoy' },
    { id: 'upcoming', label: 'Próximas' },
    { id: 'pending', label: 'Pendientes' },
  ];

  return (
    <div className="flex gap-2 px-4 pt-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 rounded-lg font-semibold font-poppins text-sm transition-colors ${
            activeTab === tab.id
              ? 'text-primary-900'
              : 'bg-white/5 text-white border border-white/10'
          }`}
          style={
            activeTab === tab.id
              ? {
                  backgroundColor: '#D4AF37',
                }
              : undefined
          }
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

