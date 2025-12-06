'use client';

import type { ReactNode } from 'react';

interface AboutUsSectionProps {
  description?: string;
}

/**
 * Sección sobre nosotros
 * Mobile: card con título y descripción
 * Desktop: texto grande sin card, parte del overview
 */
export function AboutUsSection({ description }: AboutUsSectionProps): ReactNode {
  return (
    <>
      {/* Mobile: Card */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 md:hidden">
        <h3 className="text-lg font-bold text-white font-poppins mb-4">
          Sobre Nosotros
        </h3>
        {description ? (
          <p className="text-sm text-white font-poppins leading-relaxed">
            {description}
          </p>
        ) : (
          <p className="text-sm text-neutral-400 font-poppins italic">
            No hay descripción disponible. Edita tu perfil para agregar una descripción
            de tu negocio.
          </p>
        )}
      </div>

      {/* Desktop: Texto grande sin card */}
      <div className="hidden md:block px-8 mb-6">
        {description ? (
          <p className="text-base text-white font-poppins leading-relaxed">
            {description}
          </p>
        ) : (
          <p className="text-base text-neutral-400 font-poppins italic">
            No hay descripción disponible. Edita tu perfil para agregar una descripción
            de tu negocio.
          </p>
        )}
      </div>
    </>
  );
}

