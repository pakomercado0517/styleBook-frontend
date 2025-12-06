'use client';

import type { ReactNode } from 'react';
import { use } from 'react';
import { ProviderDetailsPage } from './components/ProviderDetailsPage';

interface ProviderDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Página de Detalle de Proveedor - Cliente
 * Muestra información completa del proveedor
 */
export default function ProviderDetailPage({
  params,
}: ProviderDetailPageProps): ReactNode {
  const { id } = use(params);
  const providerId = parseInt(id, 10);

  if (isNaN(providerId)) {
    return (
      <div className="min-h-screen bg-[#201d12] flex items-center justify-center px-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400 font-poppins">ID de proveedor inválido</p>
        </div>
      </div>
    );
  }

  return <ProviderDetailsPage providerId={providerId} />;
}

