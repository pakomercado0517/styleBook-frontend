'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { FavoritesList } from './components/FavoritesList';

type TabType = 'services' | 'providers';

/**
 * Página de Favoritos - Cliente
 * Diseño mobile-first con tabs y lista de favoritos
 */
export default function FavoritesPage(): ReactNode {
  const [activeTab, setActiveTab] = useState<TabType>('services');

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Mobile Header */}
      <div className="md:hidden px-4 py-6">
        <h1 className="text-3xl font-bold text-white font-playfair mb-6">
          Favoritos
        </h1>

        {/* Tabs */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('services')}
            className={`
              px-6 py-3 rounded-lg font-semibold font-poppins transition-colors
              ${activeTab === 'services'
                ? 'text-primary-900'
                : 'bg-white/5 text-white border border-white/10'}
            `}
            style={activeTab === 'services' ? {
              backgroundColor: '#D4AF37',
            } : {}}
            type="button"
          >
            Servicios
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`
              px-6 py-3 rounded-lg font-semibold font-poppins transition-colors
              ${activeTab === 'providers'
                ? 'text-primary-900'
                : 'bg-white/5 text-white border border-white/10'}
            `}
            style={activeTab === 'providers' ? {
              backgroundColor: '#D4AF37',
            } : {}}
            type="button"
          >
            Proveedores
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white font-playfair mb-6">
            Favoritos
          </h1>

          {/* Tabs */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('services')}
              className={`
                px-6 py-3 rounded-lg font-semibold font-poppins transition-colors
                ${activeTab === 'services'
                  ? 'text-primary-900'
                  : 'bg-white/5 text-white border border-white/10'}
              `}
              style={activeTab === 'services' ? {
                backgroundColor: '#D4AF37',
              } : {}}
              type="button"
            >
              Servicios
            </button>
            <button
              onClick={() => setActiveTab('providers')}
              className={`
                px-6 py-3 rounded-lg font-semibold font-poppins transition-colors
                ${activeTab === 'providers'
                  ? 'text-primary-900'
                  : 'bg-white/5 text-white border border-white/10'}
              `}
              style={activeTab === 'providers' ? {
                backgroundColor: '#D4AF37',
              } : {}}
              type="button"
            >
              Proveedores
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Favoritos */}
      <div className="px-4 pb-6 md:px-0 md:pb-0">
        <FavoritesList filter={activeTab} />
      </div>
    </div>
  );
}
