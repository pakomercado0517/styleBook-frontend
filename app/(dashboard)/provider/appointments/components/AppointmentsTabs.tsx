'use client';

import type { ReactNode } from 'react';

export type TabType = 'today' | 'upcoming' | 'pending' | 'past';

interface AppointmentsTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * Tabs de filtro para appointments
 * Hoy, Próximas, Pendientes, Pasadas
 */
export function AppointmentsTabs({
  activeTab,
  onTabChange,
}: AppointmentsTabsProps): ReactNode {
  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'today', label: 'Hoy' },
    { id: 'upcoming', label: 'Próximas' },
    { id: 'pending', label: 'Pendientes' },
    { id: 'past', label: 'Pasadas' },
  ];

  return (
    <div className="px-4 pt-4 overflow-x-auto">
      <div className="flex gap-2 min-w-max pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 rounded-lg font-semibold font-poppins text-sm transition-colors whitespace-nowrap shrink-0 ${
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
    </div>
  );
}
